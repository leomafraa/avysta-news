import type { Provider, ProviderCategory } from "@/types/providers";

const CATEGORY_LABEL: Record<ProviderCategory, string> = {
  todos: "Todos",
  construtora: "Construtora",
  materiais: "Materiais",
  eletrica: "Elétrica",
  hidraulica: "Hidráulica",
  acabamento: "Acabamento",
  projeto: "Projetos",
  equipamentos: "Equipamentos",
  esquadrias: "Esquadrias",
  outros: "Outros",
};

const CATEGORY_COLOR: Record<ProviderCategory, string> = {
  todos: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  construtora:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  materiais:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  eletrica:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hidraulica:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  acabamento:
    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  projeto:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  equipamentos:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  esquadrias:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  outros: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};

const CATEGORY_EMOJI: Record<ProviderCategory, string> = {
  todos: "📦",
  construtora: "🏗️",
  materiais: "🧱",
  eletrica: "⚡",
  hidraulica: "🔧",
  acabamento: "🎨",
  projeto: "📐",
  equipamentos: "🚜",
  esquadrias: "🪟",
  outros: "🔩",
};

interface ProviderCardProps {
  provider: Provider;
  /** Ao informar, o card inteiro abre o detalhe (links de contato não disparam o card). */
  onSelect?: (provider: Provider) => void;
}

function PlanBadge({ plan }: { plan: Provider["plan"] }) {
  if (plan === "premium")
    return (
      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm">
        ⭐ Premium
      </span>
    );
  if (plan === "verificado")
    return (
      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400">
        ✓ Verificado
      </span>
    );
  return null;
}

export function ProviderCard({ provider: p, onSelect }: ProviderCardProps) {
  const initial = (p.nomeFantasia || p.razaoSocial)[0].toUpperCase();
  const interactive = !!onSelect;

  return (
    <article
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden ${
        interactive
          ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          : ""
      }`}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onSelect(p) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(p);
              }
            }
          : undefined
      }
    >
      {/* Top accent for premium */}
      {p.plan === "premium" && (
        <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {/* Avatar / logo */}
          {p.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.logoUrl}
              alt={`Logo ${p.nomeFantasia || p.razaoSocial}`}
              className="aspect-square w-12 rounded-xl flex-shrink-0 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-extrabold flex-shrink-0 ${
                p.plan === "premium"
                  ? "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-orange-600 dark:text-orange-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {initial}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-1">
                {p.nomeFantasia || p.razaoSocial}
              </h3>
              <PlanBadge plan={p.plan} />
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[p.category]}`}
              >
                {CATEGORY_EMOJI[p.category]} {CATEGORY_LABEL[p.category]}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                📍 {p.city}, {p.state}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1 mb-4">
          {p.description}
        </p>

        {/* Services */}
        {p.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.services.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full border border-gray-100 dark:border-gray-700"
              >
                {s}
              </span>
            ))}
            {p.services.length > 3 && (
              <span className="text-xs px-2 py-0.5 text-gray-400 dark:text-gray-600">
                +{p.services.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Contact */}
        <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {p.phone && (
              <a
                href={`tel:${p.phone.replace(/\D/g, "")}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                title={p.phone}
              >
                📞 <span className="hidden sm:inline">{p.phone}</span>
                <span className="sm:hidden">Ligar</span>
              </a>
            )}
            {p.email && (
              <a
                href={`mailto:${p.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                ✉️{" "}
                <span className="hidden sm:inline truncate max-w-[120px]">
                  {p.email}
                </span>
                <span className="sm:hidden">Email</span>
              </a>
            )}
          </div>
          {p.website && (
            <a
              href={p.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors flex-shrink-0"
            >
              Site ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
