# Prog4 — API de Artigos com Autenticação JWT

API REST em NestJS com TypeORM, MySQL e autenticação JWT. Gerencia o cadastro de usuários e o ciclo de vida completo de Artigos (título, conteúdo, imagem e ordem de exibição).

## Tecnologias

- NestJS 11
- TypeORM + MySQL
- JWT (Passport)
- bcrypt (hash de senha)
- Jest (testes unitários)
- class-validator

## 1. Instalação

```bash
npm install
```

## 2. Configuração do ambiente

O projeto usa MySQL com as seguintes credenciais fixas em `src/app.module.ts`:

| Campo | Valor |
|---|---|
| host | localhost |
| port | 3306 |
| username | nestuser |
| password | nest123 |
| database | prog4 |

Crie o usuário e o banco no MySQL antes de rodar a aplicação:

```sql
CREATE DATABASE prog4;
CREATE USER 'nestuser'@'localhost' IDENTIFIED BY 'nest123';
GRANT ALL PRIVILEGES ON prog4.* TO 'nestuser'@'localhost';
FLUSH PRIVILEGES;
```

O `synchronize: true` no TypeORM cria as tabelas automaticamente na primeira execução.

## 3. Executando a aplicação

```bash
npm run start:dev
```

A API sobe em `http://localhost:3000`.

## 4. Executando os testes

```bash
npm run test
```

Cobertura:

```bash
npm run test:cov
```

## 5. Endpoints da API

### Autenticação (`/auth`)

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | /auth/register | Não | Cria um novo usuário |
| POST | /auth/login | Não | Autentica e retorna o `access_token` |

**Body de `/auth/register`:**
```json
{
  "name": "Ryan",
  "email": "ryan@teste.com",
  "password": "senha123"
}
```

**Body de `/auth/login`:**
```json
{
  "email": "ryan@teste.com",
  "password": "senha123"
}
```

**Resposta de `/auth/login`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Todas as rotas de `/articles` exigem o header:
```
Authorization: Bearer <access_token>
```

### Usuários (`/user`)

| Método | Rota | Descrição |
|---|---|---|
| GET | /user | Lista todos os usuários |
| GET | /user/:id | Busca um usuário pelo id |
| POST | /user | Cria um usuário |
| PATCH | /user/:id | Atualiza um usuário |
| DELETE | /user/:id | Remove um usuário |

### Artigos (`/articles`)

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | /articles | Sim | Cria um novo artigo |
| GET | /articles | Sim | Lista todos os artigos ordenados pelo campo `ordem` |
| GET | /articles/:id | Sim | Busca um artigo pelo id |
| PATCH | /articles/:id | Sim | Atualiza um artigo existente |
| DELETE | /articles/:id | Sim | Remove um artigo |

**Body de criação/atualização de artigo:**
```json
{
  "titulo": "Título do artigo",
  "conteudo": "Conteúdo completo do artigo",
  "imagemUrl": "https://exemplo.com/imagem.png",
  "ordem": 1
}
```

## 6. Estrutura do projeto

```
src/
  modules/
    user/
      user.entity.ts
      user.controller.ts
      user.service.ts
      user.module.ts
      dto/
    article/
      article.entity.ts
      article.controller.ts
      article.service.ts
      article.service.spec.ts
      article.module.ts
      dto/
  auth/
    auth.controller.ts
    auth.service.ts
    auth.module.ts
    dto/
    strategies/
      jwt.strategy.ts
    guards/
      jwt-auth.guard.ts
  app.module.ts
  main.ts
```

## 7. Front-end

Um front-end simples (HTML/CSS/JS puro) está em `frontend/`. Ele consome a API dinamicamente: tela de login/registro e uma lista de artigos com criação, edição e remoção.

Para usar:

1. Suba a API (`npm run start:dev`, porta 3000).
2. Abra `frontend/index.html` diretamente no navegador (duplo clique ou `open frontend/index.html` no Mac).
3. Registre um usuário, faça login e gerencie os artigos pela interface.

O token JWT é guardado no `localStorage` do navegador; ao clicar em "Sair" ele é removido e a tela de login volta a aparecer.

## 8. Integração com o Front-end (resumo técnico)

Nenhum dado é mockado no front-end. O fluxo é:

1. O front-end chama `POST /auth/login` e guarda o `access_token` retornado.
2. Toda chamada para `/articles` envia `Authorization: Bearer <access_token>` no header.
3. Listagem, criação, edição e remoção de artigos ocorrem via `fetch`, de forma assíncrona, direto na API.
