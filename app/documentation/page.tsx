"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  Code,
  Database,
  Server,
  Settings,
  Shield,
  Terminal,
  FileCode,
  Home,
  ChevronRight,
  Phone,
  Mail,
  Globe,
  Instagram,
} from "lucide-react"

export default function Documentation() {
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(id)
      setTimeout(() => setCopySuccess(null), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Documentação Técnica</h1>
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Voltar para Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="container mx-auto py-2 px-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-900">Documentação</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="installation" className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              <TabsTrigger value="installation" className="flex items-center">
                <Terminal className="mr-2 h-4 w-4" />
                <span>Instalação</span>
              </TabsTrigger>
              <TabsTrigger value="admin-setup" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>Config. Admin</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center">
                <Database className="mr-2 h-4 w-4" />
                <span>Banco de Dados</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center">
                <Server className="mr-2 h-4 w-4" />
                <span>APIs</span>
              </TabsTrigger>
              <TabsTrigger value="customization" className="flex items-center">
                <FileCode className="mr-2 h-4 w-4" />
                <span>Personalização</span>
              </TabsTrigger>
              <TabsTrigger value="troubleshooting" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Solução de Problemas</span>
              </TabsTrigger>
            </TabsList>

            {/* Installation Tab */}
            <TabsContent value="installation" className="space-y-6">
              <h2 className="text-2xl font-bold">Instalação do Sistema</h2>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Requisitos do Sistema</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Node.js 18.0.0 ou superior</li>
                    <li>NPM 8.0.0 ou superior</li>
                    <li>Conta no Firebase (Firestore, Authentication)</li>
                    <li>Conta na API Evolution para integração com WhatsApp</li>
                    <li>Vercel (recomendado para deploy) ou outro serviço de hospedagem</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Passos para Instalação</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-2">1. Clone o repositório</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md relative">
                        <code>git clone https://github.com/seu-usuario/lead-capture-system.git</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                          onClick={() =>
                            copyToClipboard("git clone https://github.com/seu-usuario/lead-capture-system.git", "clone")
                          }
                        >
                          {copySuccess === "clone" ? "Copiado!" : <Code className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">2. Instale as dependências</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md relative">
                        <code>
                          cd lead-capture-system
                          <br />
                          npm install
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard("cd lead-capture-system\nnpm install", "install")}
                        >
                          {copySuccess === "install" ? "Copiado!" : <Code className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">3. Configure as variáveis de ambiente</h4>
                      <p className="mb-2">
                        Crie um arquivo <code>.env.local</code> na raiz do projeto com as seguintes variáveis:
                      </p>
                      <div className="bg-gray-900 text-white p-4 rounded-md relative">
                        <code>
                          NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
                          <br />
                          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
                          <br />
                          NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
                          <br />
                          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
                          <br />
                          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
                          <br />
                          NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
                          <br />
                          NEXT_PUBLIC_BASE_URL=http://localhost:3000
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                          onClick={() =>
                            copyToClipboard(
                              `NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000`,
                              "env",
                            )
                          }
                        >
                          {copySuccess === "env" ? "Copiado!" : <Code className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">4. Execute o projeto em modo de desenvolvimento</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md relative">
                        <code>npm run dev</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard("npm run dev", "dev")}
                        >
                          {copySuccess === "dev" ? "Copiado!" : <Code className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">5. Build para produção</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md relative">
                        <code>
                          npm run build
                          <br />
                          npm start
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                          onClick={() => copyToClipboard("npm run build\nnpm start", "build")}
                        >
                          {copySuccess === "build" ? "Copiado!" : <Code className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Deploy na Vercel</h3>
                  <p className="mb-4">Para fazer deploy na Vercel, siga estes passos:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Crie uma conta na{" "}
                      <a
                        href="https://vercel.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Vercel
                      </a>
                    </li>
                    <li>Importe o repositório do GitHub</li>
                    <li>Configure as mesmas variáveis de ambiente listadas acima</li>
                    <li>Clique em "Deploy"</li>
                  </ol>
                  <p className="mt-4">
                    A Vercel irá automaticamente detectar que é um projeto Next.js e configurar o build corretamente.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Setup Tab */}
            <TabsContent value="admin-setup" className="space-y-6">
              <h2 className="text-2xl font-bold">Configuração de Administrador</h2>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Configuração Inicial do Admin</h3>
                  <p className="mb-4">
                    Ao adquirir o código-fonte completo, você precisará configurar o primeiro usuário administrador
                    manualmente. Siga estes passos:
                  </p>

                  <ol className="list-decimal pl-5 space-y-4">
                    <li>
                      <p className="font-medium">Crie um usuário normal através da interface</p>
                      <p className="text-sm text-gray-600">Acesse a página de cadastro e crie uma conta normalmente.</p>
                    </li>

                    <li>
                      <p className="font-medium">Acesse o Firebase Console</p>
                      <p className="text-sm text-gray-600">
                        Entre no{" "}
                        <a
                          href="https://console.firebase.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Firebase Console
                        </a>{" "}
                        e selecione seu projeto.
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Encontre o ID do usuário</p>
                      <p className="text-sm text-gray-600">
                        Vá para Authentication {">"} Users e copie o UID do usuário que você acabou de criar.
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Modifique o documento do usuário no Firestore</p>
                      <p className="text-sm text-gray-600">
                        Vá para Firestore Database {">"} Coleção "users" {">"} Documento com o ID do usuário {">"} Edite
                        o campo "role" para "admin".
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Alternativa: Use a função de utilitário</p>
                      <p className="text-sm text-gray-600">
                        O sistema inclui uma função de utilitário para promover um usuário a administrador. Você pode
                        usar o console do navegador para executá-la:
                      </p>
                      <div className="bg-gray-900 text-white p-4 rounded-md mt-2 relative">
                        <code>
                          // Abra o console do navegador (F12) e execute:
                          <br />
                          import &#123; promoteToAdmin &#125; from "./lib/admin-utils";
                          <br />
                          promoteToAdmin("ID_DO_USUARIO_AQUI");
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                          onClick={() =>
                            copyToClipboard(
                              `// Abra o console do navegador (F12) e execute:
import { promoteToAdmin } from "./lib/admin-utils";
promoteToAdmin("ID_DO_USUARIO_AQUI");`,
                              "promote",
                            )
                          }
                        >
                          {copySuccess === "promote" ? "Copiado!" : <Code className="h-4 w-4" />}
                        </Button>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Configuração da API do WhatsApp</h3>
                  <p className="mb-4">
                    O sistema utiliza a API Evolution para integração com WhatsApp. Siga estes passos para configurá-la:
                  </p>

                  <ol className="list-decimal pl-5 space-y-4">
                    <li>
                      <p className="font-medium">Crie uma conta na API Evolution</p>
                      <p className="text-sm text-gray-600">
                        Acesse{" "}
                        <a
                          href="https://api.nexuinsolution.com.br"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          API Evolution
                        </a>{" "}
                        e crie uma conta.
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Obtenha sua chave de API</p>
                      <p className="text-sm text-gray-600">
                        Após criar a conta, vá para a seção de API Keys e copie sua chave.
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Configure no sistema</p>
                      <p className="text-sm text-gray-600">
                        Como administrador, acesse Dashboard {">"} Admin {">"} Config. API e insira a URL da API e sua
                        chave.
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Configuração padrão (opcional)</p>
                      <p className="text-sm text-gray-600">
                        Se desejar, você pode modificar a configuração padrão no arquivo <code>lib/api-config.ts</code>:
                      </p>
                      <div className="bg-gray-900 text-white p-4 rounded-md mt-2 relative">
                        <code>
                          // Valores padrão
                          <br />
                          const DEFAULT_API_CONFIG: ApiConfig = &#123;
                          <br />
                          &nbsp;&nbsp;evolutionApiUrl: "https://api.nexuinsolution.com.br",
                          <br />
                          &nbsp;&nbsp;evolutionApiKey: "SUA_CHAVE_AQUI",
                          <br />
                          &#125;;
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                          onClick={() =>
                            copyToClipboard(
                              `// Valores padrão
const DEFAULT_API_CONFIG: ApiConfig = {
  evolutionApiUrl: "https://api.nexuinsolution.com.br",
  evolutionApiKey: "SUA_CHAVE_AQUI",
};`,
                              "api-config",
                            )
                          }
                        >
                          {copySuccess === "api-config" ? "Copiado!" : <Code className="h-4 w-4" />}
                        </Button>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Gerenciamento de Usuários</h3>
                  <p className="mb-4">Como administrador, você pode gerenciar todos os usuários do sistema:</p>

                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Acesse Dashboard {">"} Admin {">"} Usuários
                    </li>
                    <li>Visualize todos os usuários cadastrados</li>
                    <li>Promova usuários a administradores ou rebaixe-os para clientes</li>
                    <li>Monitore as atividades dos usuários</li>
                  </ol>

                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                    <h4 className="font-medium">Importante</h4>
                    <p>
                      Tenha cuidado ao promover usuários a administradores, pois eles terão acesso completo ao sistema,
                      incluindo configurações sensíveis e dados de todos os usuários.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Database Tab */}
            <TabsContent value="database" className="space-y-6">
              <h2 className="text-2xl font-bold">Estrutura do Banco de Dados</h2>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Coleções do Firestore</h3>
                  <p className="mb-4">
                    O sistema utiliza o Firestore como banco de dados. Abaixo está a estrutura das principais coleções:
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-2">users</h4>
                      <p className="mb-2">Armazena informações dos usuários do sistema.</p>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          &#123;
                          <br />
                          &nbsp;&nbsp;id: string, // UID do Firebase Auth
                          <br />
                          &nbsp;&nbsp;name: string,
                          <br />
                          &nbsp;&nbsp;email: string,
                          <br />
                          &nbsp;&nbsp;whatsapp: string,
                          <br />
                          &nbsp;&nbsp;role: "admin" | "client",
                          <br />
                          &nbsp;&nbsp;createdAt: timestamp,
                          <br />
                          &nbsp;&nbsp;// Campos opcionais
                          <br />
                          &nbsp;&nbsp;isCompany?: boolean,
                          <br />
                          &nbsp;&nbsp;companyName?: string,
                          <br />
                          &nbsp;&nbsp;cnpj?: string
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">campaigns</h4>
                      <p className="mb-2">Armazena as campanhas criadas pelos usuários.</p>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          &#123;
                          <br />
                          &nbsp;&nbsp;id: string, // ID gerado automaticamente
                          <br />
                          &nbsp;&nbsp;userId: string, // ID do criador da campanha
                          <br />
                          &nbsp;&nbsp;name: string,
                          <br />
                          &nbsp;&nbsp;description: string,
                          <br />
                          &nbsp;&nbsp;fields: Array&lt;&#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;id: string,
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;name: string,
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;label: string,
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;type: string,
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;required: boolean
                          <br />
                          &nbsp;&nbsp;&#125;&gt;,
                          <br />
                          &nbsp;&nbsp;lastParticipantNumber: number,
                          <br />
                          &nbsp;&nbsp;createdAt: timestamp,
                          <br />
                          &nbsp;&nbsp;raffleDate: timestamp,
                          <br />
                          &nbsp;&nbsp;winnerNumber?: string,
                          <br />
                          &nbsp;&nbsp;winnerName?: string
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">submissions</h4>
                      <p className="mb-2">Armazena as submissões dos participantes nas campanhas.</p>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          &#123;
                          <br />
                          &nbsp;&nbsp;id: string, // ID gerado automaticamente
                          <br />
                          &nbsp;&nbsp;campaignId: string,
                          <br />
                          &nbsp;&nbsp;participantNumber: string,
                          <br />
                          &nbsp;&nbsp;data: &#123; // Dados dinâmicos baseados nos campos da campanha
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;[fieldName: string]: string
                          <br />
                          &nbsp;&nbsp;&#125;,
                          <br />
                          &nbsp;&nbsp;createdAt: timestamp
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">whatsapp_instances</h4>
                      <p className="mb-2">Armazena as instâncias de WhatsApp criadas pelos usuários.</p>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          &#123;
                          <br />
                          &nbsp;&nbsp;id: string, // ID gerado automaticamente
                          <br />
                          &nbsp;&nbsp;userId: string,
                          <br />
                          &nbsp;&nbsp;instanceName: string,
                          <br />
                          &nbsp;&nbsp;status: string,
                          <br />
                          &nbsp;&nbsp;createdAt: timestamp
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">whatsapp_contacts</h4>
                      <p className="mb-2">Armazena os contatos de WhatsApp dos usuários.</p>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          &#123;
                          <br />
                          &nbsp;&nbsp;id: string, // ID no formato userId_instanceName_number
                          <br />
                          &nbsp;&nbsp;userId: string,
                          <br />
                          &nbsp;&nbsp;instanceName: string,
                          <br />
                          &nbsp;&nbsp;name: string,
                          <br />
                          &nbsp;&nbsp;number: string,
                          <br />
                          &nbsp;&nbsp;profilePictureUrl?: string,
                          <br />
                          &nbsp;&nbsp;lastMessageTimestamp?: number,
                          <br />
                          &nbsp;&nbsp;updatedAt: timestamp
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">whatsapp_messages</h4>
                      <p className="mb-2">Armazena as mensagens de WhatsApp dos usuários.</p>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          &#123;
                          <br />
                          &nbsp;&nbsp;id: string, // ID único da mensagem
                          <br />
                          &nbsp;&nbsp;userId: string,
                          <br />
                          &nbsp;&nbsp;instanceName: string,
                          <br />
                          &nbsp;&nbsp;messageId: string,
                          <br />
                          &nbsp;&nbsp;text: string,
                          <br />
                          &nbsp;&nbsp;timestamp: number,
                          <br />
                          &nbsp;&nbsp;fromMe: boolean,
                          <br />
                          &nbsp;&nbsp;sender: string,
                          <br />
                          &nbsp;&nbsp;status?: string,
                          <br />
                          &nbsp;&nbsp;createdAt: timestamp
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Regras de Segurança do Firestore</h3>
                  <p className="mb-4">Configure as regras de segurança do Firestore para proteger seus dados:</p>

                  <div className="bg-gray-900 text-white p-4 rounded-md relative">
                    <code>
                      rules_version = '2';
                      <br />
                      service cloud.firestore &#123;
                      <br />
                      &nbsp;&nbsp;match /databases/&#123;database&#125;/documents &#123;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;// Permite aos usuários ler e escrever apenas seus próprios dados
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;match /users/&#123;userId&#125; &#123;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read, write: if request.auth != null && request.auth.uid
                      == userId;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&#125;
                      <br />
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;// Permite aos usuários ler e escrever suas próprias campanhas
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;match /campaigns/&#123;campaignId&#125; &#123;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read, write: if request.auth != null &&
                      resource.data.userId == request.auth.uid;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow create: if request.auth != null;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&#125;
                      <br />
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;// Permite leitura pública para submissões, mas apenas usuários
                      autenticados podem criar
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;match /submissions/&#123;submissionId&#125; &#123;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read: if true;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow create: if request.auth != null;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&#125;
                      <br />
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;// Permite apenas usuários autenticados ler configurações de API, mas
                      apenas admins podem escrever
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;match /api_configurations/&#123;configId&#125; &#123;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read: if request.auth != null;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow write: if request.auth != null && <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;exists(/databases/$(database)/documents/users/$(request.auth.uid))
                      &&
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role
                      == "admin";
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&#125;
                      <br />
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;// Regra para a coleção whatsapp_messages
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;match /whatsapp_messages/&#123;messageId&#125; &#123;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read: if request.auth != null && resource.data.userId ==
                      request.auth.uid;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow create: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&#125;
                      <br />
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;// Regra padrão: negar todos os outros acessos
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;match /&#123;document=**&#125; &#123;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read, write: if false;
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&#125;
                      <br />
                      &nbsp;&nbsp;&#125;
                      <br />
                      &#125;
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() =>
                        copyToClipboard(
                          `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite aos usuários ler e escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Permite aos usuários ler e escrever suas próprias campanhas
    match /campaigns/{campaignId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Permite leitura pública para submissões, mas apenas usuários autenticados podem criar
    match /submissions/{submissionId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    // Permite apenas usuários autenticados ler configurações de API, mas apenas admins podem escrever
    match /api_configurations/{configId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                  exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                  get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Regra para a coleção whatsapp_messages
    match /whatsapp_messages/{messageId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Regra padrão: negar todos os outros acessos
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`,
                          "firestore-rules",
                        )
                      }
                    >
                      {copySuccess === "firestore-rules" ? "Copiado!" : <Code className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Índices do Firestore</h3>
                  <p className="mb-4">Crie os seguintes índices compostos no Firestore para otimizar as consultas:</p>

                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Coleção
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ordem
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">campaigns</td>
                        <td className="px-6 py-4 whitespace-nowrap">userId, createdAt</td>
                        <td className="px-6 py-4 whitespace-nowrap">ASC, DESC</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">submissions</td>
                        <td className="px-6 py-4 whitespace-nowrap">campaignId, createdAt</td>
                        <td className="px-6 py-4 whitespace-nowrap">ASC, DESC</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">whatsapp_messages</td>
                        <td className="px-6 py-4 whitespace-nowrap">userId, instanceName, sender, timestamp</td>
                        <td className="px-6 py-4 whitespace-nowrap">ASC, ASC, ASC, ASC</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">whatsapp_contacts</td>
                        <td className="px-6 py-4 whitespace-nowrap">userId, instanceName, lastMessageTimestamp</td>
                        <td className="px-6 py-4 whitespace-nowrap">ASC, ASC, DESC</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Tab */}
            <TabsContent value="api" className="space-y-6">
              <h2 className="text-2xl font-bold">Configuração de APIs</h2>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">API Evolution para WhatsApp</h3>
                  <p className="mb-4">
                    O sistema utiliza a API Evolution para integração com WhatsApp. Abaixo estão os principais endpoints
                    utilizados:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium mb-2">Criar Instância</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          POST /instance/create
                          <br />
                          Headers: &#123; "Content-Type": "application/json", "apikey": "SUA_CHAVE_API" &#125;
                          <br />
                          Body: &#123;
                          <br />
                          &nbsp;&nbsp;"instanceName": "nome_da_instancia",
                          <br />
                          &nbsp;&nbsp;"webhookEvents": ["GROUPS_UPSERT"],
                          <br />
                          &nbsp;&nbsp;"alwaysOnline": true,
                          <br />
                          &nbsp;&nbsp;"groupsIgnore": true,
                          <br />
                          &nbsp;&nbsp;"integration": "WHATSAPP-BAILEYS"
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Conectar Instância (Obter QR Code)</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          GET /instance/connect/&#123;instanceName&#125;
                          <br />
                          Headers: &#123; "apikey": "SUA_CHAVE_API" &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Verificar Estado da Conexão</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          GET /instance/connectionState/&#123;instanceName&#125;
                          <br />
                          Headers: &#123; "apikey": "SUA_CHAVE_API" &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Enviar Mensagem de Texto</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          POST /message/sendText/&#123;instanceName&#125;
                          <br />
                          Headers: &#123; "Content-Type": "application/json", "apikey": "SUA_CHAVE_API" &#125;
                          <br />
                          Body: &#123;
                          <br />
                          &nbsp;&nbsp;"number": "5511987654321@s.whatsapp.net",
                          <br />
                          &nbsp;&nbsp;"options": &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;"delay": 1000
                          <br />
                          &nbsp;&nbsp;&#125;,
                          <br />
                          &nbsp;&nbsp;"textMessage": &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;"text": "Sua mensagem aqui"
                          <br />
                          &nbsp;&nbsp;&#125;
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Buscar Contatos</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          POST /chat/findContacts/&#123;instanceName&#125;
                          <br />
                          Headers: &#123; "Content-Type": "application/json", "apikey": "SUA_CHAVE_API" &#125;
                          <br />
                          Body: &#123;
                          <br />
                          &nbsp;&nbsp;"where": &#123;&#125;
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Buscar Mensagens</h4>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          POST /message/findMessages/&#123;instanceName&#125;
                          <br />
                          Headers: &#123; "Content-Type": "application/json", "apikey": "SUA_CHAVE_API" &#125;
                          <br />
                          Body: &#123;
                          <br />
                          &nbsp;&nbsp;"where": &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;"key": &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"remoteJid": "5511987654321@s.whatsapp.net"
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;
                          <br />
                          &nbsp;&nbsp;&#125;,
                          <br />
                          &nbsp;&nbsp;"limit": 50,
                          <br />
                          &nbsp;&nbsp;"page": 1<br />
                          &#125;
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Configuração do Firebase</h3>
                  <p className="mb-4">
                    O sistema utiliza o Firebase para autenticação e banco de dados. Siga estes passos para
                    configurá-lo:
                  </p>

                  <ol className="list-decimal pl-5 space-y-4">
                    <li>
                      <p className="font-medium">Crie um projeto no Firebase</p>
                      <p className="text-sm text-gray-600">
                        Acesse o{" "}
                        <a
                          href="https://console.firebase.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Firebase Console
                        </a>{" "}
                        e crie um novo projeto.
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Ative a autenticação por email/senha</p>
                      <p className="text-sm text-gray-600">
                        Vá para Authentication {">"} Logs de uso (para logs de autenticação)
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Crie um banco de dados Firestore</p>
                      <p className="text-sm text-gray-600">
                        Vá para Firestore {">"} Monitor (para logs de banco de dados)
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Configure as regras de segurança</p>
                      <p className="text-sm text-gray-600">
                        Use as regras de segurança fornecidas na seção "Banco de Dados".
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Registre sua aplicação web</p>
                      <p className="text-sm text-gray-600">
                        Vá para Project Overview {">"} Add app {">"} Web e siga as instruções.
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Obtenha as credenciais</p>
                      <p className="text-sm text-gray-600">
                        Após registrar a aplicação, você receberá as credenciais (apiKey, authDomain, etc.) que deverão
                        ser adicionadas às variáveis de ambiente do projeto.
                      </p>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customization Tab */}
            <TabsContent value="customization" className="space-y-6">
              <h2 className="text-2xl font-bold">Personalização do Sistema</h2>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Personalização Visual</h3>
                  <p className="mb-4">
                    O sistema utiliza Tailwind CSS e shadcn/ui para estilização. Você pode personalizar a aparência
                    modificando os seguintes arquivos:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium mb-2">Cores e Tema</h4>
                      <p className="mb-2">
                        Modifique o arquivo <code>tailwind.config.ts</code> para alterar as cores do tema:
                      </p>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          export default &#123;
                          <br />
                          &nbsp;&nbsp;// ...
                          <br />
                          &nbsp;&nbsp;theme: &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;extend: &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;colors: &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;primary: &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DEFAULT: "#3B82F6", // Azul padrão
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;foreground: "#FFFFFF",
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Adicione mais variações aqui
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;,
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Adicione mais cores personalizadas aqui
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;,
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
                          <br />
                          &nbsp;&nbsp;// ...
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Estilos Globais</h4>
                      <p className="mb-2">
                        Modifique o arquivo <code>app/globals.css</code> para alterar estilos globais:
                      </p>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <code>
                          @tailwind base;
                          <br />
                          @tailwind components;
                          <br />
                          @tailwind utilities;
                          <br />
                          <br />
                          @layer base &#123;
                          <br />
                          &nbsp;&nbsp;:root &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;--background: 0 0% 100%;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;--foreground: 222.2 84% 4.9%;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;/* Adicione mais variáveis CSS aqui */
                          <br />
                          &nbsp;&nbsp;&#125;
                          <br />
                          <br />
                          &nbsp;&nbsp;.dark &#123;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;--background: 222.2 84% 4.9%;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;--foreground: 210 40% 98%;
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;/* Adicione mais variáveis CSS para o tema escuro aqui */
                          <br />
                          &nbsp;&nbsp;&#125;
                          <br />
                          &#125;
                        </code>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Componentes UI</h4>
                      <p className="mb-2">
                        Os componentes UI estão localizados em <code>components/ui/</code>. Você pode modificá-los para
                        alterar a aparência dos elementos da interface:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <code>button.tsx</code> - Botões
                        </li>
                        <li>
                          <code>card.tsx</code> - Cards
                        </li>
                        <li>
                          <code>input.tsx</code> - Campos de entrada
                        </li>
                        <li>
                          <code>dialog.tsx</code> - Diálogos/modais
                        </li>
                        <li>
                          <code>form.tsx</code> - Componentes de formulário
                        </li>
                        <li>E outros componentes...</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Logo e Marca</h4>
                      <p className="mb-2">Para alterar o logo e a marca do sistema:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>
                          Substitua os arquivos de imagem em <code>public/</code>
                        </li>
                        <li>
                          Atualize as referências no código, principalmente em <code>app/layout.tsx</code> e{" "}
                          <code>components/Sidebar.tsx</code>
                        </li>
                        <li>
                          Atualize o título e a descrição em <code>app/layout.tsx</code>
                        </li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Personalização Funcional</h3>
                  <p className="mb-4">
                    Você pode personalizar as funcionalidades do sistema modificando os seguintes arquivos:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium mb-2">Formulários de Campanha</h4>
                      <p className="mb-2">
                        Para personalizar os tipos de campos disponíveis nos formulários de campanha, modifique:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <code>app/dashboard/campaigns/create/page.tsx</code> - Criação de campanhas
                        </li>
                        <li>
                          <code>app/dashboard/campaigns/edit/[id]/page.tsx</code> - Edição de campanhas
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Integração com WhatsApp</h4>
                      <p className="mb-2">Para personalizar a integração com WhatsApp, modifique:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <code>lib/whatsapp-service.ts</code> - Serviços de API do WhatsApp
                        </li>
                        <li>
                          <code>lib/whatsapp-message-service.ts</code> - Serviços de mensagens
                        </li>
                        <li>
                          <code>lib/whatsapp-contact-service.ts</code> - Serviços de contatos
                        </li>
                        <li>
                          <code>components/chat/</code> - Componentes da interface de chat
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Dashboard e Relatórios</h4>
                      <p className="mb-2">Para personalizar o dashboard e os relatórios, modifique:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <code>app/dashboard/page.tsx</code> - Dashboard principal
                        </li>
                        <li>
                          <code>components/CampaignOverview.tsx</code> - Visão geral de campanhas
                        </li>
                        <li>
                          <code>components/RecentParticipants.tsx</code> - Participantes recentes
                        </li>
                        <li>
                          <code>components/CampaignChart.tsx</code> - Gráficos de campanha
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Adicionar Novas Funcionalidades</h4>
                      <p className="mb-2">Para adicionar novas funcionalidades, siga estas diretrizes:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>
                          Crie novos componentes em <code>components/</code>
                        </li>
                        <li>
                          Crie novos serviços em <code>lib/</code>
                        </li>
                        <li>
                          Crie novas páginas em <code>app/</code>
                        </li>
                        <li>
                          Atualize o menu lateral em <code>components/Sidebar.tsx</code> e{" "}
                          <code>components/MobileMenu.tsx</code>
                        </li>
                        <li>Atualize as regras de segurança do Firestore se necessário</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Personalização de Idioma</h3>
                  <p className="mb-4">
                    O sistema está atualmente em português do Brasil. Para traduzir para outros idiomas:
                  </p>

                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      <p className="font-medium">Crie um arquivo de tradução</p>
                      <p className="text-sm text-gray-600">
                        Crie um arquivo JSON com as traduções em <code>lib/i18n/</code> (você precisará criar esta
                        pasta).
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Implemente um contexto de internacionalização</p>
                      <p className="text-sm text-gray-600">
                        Crie um contexto React para gerenciar o idioma atual e fornecer as traduções.
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Substitua os textos estáticos</p>
                      <p className="text-sm text-gray-600">
                        Substitua todos os textos estáticos no código por chamadas à função de tradução.
                      </p>
                    </li>

                    <li>
                      <p className="font-medium">Adicione um seletor de idioma</p>
                      <p className="text-sm text-gray-600">
                        Adicione um componente de seleção de idioma na interface do usuário.
                      </p>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Troubleshooting Tab */}
            <TabsContent value="troubleshooting" className="space-y-6">
              <h2 className="text-2xl font-bold">Solução de Problemas</h2>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Problemas Comuns e Soluções</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-2">Erro de Autenticação</h4>
                      <p className="mb-2">
                        <strong>Problema:</strong> Usuários não conseguem fazer login ou recebem erros de autenticação.
                      </p>
                      <p className="mb-2">
                        <strong>Soluções:</strong>
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Verifique se as variáveis de ambiente do Firebase estão configuradas corretamente</li>
                        <li>Confirme se a autenticação por email/senha está ativada no Firebase Console</li>
                        <li>Verifique se o usuário existe no Firebase Authentication</li>
                        <li>Limpe os cookies e o cache do navegador</li>
                        <li>Verifique os logs do console para mensagens de erro específicas</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Erro de Conexão com WhatsApp</h4>
                      <p className="mb-2">
                        <strong>Problema:</strong> Não é possível conectar instâncias de WhatsApp ou as instâncias
                        desconectam frequentemente.
                      </p>
                      <p className="mb-2">
                        <strong>Soluções:</strong>
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Verifique se a API Evolution está configurada corretamente</li>
                        <li>Confirme se a chave da API é válida e não expirou</li>
                        <li>Verifique se o WhatsApp no dispositivo móvel está conectado à internet</li>
                        <li>Tente escanear o QR code novamente</li>
                        <li>Verifique se o WhatsApp não está aberto em outros dispositivos</li>
                        <li>Verifique os logs da API para mensagens de erro específicas</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Erro de Permissão no Firestore</h4>
                      <p className="mb-2">
                        <strong>Problema:</strong> Erros de permissão ao acessar ou modificar dados no Firestore.
                      </p>
                      <p className="mb-2">
                        <strong>Soluções:</strong>
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Verifique se as regras de segurança do Firestore estão configuradas corretamente</li>
                        <li>Confirme se o usuário está autenticado antes de acessar dados protegidos</li>
                        <li>Verifique se o usuário tem as permissões necessárias (admin vs. client)</li>
                        <li>Verifique se os índices compostos necessários foram criados</li>
                        <li>Verifique os logs do console para mensagens de erro específicas</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Erro de Índice Ausente</h4>
                      <p className="mb-2">
                        <strong>Problema:</strong> Erro "FAILED_PRECONDITION: The query requires an index" ao consultar
                        o Firestore.
                      </p>
                      <p className="mb-2">
                        <strong>Soluções:</strong>
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Clique no link fornecido no erro para criar o índice automaticamente</li>
                        <li>
                          Ou crie manualmente o índice no Firebase Console {">"} Firestore Database {">"} Indexes
                        </li>
                        <li>Aguarde alguns minutos para que o índice seja criado e propagado</li>
                        <li>Verifique se todos os índices listados na seção "Banco de Dados" foram criados</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Problemas de Desempenho</h4>
                      <p className="mb-2">
                        <strong>Problema:</strong> O sistema está lento ou não responde.
                      </p>
                      <p className="mb-2">
                        <strong>Soluções:</strong>
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>
                          Otimize as consultas ao Firestore usando índices e limitando o número de documentos retornados
                        </li>
                        <li>Implemente paginação para listas grandes de dados</li>
                        <li>Use o React Query para cache e gerenciamento de estado</li>
                        <li>Implemente lazy loading para componentes pesados</li>
                        <li>Otimize as imagens e outros recursos estáticos</li>
                        <li>Considere usar um CDN para recursos estáticos</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Erro ao Realizar Sorteio</h4>
                      <p className="mb-2">
                        <strong>Problema:</strong> Não é possível realizar sorteios ou ocorrem erros durante o processo.
                      </p>
                      <p className="mb-2">
                        <strong>Soluções:</strong>
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Verifique se há participantes registrados na campanha</li>
                        <li>Confirme se a campanha não foi encerrada ou se o sorteio já foi realizado</li>
                        <li>Verifique se o usuário tem permissão para realizar o sorteio</li>
                        <li>Verifique os logs do console para mensagens de erro específicas</li>
                        <li>Tente limpar o cache do navegador e recarregar a página</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Logs e Depuração</h3>
                  <p className="mb-4">O sistema inclui recursos de logging para ajudar na depuração de problemas:</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium mb-2">Logs do Cliente</h4>
                      <p className="mb-2">
                        Os logs do cliente são exibidos no console do navegador. Para visualizá-los:
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Abra as ferramentas de desenvolvedor do navegador (F12 ou Ctrl+Shift+I)</li>
                        <li>Vá para a aba "Console"</li>
                        <li>Observe os logs gerados pelo sistema</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Logs do Servidor</h4>
                      <p className="mb-2">
                        Os logs do servidor são exibidos no terminal onde o servidor está sendo executado:
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>
                          Observe o terminal onde você executou <code>npm run dev</code> ou <code>npm start</code>
                        </li>
                        <li>
                          Se estiver usando a Vercel, acesse o painel da Vercel {">"} Seu projeto {">"} Deployments{" "}
                          {">"} Selecione o deployment {">"} Logs
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Logs do Firebase</h4>
                      <p className="mb-2">Os logs do Firebase podem ser visualizados no Firebase Console:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>
                          Acesse o{" "}
                          <a
                            href="https://console.firebase.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Firebase Console
                          </a>
                        </li>
                        <li>Selecione seu projeto</li>
                        <li>Vá para Authentication {">"} Logs de uso (para logs de autenticação)</li>
                        <li>Vá para Firestore {">"} Monitor (para logs de banco de dados)</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium mb-2">Modo de Depuração</h4>
                      <p className="mb-2">
                        O sistema inclui um modo de depuração que pode ser ativado para exibir informações adicionais:
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>
                          Adicione <code>?debug=true</code> ao final da URL
                        </li>
                        <li>
                          Ou defina <code>localStorage.setItem('debug', 'true')</code> no console do navegador
                        </li>
                        <li>Recarregue a página para ver informações de depuração adicionais</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Suporte e Contato</h3>
                  <p className="mb-4">
                    Se você encontrar problemas que não consegue resolver, entre em contato com o desenvolvedor:
                  </p>

                  <div className="bg-gray-50 p-4 rounded-md border">
                    <h4 className="font-medium mb-2">Edson Ferreira</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-gray-500" />
                        <span>(41) 93300-8957</span>
                      </li>
                      <li className="flex items-center">
                        <Mail className="h-5 w-5 mr-3 text-gray-500" />
                        <a href="mailto:dev@edsonferreirajr.com.br" className="text-blue-600 hover:underline">
                          dev@edsonferreirajr.com.br
                        </a>
                      </li>
                      <li className="flex items-center">
                        <Globe className="h-5 w-5 mr-3 text-gray-500" />
                        <a
                          href="https://edsonferreirajr.com.br"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          edsonferreirajr.com.br
                        </a>
                      </li>
                      <li className="flex items-center">
                        <Instagram className="h-5 w-5 mr-3 text-gray-500" />
                        <a
                          href="https://instagram.com/edferreirajr"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          @edferreirajr
                        </a>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Sistema de Captura de Leads. Todos os direitos reservados.</p>
          <p className="mt-2">Desenvolvido por Edson Ferreira</p>
        </div>
      </footer>
    </div>
  )
}

