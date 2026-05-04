"use client";

import { useEffect } from "react";
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

function maskCnpj(cnpj: string): string {
  const d = cnpj.replace(/\D/g, "").slice(0, 14);
  if (d.length !== 14) return cnpj;
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function websiteHref(url: string): string {
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function PlanBadge({ plan }: { plan: Provider["plan"] }) {
  if (plan === "premium") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm">
        Premium
      </span>
    );
  }
  if (plan === "verificado") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400">
        Verificado
      </span>
    );
  }
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
      Plano gratuito
    </span>
  );
}

interface Props {
  provider: Provider;
  onClose: () => void;
}

export function ProviderDetailModal({ provider: p, onClose }: Props) {
  const displayName = p.nomeFantasia || p.razaoSocial;
  const initial = displayName.charAt(0).toUpperCase();
  const created = p.createdAt
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(p.createdAt))
    : null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provider-detail-title"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <h2 id="provider-detail-title" className="text-lg font-bold text-gray-900 dark:text-white truncate pr-2">
            {displayName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {p.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.logoUrl}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/30 text-brand-700 dark:text-brand-300 flex-shrink-0">
                {initial}
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <PlanBadge plan={p.plan} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {CATEGORY_EMOJI[p.category]} {CATEGORY_LABEL[p.category]}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {p.city}, {p.state}
              </p>
            </div>
          </div>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                Razão social
              </dt>
              <dd className="text-gray-900 dark:text-white">{p.razaoSocial || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                Nome fantasia
              </dt>
              <dd className="text-gray-900 dark:text-white">{p.nomeFantasia || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                CNPJ
              </dt>
              <dd className="text-gray-900 dark:text-white font-mono">{maskCnpj(p.cnpj)}</dd>
            </div>
            {(p.cnae || p.cnaeDescricao) && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                  CNAE
                </dt>
                <dd className="text-gray-900 dark:text-white">
                  {p.cnae && <span className="font-mono">{p.cnae}</span>}
                  {p.cnae && p.cnaeDescricao && <span className="mx-1">·</span>}
                  {p.cnaeDescricao && <span>{p.cnaeDescricao}</span>}
                </dd>
              </div>
            )}
          </dl>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
              Sobre a empresa
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {p.description?.trim() || "Sem descrição cadastrada."}
            </p>
          </div>

          {p.services.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
                Serviços oferecidos
              </h3>
              <div className="flex flex-wrap gap-2">
                {p.services.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
              Contato
            </h3>
            <ul className="space-y-2 text-sm">
              {p.phone && (
                <li>
                  <a
                    href={`tel:${p.phone.replace(/\D/g, "")}`}
                    className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
                  >
                    {p.phone}
                  </a>
                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">Telefone</span>
                </li>
              )}
              {p.email && (
                <li>
                  <a
                    href={`mailto:${p.email}`}
                    className="text-brand-600 dark:text-brand-400 font-medium hover:underline break-all"
                  >
                    {p.email}
                  </a>
                </li>
              )}
              {p.website?.trim() && (
                <li>
                  <a
                    href={websiteHref(p.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 dark:text-brand-400 font-medium hover:underline break-all"
                  >
                    {p.website.trim()}
                  </a>
                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">Site</span>
                </li>
              )}
            </ul>
          </div>

          {created && (
            <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
              Cadastro no diretório: {created}
            </p>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
