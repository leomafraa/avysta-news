import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos e Condições | Avysta Community",
  description: "Leia os Termos e Condições de uso da plataforma Avysta Community.",
};

const LAST_UPDATED = "24 de abril de 2026";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
              avysta<span className="font-light text-gray-400">community</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-brand-500 hover:text-brand-600 font-medium"
          >
            ← Voltar ao início
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 sm:p-12">

          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              Termos e Condições
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Última atualização: {LAST_UPDATED}
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400">

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">1. Aceitação dos Termos</h2>
              <p className="leading-relaxed">
                Ao criar uma conta e utilizar a plataforma Avysta Community, você concorda integralmente com estes Termos e Condições. Caso não concorde com qualquer disposição aqui prevista, não utilize a plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">2. Descrição do Serviço</h2>
              <p className="leading-relaxed">
                A Avysta Community é uma plataforma digital voltada ao setor de construção civil no Brasil, que oferece:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
                <li>Agregação de notícias do setor em tempo real;</li>
                <li>Cotações de materiais de construção baseadas em índices como INCC e SINAPI;</li>
                <li>Diretório de fornecedores, construtoras e prestadores de serviços;</li>
                <li>Ferramentas de conexão entre compradores e fornecedores.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">3. Cadastro e Conta de Usuário</h2>
              <p className="leading-relaxed">
                Para acessar os recursos da plataforma, o usuário deve criar uma conta fornecendo informações verdadeiras, completas e atualizadas. O usuário é responsável pela confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
              </p>
              <p className="leading-relaxed mt-3">
                A Avysta Community se reserva o direito de suspender ou encerrar contas que violem estes Termos ou que forneçam informações falsas.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">4. Tipos de Conta</h2>
              <p className="leading-relaxed">
                A plataforma oferece dois perfis de usuário:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
                <li><strong className="text-gray-800 dark:text-gray-200">Comprador:</strong> usuário que busca materiais, serviços e fornecedores para suas obras e projetos.</li>
                <li><strong className="text-gray-800 dark:text-gray-200">Fornecedor:</strong> usuário que oferece produtos ou serviços para o setor de construção civil e pode cadastrar sua empresa no diretório.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">5. Uso Aceitável</h2>
              <p className="leading-relaxed">O usuário se compromete a não utilizar a plataforma para:</p>
              <ul className="list-disc list-inside mt-3 space-y-1.5 ml-2">
                <li>Publicar conteúdo falso, enganoso, difamatório ou ilegal;</li>
                <li>Violar direitos de propriedade intelectual de terceiros;</li>
                <li>Realizar atividades fraudulentas ou prejudiciais a outros usuários;</li>
                <li>Enviar spam, phishing ou comunicações não solicitadas;</li>
                <li>Tentar acessar sistemas ou dados sem autorização.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">6. Conteúdo do Usuário</h2>
              <p className="leading-relaxed">
                O usuário é o único responsável pelo conteúdo que publica na plataforma, incluindo descrições de empresas, avaliações e informações de contato. Ao publicar conteúdo, o usuário concede à Avysta Community uma licença não exclusiva para exibir, distribuir e utilizar esse conteúdo no âmbito da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">7. Privacidade e Proteção de Dados</h2>
              <p className="leading-relaxed">
                A Avysta Community trata os dados pessoais dos usuários em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Os dados coletados são utilizados exclusivamente para o funcionamento da plataforma, melhoria dos serviços e comunicações relacionadas ao seu uso.
              </p>
              <p className="leading-relaxed mt-3">
                Não vendemos nem compartilhamos dados pessoais com terceiros para fins de marketing sem o consentimento explícito do usuário.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">8. Isenção de Responsabilidade</h2>
              <p className="leading-relaxed">
                As cotações de materiais disponibilizadas na plataforma são de caráter informativo e baseadas em índices públicos. A Avysta Community não garante a precisão dos valores praticados no mercado local.
              </p>
              <p className="leading-relaxed mt-3">
                A plataforma não se responsabiliza por negociações, contratos ou transações realizadas entre compradores e fornecedores fora do ambiente da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">9. Disponibilidade do Serviço</h2>
              <p className="leading-relaxed">
                A Avysta Community envida seus melhores esforços para manter a plataforma disponível de forma contínua, porém não garante disponibilidade ininterrupta. Manutenções programadas ou emergenciais poderão ocorrer sem aviso prévio.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">10. Alterações nos Termos</h2>
              <p className="leading-relaxed">
                A Avysta Community pode atualizar estes Termos periodicamente. As alterações serão comunicadas por e-mail ou por notificação na plataforma. O uso continuado após as alterações implica na aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">11. Encerramento de Conta</h2>
              <p className="leading-relaxed">
                O usuário pode solicitar o encerramento de sua conta a qualquer momento. A Avysta Community poderá encerrar contas que violem estes Termos, sem prejuízo de outras medidas cabíveis.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">12. Lei Aplicável e Foro</h2>
              <p className="leading-relaxed">
                Estes Termos são regidos pelas leis brasileiras. Eventuais disputas serão resolvidas no foro da comarca de São Paulo — SP, com renúncia a qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">13. Contato</h2>
              <p className="leading-relaxed">
                Dúvidas sobre estes Termos podem ser enviadas para:{" "}
                <a href="mailto:contato@avysta.com.br" className="text-brand-500 hover:text-brand-600 font-medium">
                  contato@avysta.com.br
                </a>
              </p>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors text-sm"
            >
              ← Voltar e criar minha conta
            </Link>
          </div>

        </div>
      </main>

      <footer className="text-center py-8 text-xs text-gray-400 dark:text-gray-600">
        © {new Date().getFullYear()} Avysta Community · Todos os direitos reservados
      </footer>
    </div>
  );
}
