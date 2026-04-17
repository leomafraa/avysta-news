"use client";

import { useState } from "react";
import type { ProviderCategory } from "@/types/providers";
import type { CnpjApiData } from "@/types/providers";

const CATEGORIES: { value: ProviderCategory; label: string; emoji: string }[] = [
  { value: "construtora",  label: "Construtora / Empreiteira", emoji: "🏗️" },
  { value: "materiais",    label: "Fornecedor de Materiais",   emoji: "🧱" },
  { value: "eletrica",     label: "Instalações Elétricas",     emoji: "⚡" },
  { value: "hidraulica",   label: "Instalações Hidráulicas",   emoji: "🔧" },
  { value: "acabamento",   label: "Acabamentos / Revestimentos",emoji: "🎨" },
  { value: "projeto",      label: "Projetos / Engenharia",     emoji: "📐" },
  { value: "equipamentos", label: "Locação de Equipamentos",   emoji: "🚜" },
  { value: "esquadrias",   label: "Esquadrias / Vidros",       emoji: "🪟" },
  { value: "outros",       label: "Outros Serviços",           emoji: "🔩" },
];

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 1 | 2 | 3;

interface FormData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  category: ProviderCategory | "";
  state: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  services: string;
  cnae: string;
  cnaeDescricao: string;
}

export function ProviderRegisterModal({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState<FormData>({
    cnpj: "", razaoSocial: "", nomeFantasia: "", category: "",
    state: "", city: "", phone: "", email: "", website: "",
    description: "", services: "", cnae: "", cnaeDescricao: "",
  });

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function lookupCnpj() {
    const clean = form.cnpj.replace(/\D/g, "");
    if (clean.length !== 14) {
      setCnpjError("CNPJ deve ter 14 dígitos.");
      return;
    }
    setCnpjLoading(true);
    setCnpjError("");
    try {
      const res = await fetch(`/api/fornecedores/cnpj/${clean}`);
      const data = await res.json();
      if (!res.ok) {
        setCnpjError(data.error || "CNPJ não encontrado.");
        return;
      }
      const d = data as CnpjApiData;
      setForm((prev) => ({
        ...prev,
        cnpj: d.cnpj,
        razaoSocial: d.razaoSocial,
        nomeFantasia: d.nomeFantasia || d.razaoSocial,
        state: d.state,
        city: d.city,
        phone: d.phone || prev.phone,
        email: d.email || prev.email,
        cnae: d.cnae,
        cnaeDescricao: d.cnaeDescricao,
      }));
      setStep(2);
    } catch {
      setCnpjError("Erro ao consultar CNPJ. Verifique sua conexão.");
    } finally {
      setCnpjLoading(false);
    }
  }

  async function submit() {
    if (!form.category || !form.description.trim()) {
      setSubmitError("Preencha a categoria e a descrição.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const services = form.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, services }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Erro ao cadastrar.");
        return;
      }
      onSuccess();
    } catch {
      setSubmitError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Cadastrar empresa
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Etapa {step} de 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
          <div
            className="h-1 bg-brand-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 space-y-5">
          {/* ── STEP 1: CNPJ ── */}
          {step === 1 && (
            <>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Digite o CNPJ da sua empresa. Vamos buscar os dados automaticamente na Receita Federal.
                </p>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={form.cnpj}
                  onChange={(e) => set("cnpj", e.target.value)}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                {cnpjError && (
                  <p className="text-xs text-red-500 mt-1.5">⚠️ {cnpjError}</p>
                )}
              </div>
              <button
                onClick={lookupCnpj}
                disabled={cnpjLoading || form.cnpj.replace(/\D/g, "").length !== 14}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {cnpjLoading ? "Consultando Receita Federal..." : "Consultar CNPJ →"}
              </button>
              <p className="text-xs text-center text-gray-400 dark:text-gray-600">
                Apenas empresas com situação ATIVA podem se cadastrar.
              </p>
            </>
          )}

          {/* ── STEP 2: Category + Services ── */}
          {step === 2 && (
            <>
              {/* Company info (read-only from CNPJ) */}
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                  ✓ Empresa encontrada
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{form.nomeFantasia}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{form.razaoSocial}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{form.city}, {form.state} · {form.cnpj}</p>
                {form.cnaeDescricao && (
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">CNAE: {form.cnaeDescricao}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria principal *
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {CATEGORIES.map((c) => (
                    <label
                      key={c.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        form.category === c.value
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={c.value}
                        checked={form.category === c.value}
                        onChange={() => set("category", c.value)}
                        className="accent-brand-500"
                      />
                      <span className="text-base">{c.emoji}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Serviços oferecidos
                </label>
                <input
                  type="text"
                  value={form.services}
                  onChange={(e) => set("services", e.target.value)}
                  placeholder="Ex: Construção residencial, Reformas, Fundações"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Separe por vírgula</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  ← Voltar
                </button>
                <button
                  onClick={() => form.category && setStep(3)}
                  disabled={!form.category}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Contact + Description ── */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da empresa *
                </label>
                <input
                  type="text"
                  value={form.nomeFantasia}
                  onChange={(e) => set("nomeFantasia", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone *</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site (opcional)</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://suaempresa.com.br"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição da empresa *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  placeholder="Descreva sua empresa, experiência, diferenciais e área de atuação..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
                />
              </div>

              {submitError && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg px-3 py-2">
                  ⚠️ {submitError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  ← Voltar
                </button>
                <button
                  onClick={submit}
                  disabled={submitting || !form.description.trim() || !form.phone || !form.email}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {submitting ? "Cadastrando..." : "✓ Cadastrar empresa"}
                </button>
              </div>

              <p className="text-xs text-center text-gray-400 dark:text-gray-600">
                Ao cadastrar, você concorda que os dados serão exibidos publicamente no diretório.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
