# Iniciloja Backend 🚀

Este é o backend da plataforma **Iniciloja**, desenvolvido com Node.js, Express e MongoDB. O projeto foi estruturado para ser implantado facilmente no **Railway**.

## 🛠️ Tecnologias Utilizadas

- **Node.js** (Ambiente de execução)
- **Express** (Framework web)
- **MongoDB + Mongoose** (Banco de dados e modelagem)
- **Bcryptjs** (Criptografia de senhas)
- **JSON Web Token (JWT)** (Autenticação)
- **CORS** (Segurança e acesso do frontend)

## 📁 Estrutura do Projeto

- `server.js`: Ponto de entrada da aplicação.
- `routes/`: Definição das rotas da API.
- `controllers/`: Lógica de negócio e autenticação.
- `models/`: Esquemas do banco de dados (Mongoose).

## 🚀 Como fazer o Deploy no Railway

1.  Crie uma conta no [Railway.app](https://railway.app/).
2.  Conecte seu repositório do GitHub.
3.  O Railway detectará automaticamente o arquivo `server.js` e o script `start` no `package.json`.
4.  **IMPORTANTE:** Adicione as seguintes **Variáveis de Ambiente (Variables)** no painel do Railway:
    - `MONGO_URI`: Sua string de conexão do MongoDB Atlas.
    - `JWT_SECRET`: Uma chave secreta aleatória para assinar os tokens.
    - `PORT`: (Opcional, o Railway define automaticamente).

## 🔌 Endpoints da API

### Rota de Teste
- `GET /`: Retorna "API Iniciloja funcionando".

### Autenticação
- `POST /api/auth/register`: Cadastro de novos usuários.
- `POST /api/auth/login`: Login de usuários e obtenção do token JWT.

## 🔒 Segurança (CORS)

A API está configurada para aceitar requisições apenas da URL oficial do frontend:
`https://iniciloja.netlify.app`

---
Desenvolvido para Iniciloja.
