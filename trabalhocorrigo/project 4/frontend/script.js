const API_URL = 'http://localhost:3000';

const authSection = document.getElementById('auth-section');
const livrosSection = document.getElementById('livros');
const logoutLink = document.getElementById('logout-link');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterButton = document.getElementById('show-register');
const showLoginButton = document.getElementById('show-login');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const registerSuccess = document.getElementById('register-success');
const authTitle = document.getElementById('auth-title');

const livroForm = document.getElementById('livro-form');
const livroIdInput = document.getElementById('livro-id');
const livroTituloInput = document.getElementById('livro-titulo');
const livroConteudoInput = document.getElementById('livro-conteudo');
const livroImagemInput = document.getElementById('livro-imagem');
const livroOrdemInput = document.getElementById('livro-ordem');
const livroError = document.getElementById('livro-error');
const livroCancelButton = document.getElementById('livro-cancel');
const livroFormTitle = document.getElementById('livro-form-title');
const livrosList = document.getElementById('livros-list');

function getToken() {
  return localStorage.getItem('access_token');
}

function setToken(token) {
  localStorage.setItem('access_token', token);
}

function clearToken() {
  localStorage.removeItem('access_token');
}

function resolveImagem(imagemUrl) {
  if (!imagemUrl) {
    return 'https://placehold.co/130x180?text=Sem+capa';
  }
  if (imagemUrl.startsWith('http')) {
    return imagemUrl;
  }
  return `img/${imagemUrl}`;
}

function showApp() {
  authSection.classList.add('hidden');
  livrosSection.classList.remove('hidden');
  logoutLink.classList.remove('hidden');
  loadLivros();
}

function showAuth() {
  livrosSection.classList.add('hidden');
  authSection.classList.remove('hidden');
  logoutLink.classList.add('hidden');
}

showRegisterButton.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  showRegisterButton.classList.add('hidden');
  registerForm.classList.remove('hidden');
  showLoginButton.classList.remove('hidden');
  authTitle.textContent = 'Criar conta';
});

showLoginButton.addEventListener('click', () => {
  registerForm.classList.add('hidden');
  showLoginButton.classList.add('hidden');
  loginForm.classList.remove('hidden');
  showRegisterButton.classList.remove('hidden');
  authTitle.textContent = 'Entrar';
});

logoutLink.addEventListener('click', (event) => {
  event.preventDefault();
  clearToken();
  showAuth();
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

async function loadLivros() {
  livrosList.innerHTML = '<p>Carregando...</p>';

  try {
    const response = await apiFetch('/articles');
    const livros = await response.json();

    if (!livros.length) {
      livrosList.innerHTML = '<p>Nenhum livro cadastrado ainda.</p>';
      return;
    }

    livrosList.innerHTML = '';
    livros.forEach((livro) => {
      livrosList.appendChild(renderLivroCard(livro));
    });
  } catch (error) {
    livrosList.innerHTML = '<p>Erro ao carregar os livros.</p>';
  }
}

function renderLivroCard(livro) {
  const card = document.createElement('div');
  card.className = 'Livro_card';

  const image = document.createElement('img');
  image.src = resolveImagem(livro.imagemUrl);
  image.alt = livro.titulo;

  const titulo = document.createElement('div');
  titulo.className = 'titulo';
  titulo.textContent = livro.titulo;

  const ordem = document.createElement('div');
  ordem.className = 'ordem';
  ordem.textContent = `Ordem: ${livro.ordem}`;

  const sinopse = document.createElement('div');
  sinopse.className = 'sinopse';
  sinopse.textContent = livro.conteudo;

  const acoes = document.createElement('div');
  acoes.className = 'acoes';

  const editButton = document.createElement('button');
  editButton.textContent = 'Editar';
  editButton.addEventListener('click', () => startEdit(livro));

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir';
  deleteButton.addEventListener('click', () => deleteLivro(livro.id));

  acoes.appendChild(editButton);
  acoes.appendChild(deleteButton);

  card.appendChild(image);
  card.appendChild(titulo);
  card.appendChild(ordem);
  card.appendChild(sinopse);
  card.appendChild(acoes);

  return card;
}

function startEdit(livro) {
  livroIdInput.value = livro.id;
  livroTituloInput.value = livro.titulo;
  livroConteudoInput.value = livro.conteudo;
  livroImagemInput.value = livro.imagemUrl || '';
  livroOrdemInput.value = livro.ordem;
  livroFormTitle.textContent = 'Editar livro';
  livroCancelButton.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  livroForm.reset();
  livroIdInput.value = '';
  livroFormTitle.textContent = 'Novo livro';
  livroCancelButton.classList.add('hidden');
}

livroCancelButton.addEventListener('click', resetForm);

livroForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  livroError.textContent = '';

  const payload = {
    titulo: livroTituloInput.value,
    conteudo: livroConteudoInput.value,
    imagemUrl: livroImagemInput.value || undefined,
    ordem: Number(livroOrdemInput.value) || 0,
  };

  const id = livroIdInput.value;

  try {
    const response = await apiFetch(id ? `/articles/${id}` : '/articles', {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      livroError.textContent = errorData.message || 'Erro ao salvar livro';
      return;
    }

    resetForm();
    loadLivros();
  } catch (error) {
    livroError.textContent = 'Não foi possível conectar à API';
  }
});

async function deleteLivro(id) {
  const confirmed = confirm('Tem certeza que deseja excluir este livro?');
  if (!confirmed) {
    return;
  }

  try {
    await apiFetch(`/articles/${id}`, { method: 'DELETE' });
    loadLivros();
  } catch (error) {
    livrosList.innerHTML = '<p>Erro ao excluir livro.</p>';
  }
}

if (getToken()) {
  showApp();
} else {
  showAuth();
}
