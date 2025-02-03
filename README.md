# Sistema React + Firebase + Bootstrap

Este é um sistema desenvolvido em React, integrado com Firebase e estilizado com Bootstrap. Ele foi projetado para fornecer um ambiente funcional e moderno para aplicações web.

## 🚀 Tecnologias Utilizadas

- React: Biblioteca JavaScript para construção de interfaces de usuário.
- Firebase: Backend como serviço, usado para autenticação, banco de dados e hospedagem.
- Bootstrap: Framework CSS para estilização e design responsivo.

## 🌟 Funcionalidades

- Autenticação de usuários.
- Integração com Firestore (banco de dados).
- Sistema responsivo com Bootstrap.

## 🌐 Hospedagem

O sistema está hospedado no Firebase Hosting e pode ser acessado por meio do seguinte link:
[https://sistema-de-avaliacao-a90c8.web.app/](https://sistema-de-avaliacao-a90c8.web.app/)

## 🛠️ Configuração do Projeto

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Crie um novo projeto.
3. Vá até **Configurações do Projeto** > **Configurações Gerais** e copie as credenciais (API Key, Auth Domain, etc.).
4. No diretório raiz do projeto, crie um arquivo `.env` com o seguinte conteúdo:

```env
REACT_APP_FIREBASE_API_KEY=coloque-sua-chave-aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=coloque-seu-dominio-aqui
REACT_APP_FIREBASE_PROJECT_ID=coloque-seu-id-do-projeto-aqui
REACT_APP_FIREBASE_STORAGE_BUCKET=coloque-seu-bucket-aqui
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=coloque-seu-sender-id-aqui
REACT_APP_FIREBASE_APP_ID=coloque-seu-app-id-aqui
```

### 4. Inicie o Servidor de Desenvolvimento

```bash
npm start
```

O sistema estará disponível em `http://localhost:3000`.

## 📂 Estrutura do Projeto

```plaintext
/src
  /components  # Componentes reutilizáveis
  /firebase.js # Configuração do Firebase
  /App.js      # Componente principal do aplicativo
  /index.js    # Ponto de entrada do React
```

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

