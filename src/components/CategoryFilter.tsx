"use client";

import type { NewsCategory } from "@/types/news";

const CATEGORIES: { value: NewsCategory; label: string; emoji: string }[] = [
  { value: "todos", label: "Todos", emoji: "📰" },
  { value: "materiais", label: "Materiais", emoji: "🧱" },
  { value: "mercado", label: "Mercado", emoji: "📈" },
  { value: "infraestrutura", label: "Infraestrutura", emoji: "🏗️" },
  { value: "tecnologia", label: "Tecnologia", emoji: "💡" },
  { value: "sustentabilidade", label: "Sustentabilidade", emoji: "🌿" },
  { value: "financiamento", label: "Financiamento", emoji: "💰" },
  { value: "legislacao", label: "Legislação", emoji: "⚖️" },
];

interface CategoryFilterProps {
  active: NewsCategory;
  onChange: (category: NewsCategory) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
      {CATEGORIES.map(({ value, label, emoji }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`flex-shrink-0 snap-start flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            active === value
              ? "bg-brand-500 text-white shadow-md shadow-brand-500/30 scale-105"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400"
          }`}
          aria-pressed={active === value}
        >
          <span role="img" aria-hidden="true">{emoji}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
