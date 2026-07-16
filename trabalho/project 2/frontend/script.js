const API_URL = 'http://localhost:3000';

const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterButton = document.getElementById('show-register');
const showLoginButton = document.getElementById('show-login');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const registerSuccess = document.getElementById('register-success');

const logoutButton = document.getElementById('logout-button');
const articleForm = document.getElementById('article-form');
const articleIdInput = document.getElementById('article-id');
const articleTituloInput = document.getElementById('article-titulo');
const articleConteudoInput = document.getElementById('article-conteudo');
const articleImagemInput = document.getElementById('article-imagem');
const articleOrdemInput = document.getElementById('article-ordem');
const articleError = document.getElementById('article-error');
const articleCancelButton = document.getElementById('article-cancel');
const formTitle = document.getElementById('form-title');
const articlesList = document.getElementById('articles-list');

function getToken() {
  return localStorage.getItem('access_token');
}

function setToken(token) {
  localStorage.setItem('access_token', token);
}

function clearToken() {
  localStorage.removeItem('access_token');
}

function showApp() {
  authScreen.classList.add('hidden');
  appScreen.classList.remove('hidden');
  loadArticles();
}

function showAuth() {
  appScreen.classList.add('hidden');
  authScreen.classList.remove('hidden');
}

showRegisterButton.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  showRegisterButton.classList.add('hidden');
  registerForm.classList.remove('hidden');
  showLoginButton.classList.remove('hidden');
});

showLoginButton.addEventListener('click', () => {
  registerForm.classList.add('hidden');
  showLoginButton.classList.add('hidden');
  loginForm.classList.remove('hidden');
  showRegisterButton.classList.remove('hidden');
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      loginError.textContent = 'E-mail ou senha inválidos';
      return;
    }

    const data = await response.json();
    setToken(data.access_token);
    loginForm.reset();
    showApp();
  } catch (error) {
    loginError.textContent = 'Não foi possível conectar à API';
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  registerError.textContent = '';
  registerSuccess.textContent = '';

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      registerError.textContent = errorData.message || 'Erro ao registrar';
      return;
    }

    registerForm.reset();
    registerSuccess.textContent = 'Conta criada! Agora faça login.';
  } catch (error) {
    registerError.textContent = 'Não foi possível conectar à API';
  }
});

logoutButton.addEventListener('click', () => {
  clearToken();
  showAuth();
});

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearToken();
    showAuth();
    throw new Error('Sessão expirada');
  }

  return response;
}

async function loadArticles() {
  articlesList.innerHTML = '<p class="empty-state">Carregando...</p>';

  try {
    const response = await apiFetch('/articles');
    const articles = await response.json();

    if (!articles.length) {
      articlesList.innerHTML = '<p class="empty-state">Nenhum artigo cadastrado ainda.</p>';
      return;
    }

    articlesList.innerHTML = '';
    articles.forEach((article) => {
      articlesList.appendChild(renderArticleCard(article));
    });
  } catch (error) {
    articlesList.innerHTML = '<p class="empty-state">Erro ao carregar artigos.</p>';
  }
}

function renderArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'article-card';

  const image = document.createElement('img');
  image.src = article.imagemUrl || 'https://placehold.co/96x96?text=Sem+imagem';
  image.alt = article.titulo;

  const content = document.createElement('div');
  content.className = 'article-content';

  const title = document.createElement('h3');
  title.textContent = article.titulo;

  const meta = document.createElement('div');
  meta.className = 'article-meta';
  meta.textContent = `Ordem: ${article.ordem}`;

  const body = document.createElement('p');
  body.textContent = article.conteudo;

  const actions = document.createElement('div');
  actions.className = 'article-actions';

  const editButton = document.createElement('button');
  editButton.className = 'secondary';
  editButton.textContent = 'Editar';
  editButton.addEventListener('click', () => startEdit(article));

  const deleteButton = document.createElement('button');
  deleteButton.className = 'secondary';
  deleteButton.textContent = 'Excluir';
  deleteButton.addEventListener('click', () => deleteArticle(article.id));

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  content.appendChild(title);
  content.appendChild(meta);
  content.appendChild(body);
  content.appendChild(actions);

  card.appendChild(image);
  card.appendChild(content);

  return card;
}

function startEdit(article) {
  articleIdInput.value = article.id;
  articleTituloInput.value = article.titulo;
  articleConteudoInput.value = article.conteudo;
  articleImagemInput.value = article.imagemUrl || '';
  articleOrdemInput.value = article.ordem;
  formTitle.textContent = 'Editar artigo';
  articleCancelButton.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  articleForm.reset();
  articleIdInput.value = '';
  formTitle.textContent = 'Novo artigo';
  articleCancelButton.classList.add('hidden');
}

articleCancelButton.addEventListener('click', resetForm);

articleForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  articleError.textContent = '';

  const payload = {
    titulo: articleTituloInput.value,
    conteudo: articleConteudoInput.value,
    imagemUrl: articleImagemInput.value || undefined,
    ordem: Number(articleOrdemInput.value) || 0,
  };

  const id = articleIdInput.value;

  try {
    const response = await apiFetch(id ? `/articles/${id}` : '/articles', {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      articleError.textContent = errorData.message || 'Erro ao salvar artigo';
      return;
    }

    resetForm();
    loadArticles();
  } catch (error) {
    articleError.textContent = 'Não foi possível conectar à API';
  }
});

async function deleteArticle(id) {
  const confirmed = confirm('Tem certeza que deseja excluir este artigo?');
  if (!confirmed) {
    return;
  }

  try {
    await apiFetch(`/articles/${id}`, { method: 'DELETE' });
    loadArticles();
  } catch (error) {
    articlesList.innerHTML = '<p class="empty-state">Erro ao excluir artigo.</p>';
  }
}

if (getToken()) {
  showApp();
} else {
  showAuth();
}
