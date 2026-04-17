import type { MaterialWithPrice, ImpactLevel } from "@/types/prices";

const IMPACT_LABEL: Record<ImpactLevel, string> = {
  alto: "Alto impacto",
  medio: "Médio impacto",
  baixo: "Baixo impacto",
};

const IMPACT_COLOR: Record<ImpactLevel, string> = {
  alto: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medio: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  baixo: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

interface PriceCardProps {
  material: MaterialWithPrice;
}

function TrendBadge({ value, label }: { value: number; label: string }) {
  const isUp = value > 0;
  const isNeutral = Math.abs(value) < 0.05;

  return (
    <div
      className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        isNeutral
          ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          : isUp
          ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
          : "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
      }`}
    >
      <span>{isNeutral ? "—" : isUp ? "▲" : "▼"}</span>
      <span>{Math.abs(value).toFixed(2)}%</span>
      <span className="font-normal text-gray-400 dark:text-gray-600">{label}</span>
    </div>
  );
}

export function PriceCard({ material: m }: PriceCardProps) {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  return (
    <article className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 pb-3 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
          {m.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">
            {m.name}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{m.unit}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${IMPACT_COLOR[m.impact]}`}>
          {IMPACT_LABEL[m.impact]}
        </span>
      </div>

      {/* Price */}
      <div className="px-5 pb-3">
        <div className="flex items-end gap-2 flex-wrap">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {formatter.format(m.currentPrice)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
            /{m.unit.split(" ")[0]}
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Faixa: {formatter.format(m.priceMin)} – {formatter.format(m.priceMax)}
        </p>
      </div>

      {/* Variation badges */}
      <div className="px-5 pb-4 flex flex-wrap gap-2">
        <TrendBadge value={m.variation30d} label="30d" />
        <TrendBadge value={m.variation12m} label="12m" />
        <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium">
          {m.costShare}% do custo
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pb-4 flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {m.description}
        </p>
      </div>

      {/* Tips */}
      <div className="px-5 pb-5 pt-3 border-t border-gray-50 dark:border-gray-800">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
          💡 Dicas de compra
        </p>
        <ul className="space-y-1.5">
          {m.tips.slice(0, 2).map((tip, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="text-brand-400 mt-0.5 flex-shrink-0">›</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
