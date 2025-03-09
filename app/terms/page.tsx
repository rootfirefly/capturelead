import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Termos de Uso e Política de Privacidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Aceitação dos Termos</h2>
            <p>
              Ao preencher este formulário e participar de nossas campanhas, você concorda com estes termos de uso e
              nossa política de privacidade. Por favor, leia-os atentamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Consentimento para Recebimento de Mensagens</h2>
            <p>
              Ao fornecer seu número de WhatsApp e aceitar estes termos, você expressamente concorda em receber
              mensagens relacionadas à campanha na qual está se inscrevendo. Estas mensagens podem incluir:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Confirmação de sua participação</li>
              <li>Informações sobre o andamento da campanha</li>
              <li>Resultados de sorteios (quando aplicável)</li>
              <li>Ofertas e promoções relacionadas à campanha</li>
            </ul>
            <p className="mt-2">
              Você pode optar por não receber mais mensagens a qualquer momento, respondendo "SAIR" a qualquer mensagem
              recebida.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Proteção de Dados (LGPD)</h2>
            <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), informamos que:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Seus dados pessoais serão tratados de forma segura e confidencial.</li>
              <li>
                Coletamos apenas os dados necessários para sua participação na campanha e para cumprir obrigações
                legais.
              </li>
              <li>Seus dados serão utilizados exclusivamente para os fins especificados nestes termos.</li>
              <li>Não compartilharemos seus dados com terceiros sem seu consentimento expresso.</li>
              <li>
                Você tem o direito de acessar, corrigir, excluir seus dados ou revogar seu consentimento a qualquer
                momento.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Finalidade do Tratamento de Dados</h2>
            <p>Seus dados pessoais serão utilizados para:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Gerenciar sua participação na campanha</li>
              <li>Enviar comunicações relevantes via WhatsApp</li>
              <li>Realizar sorteios (quando aplicável)</li>
              <li>Melhorar nossos serviços e sua experiência como cliente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Seus Direitos como Titular dos Dados</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Confirmar a existência de tratamento de seus dados</li>
              <li>Acessar seus dados</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos</li>
              <li>Solicitar a portabilidade de seus dados</li>
              <li>Revogar seu consentimento a qualquer momento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Segurança dos Dados</h2>
            <p>
              Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais contra
              acesso não autorizado, alteração, divulgação ou destruição não autorizada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Período de Retenção</h2>
            <p>
              Manteremos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais
              foram coletados, incluindo para fins de cumprimento de quaisquer obrigações legais, contratuais, de
              prestação de contas ou requisição de autoridades competentes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Alterações nos Termos</h2>
            <p>
              Podemos atualizar estes termos periodicamente. Recomendamos que você revise esta página regularmente para
              se manter informado sobre quaisquer mudanças.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes termos, nossa política de privacidade ou o tratamento de seus dados,
              entre em contato conosco:
            </p>
            <p className="mt-2">
              E-mail: privacidade@captaleadqr.com
              <br />
              WhatsApp: (XX) XXXXX-XXXX
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}

