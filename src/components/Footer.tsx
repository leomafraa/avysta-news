import Link from "next/link";
import Image from "next/image";
import { NewspaperIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/noticias" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#020617]">
                <Image
                  src="/brand/avysta-logo.png"
                  alt="Logo Avysta"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                avysta<span className="text-brand-500 font-light">comunidade</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Portal de notícias especializado em construção civil no Brasil. Informação de qualidade para profissionais e compradores.
            </p>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Categorias
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/noticias?category=materiais", label: "Materiais de Construção" },
                { href: "/noticias?category=mercado", label: "Mercado Imobiliário" },
                { href: "/noticias?category=infraestrutura", label: "Infraestrutura" },
                { href: "/noticias?category=tecnologia", label: "Tecnologia" },
                { href: "/noticias?category=sustentabilidade", label: "Sustentabilidade" },
                { href: "/noticias?category=financiamento", label: "Financiamento" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Em breve */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Em Breve
            </h3>
            <ul className="space-y-2">
              {[
                "Login de usuários",
                "Área Premium",
                "Newsletter",
                "Alertas personalizados",
                "App mobile",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400 dark:text-gray-500">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center">
          <p className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1.5">
            <NewspaperIcon className="w-3.5 h-3.5" />
            © {new Date().getFullYear()} Avysta Comunidade. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
