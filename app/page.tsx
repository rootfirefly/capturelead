import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Mail, Phone, Globe, FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Hero Section */}
      <header className="container mx-auto py-12 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Sistema de Captura de Leads</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Plataforma completa para gerenciamento de campanhas, captura de leads e comunicação via WhatsApp. Automatize
          seu processo de vendas e aumente sua conversão.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Cadastre-se</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/documentation" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Documentação
            </Link>
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">O que nosso sistema oferece</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Gestão de Campanhas</h3>
              <p>
                Crie e gerencie múltiplas campanhas de captação de leads. Configure formulários personalizados,
                acompanhe resultados e organize seus contatos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Integração com WhatsApp</h3>
              <p>
                Comunique-se diretamente com seus leads via WhatsApp. Envie mensagens, acompanhe conversas e mantenha um
                histórico completo de interações.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Sorteios e Promoções</h3>
              <p>
                Realize sorteios de forma transparente e automatizada. Cada participante recebe um número único e o
                sistema seleciona o vencedor aleatoriamente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Formulários Personalizados</h3>
              <p>
                Crie formulários com campos personalizados para capturar exatamente as informações que você precisa dos
                seus leads.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">QR Codes para Campanhas</h3>
              <p>
                Gere QR codes para suas campanhas e facilite o acesso dos participantes aos seus formulários de
                captação.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Análise de Resultados</h3>
              <p>Acompanhe o desempenho das suas campanhas com estatísticas detalhadas e relatórios personalizados.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto py-16 bg-gray-50 px-4 rounded-lg">
        <h2 className="text-3xl font-bold mb-12 text-center">Perguntas Frequentes</h2>

        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>Como configurar minha primeira campanha?</AccordionTrigger>
            <AccordionContent>
              <p>Para configurar sua primeira campanha, siga estes passos:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                <li>Faça login no sistema e acesse o Dashboard</li>
                <li>Clique em "Campanhas" no menu lateral</li>
                <li>Selecione "Criar Nova Campanha"</li>
                <li>Preencha o nome, descrição e data do sorteio (se aplicável)</li>
                <li>Configure os campos do formulário que deseja utilizar</li>
                <li>Salve a campanha e compartilhe o link ou QR code gerado</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Como integrar o WhatsApp ao sistema?</AccordionTrigger>
            <AccordionContent>
              <p>A integração com WhatsApp é feita através da API Evolution. Siga estes passos:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                <li>Acesse a seção "WhatsApp" no menu lateral</li>
                <li>Clique em "Criar Instância"</li>
                <li>Dê um nome para sua instância e clique em "Criar"</li>
                <li>Escaneie o QR code com seu WhatsApp para conectar</li>
                <li>Após conectado, você poderá enviar e receber mensagens diretamente pelo sistema</li>
              </ol>
              <p className="mt-2">
                Nota: É necessário ter uma conta na API Evolution. As configurações padrão já estão incluídas no
                sistema, mas podem ser personalizadas na seção de Configurações da API.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Como realizar um sorteio?</AccordionTrigger>
            <AccordionContent>
              <p>Para realizar um sorteio, siga estas etapas:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                <li>Crie uma campanha com a opção de sorteio habilitada</li>
                <li>Defina a data do sorteio ao criar a campanha</li>
                <li>Compartilhe o link da campanha para coletar participantes</li>
                <li>Quando chegar a data do sorteio, acesse a seção "Sorteador da Campanha"</li>
                <li>Clique em "Realizar Sorteio" para selecionar um vencedor aleatoriamente</li>
                <li>O sistema registrará o vencedor e você poderá compartilhar o resultado</li>
              </ol>
              <p className="mt-2">
                Cada participante recebe um número único ao se inscrever, garantindo a transparência do processo.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Como exportar os dados dos participantes?</AccordionTrigger>
            <AccordionContent>
              <p>Para exportar os dados dos participantes de uma campanha:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                <li>Acesse a seção "Campanhas" no menu lateral</li>
                <li>Localize a campanha desejada e clique no ícone de participantes</li>
                <li>Na janela que se abre, clique em "Download CSV"</li>
                <li>O arquivo será baixado contendo todos os dados dos participantes</li>
              </ol>
              <p className="mt-2">
                O sistema exporta todos os campos preenchidos pelos participantes, incluindo nome, email, telefone e
                quaisquer campos personalizados que você tenha configurado.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Como personalizar os campos do formulário?</AccordionTrigger>
            <AccordionContent>
              <p>Ao criar ou editar uma campanha, você pode personalizar os campos do formulário:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                <li>Na seção "Campos do Formulário", clique em "Adicionar Campo"</li>
                <li>Defina o nome interno do campo (usado no sistema)</li>
                <li>Defina o rótulo do campo (exibido para o usuário)</li>
                <li>Selecione o tipo de campo (texto, email, telefone, número)</li>
                <li>Defina se o campo é obrigatório ou opcional</li>
                <li>Repita o processo para adicionar mais campos conforme necessário</li>
              </ol>
              <p className="mt-2">
                Você pode adicionar quantos campos forem necessários e organizá-los na ordem desejada.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>Como configurar as permissões de usuários?</AccordionTrigger>
            <AccordionContent>
              <p>O sistema possui dois níveis de permissão:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  <strong>Cliente:</strong> Pode criar e gerenciar campanhas, acessar o WhatsApp e visualizar
                  relatórios.
                </li>
                <li>
                  <strong>Administrador:</strong> Possui todas as permissões de cliente, além de poder gerenciar
                  usuários, configurar a API e acessar funcionalidades avançadas.
                </li>
              </ul>
              <p className="mt-2">Para alterar as permissões de um usuário:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                <li>Acesse a seção "Usuários" no menu de administração</li>
                <li>Localize o usuário desejado</li>
                <li>Clique no botão "Promover a Admin" ou "Rebaixar para Cliente" conforme necessário</li>
              </ol>
              <p className="mt-2">Apenas administradores podem alterar permissões de usuários.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>Como incorporar o formulário em meu site?</AccordionTrigger>
            <AccordionContent>
              <p>Você pode incorporar o formulário de uma campanha em seu site usando um iframe:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-2">
                <li>Acesse a seção "Campanhas" no menu lateral</li>
                <li>Localize a campanha desejada</li>
                <li>Clique em "Copiar Código de Incorporação"</li>
                <li>Cole o código HTML em seu site onde deseja que o formulário apareça</li>
              </ol>
              <p className="mt-2">O código gerado é responsivo e se adaptará automaticamente ao layout do seu site.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>Quais são os requisitos técnicos para usar o sistema?</AccordionTrigger>
            <AccordionContent>
              <p>O sistema foi projetado para ser acessível e fácil de usar. Os requisitos técnicos são:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Navegador web moderno (Chrome, Firefox, Safari, Edge)</li>
                <li>Conexão com a internet</li>
                <li>Para a integração com WhatsApp: um número de telefone ativo com WhatsApp</li>
                <li>Para configurações avançadas: conhecimento básico de APIs (opcional)</li>
              </ul>
              <p className="mt-2">
                Não é necessário instalar nenhum software adicional, pois o sistema funciona inteiramente na nuvem.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Creator Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Idealizador e Criador</h2>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                Desenvolvedor & Empreendedor
              </div>
              <h3 className="block mt-1 text-2xl leading-tight font-medium text-black">Edson Ferreira</h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-gray-500" />
                  <span>(41) 93300-8957</span>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <a href="mailto:dev@edsonferreirajr.com.br" className="text-blue-600 hover:underline">
                    dev@edsonferreirajr.com.br
                  </a>
                </div>

                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-3 text-gray-500" />
                  <a
                    href="https://edsonferreirajr.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    edsonferreirajr.com.br
                  </a>
                </div>

                <div className="flex items-center">
                  <Instagram className="h-5 w-5 mr-3 text-gray-500" />
                  <a
                    href="https://instagram.com/edferreirajr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @edferreirajr
                  </a>
                </div>
              </div>

              <p className="mt-6 text-gray-600">
                Especialista em desenvolvimento de soluções tecnológicas para negócios. Criador do Sistema de Captura de
                Leads, uma plataforma completa para gerenciamento de campanhas e automação de marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Comece a usar hoje mesmo</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transforme sua estratégia de captação de leads e aumente suas conversões com nossa plataforma completa.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Criar Conta Grátis</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent hover:bg-blue-700 text-white border-white"
            >
              <Link href="/login">Já tenho uma conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Sistema de Captura de Leads. Todos os direitos reservados.</p>
            <p className="mt-2">Desenvolvido por Edson Ferreira</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

