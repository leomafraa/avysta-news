"use client";

import { useState } from "react";
import type { NewsCategory } from "@/types/news";

interface NewsImageProps {
  src: string | null;
  alt: string;
  category?: NewsCategory;
  className?: string;
}

const CATEGORY_THEME: Record<
  string,
  { from: string; to: string; icon: string; label: string }
> = {
  materiais:       { from: "from-amber-50",   to: "to-amber-100",   icon: "🧱", label: "Materiais" },
  mercado:         { from: "from-blue-50",    to: "to-blue-100",    icon: "📈", label: "Mercado" },
  infraestrutura:  { from: "from-green-50",   to: "to-green-100",   icon: "🏗️", label: "Infraestrutura" },
  tecnologia:      { from: "from-purple-50",  to: "to-purple-100",  icon: "💡", label: "Tecnologia" },
  sustentabilidade:{ from: "from-emerald-50", to: "to-emerald-100", icon: "🌿", label: "Sustentabilidade" },
  financiamento:   { from: "from-indigo-50",  to: "to-indigo-100",  icon: "💰", label: "Financiamento" },
  legislacao:      { from: "from-rose-50",    to: "to-rose-100",    icon: "⚖️", label: "Legislação" },
  todos:           { from: "from-gray-50",    to: "to-gray-100",    icon: "📰", label: "Notícias" },
};

const DARK_CATEGORY_THEME: Record<string, { from: string; to: string }> = {
  materiais:       { from: "dark:from-amber-950/40",    to: "dark:to-amber-900/30" },
  mercado:         { from: "dark:from-blue-950/40",     to: "dark:to-blue-900/30" },
  infraestrutura:  { from: "dark:from-green-950/40",    to: "dark:to-green-900/30" },
  tecnologia:      { from: "dark:from-purple-950/40",   to: "dark:to-purple-900/30" },
  sustentabilidade:{ from: "dark:from-emerald-950/40",  to: "dark:to-emerald-900/30" },
  financiamento:   { from: "dark:from-indigo-950/40",   to: "dark:to-indigo-900/30" },
  legislacao:      { from: "dark:from-rose-950/40",     to: "dark:to-rose-900/30" },
  todos:           { from: "dark:from-gray-900",        to: "dark:to-gray-800" },
};

function Placeholder({ category }: { category?: NewsCategory }) {
  const key = category || "todos";
  const theme = CATEGORY_THEME[key] || CATEGORY_THEME.todos;
  const dark = DARK_CATEGORY_THEME[key] || DARK_CATEGORY_THEME.todos;

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${theme.from} ${theme.to} ${dark.from} ${dark.to}`}
    >
      <span className="text-4xl mb-1.5 select-none" role="img" aria-hidden>
        {theme.icon}
      </span>
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wide uppercase">
        {theme.label}
      </span>
    </div>
  );
}

export function NewsImage({ src, alt, category, className = "" }: NewsImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <Placeholder category={category} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
    />
  );
}
