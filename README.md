# Lead Capture System

Bem-vindo ao **Lead Capture System**, um sistema robusto para captura de leads integrado ao WhatsApp via API Evolution e gerenciado com Firebase (Firestore e Authentication). Este projeto permite criar campanhas, gerenciar usuários, contatos e mensagens de WhatsApp, além de oferecer uma interface administrativa completa.

**Link do Repositório:** [https://github.com/rootfirefly/capturelead.git](https://github.com/rootfirefly/capturelead.git)

## Requisitos do Sistema

- **Node.js**: 18.0.0 ou superior
- **NPM**: 8.0.0 ou superior
- **Firebase**: Conta com Firestore e Authentication configurados
- **API Evolution**: Conta para integração com WhatsApp
- **Hospedagem**: Vercel (recomendado) ou outro serviço compatível

## Passos para Instalação

1. **Clone o Repositório**
   ```bash
   git clone https://github.com/rootfirefly/capturelead.git
   ```

2. **Instale as Dependências**
   ```bash
   cd capturelead
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Execute em Modo de Desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Build para Produção**
   ```bash
   npm run build
   npm start
   ```

## Configuração de Administrador

### Configuração Inicial do Admin
Para configurar o primeiro administrador:

1. **Crie um Usuário Normal**
   - Acesse a interface de cadastro e crie uma conta.

2. **Acesse o Firebase Console**
   - Vá para **Authentication > Users** e copie o UID do usuário criado.

3. **Promova o Usuário no Firestore**
   - No **Firestore Database > Coleção "users"**, edite o documento do usuário e altere o campo `role` para `"admin"`.

4. **Alternativa via Função de Utilitário**
   - Abra o console do navegador (F12) e execute:
     ```javascript
     import { promoteToAdmin } from "./lib/admin-utils";
     promoteToAdmin("ID_DO_USUARIO_AQUI");
     ```

## Configuração da API do WhatsApp

1. **Crie uma Conta na API Evolution**
   - Acesse [API Evolution](https://api.nexuinsolution.com.br) e obtenha sua chave de API.

2. **Configure no Sistema**
   - Como administrador, vá para **Dashboard > Admin > Config. API** e insira a URL da API e a chave.

3. **Configuração Padrão (Opcional)**
   - Edite o arquivo `lib/api-config.ts`:
     ```javascript
     const DEFAULT_API_CONFIG: ApiConfig = {
       evolutionApiUrl: "https://api.nexuinsolution.com.br",
       evolutionApiKey: "SUA_CHAVE_AQUI",
     };
     ```

## Gerenciamento de Usuários

Como administrador, acesse **Dashboard > Admin > Usuários** para:
- Visualizar todos os usuários cadastrados.
- Promover ou rebaixar usuários entre os papéis "admin" e "client".
- Monitorar atividades.

**Atenção:** Administradores têm acesso total ao sistema, incluindo dados sensíveis. Promova usuários com cuidado.

## Estrutura do Banco de Dados

O sistema utiliza o **Firestore** com as seguintes coleções principais:

- **`users`**  
  Armazena informações dos usuários.
  ```json
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "whatsapp": "string",
    "role": "admin | client",
    "createdAt": "timestamp"
  }
  ```

- **`campaigns`**  
  Armazena campanhas criadas.
  ```json
  {
    "id": "string",
    "userId": "string",
    "name": "string",
    "description": "string",
    "fields": [
      {
        "id": "string",
        "name": "string",
        "label": "string",
        "type": "string",
        "required": "boolean"
      }
    ],
    "lastParticipantNumber": "number",
    "createdAt": "timestamp",
    "raffleDate": "timestamp"
  }
  ```

- **`submissions`**  
  Armazena submissões de participantes.
  ```json
  {
    "id": "string",
    "campaignId": "string",
    "participantNumber": "string",
    "data": { "fieldName": "string" },
    "createdAt": "timestamp"
  }
  ```

- **`whatsapp_instances`**  
  Armazena instâncias de WhatsApp.
  ```json
  {
    "id": "string",
    "userId": "string",
    "instanceName": "string",
    "status": "string",
    "createdAt": "timestamp"
  }
  ```

- **`whatsapp_contacts`**  
  Armazena contatos do WhatsApp.
  ```json
  {
    "id": "string",
    "userId": "string",
    "instanceName": "string",
    "name": "string",
    "number": "string",
    "profilePictureUrl": "string",
    "lastMessageTimestamp": "number",
    "updatedAt": "timestamp"
  }
  ```

- **`whatsapp_messages`**  
  Armazena mensagens do WhatsApp.
  ```json
  {
    "id": "string",
    "userId": "string",
    "instanceName": "string",
    "messageId": "string",
    "text": "string",
    "timestamp": "number",
    "fromMe": "boolean",
    "sender": "string",
    "status": "string",
    "createdAt": "timestamp"
  }
  ```

## Regras de Segurança do Firestore

Configure as regras no Firebase para proteger os dados:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /campaigns/{campaignId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    match /submissions/{submissionId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    match /api_configurations/{configId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /whatsapp_messages/{messageId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Índices do Firestore

Crie os seguintes índices para otimizar consultas:

| Coleção            | Campos                            | Ordem         |
|--------------------|-----------------------------------|---------------|
| `campaigns`        | `userId, createdAt`              | ASC, DESC     |
| `submissions`      | `campaignId, createdAt`          | ASC, DESC     |
| `whatsapp_messages`| `userId, instanceName, sender, timestamp` | ASC, ASC, ASC, ASC |
| `whatsapp_contacts`| `userId, instanceName, lastMessageTimestamp` | ASC, ASC, DESC |

## Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests no repositório: [https://github.com/rootfirefly/capturelead.git](https://github.com/rootfirefly/capturelead.git).

## Licença

Este projeto é distribuído sob a licença [MIT](LICENSE).
