"use client";

import { useMemo, useRef, useState } from "react";
import type { ProviderCategory } from "@/types/providers";
import { BRAZIL_STATES } from "@/lib/states";
import { OFFERED_SERVICES_OPTIONS, normalizeSelectedOfferedServices } from "@/lib/offeredServicesOptions";

const CATEGORIES: { value: ProviderCategory; label: string; emoji: string }[] = [
  { value: "construtora",  label: "Construtora / Empreiteira",   emoji: "🏗️" },
  { value: "materiais",    label: "Fornecedor de Materiais",     emoji: "🧱" },
  { value: "eletrica",     label: "Instalações Elétricas",       emoji: "⚡" },
  { value: "hidraulica",   label: "Instalações Hidráulicas",     emoji: "🔧" },
  { value: "acabamento",   label: "Acabamentos / Revestimentos", emoji: "🎨" },
  { value: "projeto",      label: "Projetos / Engenharia",       emoji: "📐" },
  { value: "equipamentos", label: "Locação de Equipamentos",     emoji: "🚜" },
  { value: "esquadrias",   label: "Esquadrias / Vidros",         emoji: "🪟" },
  { value: "outros",       label: "Outros Serviços",             emoji: "🔩" },
];

// ── Masks ──────────────────────────────────────────────
function maskCnpj(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return d
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

// ── Types ──────────────────────────────────────────────
import type { Provider } from "@/types/providers";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Provider;
}

type Step = 1 | 2 | 3;

interface FormData {
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  category: ProviderCategory | "";
  state: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  services: string[];
}

const INPUT_CLASS =
  "w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm";

const LOGO_ACCEPT = "image/png,image/jpeg,image/jpg,image/svg+xml,.png,.jpg,.jpeg,.svg";

export function ProviderRegisterModal({ onClose, onSuccess, initialData }: Props) {
  const isEditMode = !!initialData;
  const [step, setStep] = useState<Step>(isEditMode ? 2 : 1);
  const [cnpjError, setCnpjError] = useState("");
  const [step3Error, setStep3Error] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoDraft, setLogoDraft] = useState<string | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);

  const [form, setForm] = useState<FormData>({
    cnpj: initialData?.cnpj ?? "",
    nomeFantasia: initialData?.nomeFantasia ?? "",
    razaoSocial: initialData?.razaoSocial ?? "",
    category: initialData?.category ?? "",
    state: initialData?.state ?? "",
    city: initialData?.city ?? "",
    phone: initialData?.phone ?? "",
    email: initialData?.email ?? "",
    website: initialData?.website ?? "",
    description: initialData?.description ?? "",
    services: normalizeSelectedOfferedServices(initialData?.services),
  });

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleOfferedService(label: string) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(label)
        ? prev.services.filter((s) => s !== label)
        : [...prev.services, label],
    }));
  }

  const filteredServiceOptions = useMemo(() => {
    const q = serviceSearch.trim().toLowerCase();
    if (!q) return [...OFFERED_SERVICES_OPTIONS];
    return OFFERED_SERVICES_OPTIONS.filter((opt) => opt.toLowerCase().includes(q));
  }, [serviceSearch]);

  const logoPreview =
    logoDraft ?? (!logoRemoved && initialData?.logoUrl ? initialData.logoUrl : null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!ok.includes(file.type)) {
      setStep3Error("Use PNG, JPEG ou SVG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setStep3Error("A imagem deve ter no máximo 2 MB.");
      return;
    }
    setStep3Error("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoDraft(reader.result);
        setLogoRemoved(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleClearLogo() {
    setLogoDraft(null);
    if (initialData?.logoUrl) setLogoRemoved(true);
    if (logoInputRef.current) logoInputRef.current.value = "";
  }

  // ── Step 1: validate CNPJ format and advance
  function advanceFromStep1() {
    const clean = form.cnpj.replace(/\D/g, "");
    if (clean.length !== 14) {
      setCnpjError("CNPJ deve ter 14 dígitos.");
      return;
    }
    setCnpjError("");
    setStep(2);
  }

  // ── Step 3: validate required fields before submit
  function validateStep3(): boolean {
    if (!form.nomeFantasia.trim()) { setStep3Error("Informe o nome da empresa."); return false; }
    if (!form.state) { setStep3Error("Selecione o estado."); return false; }
    if (!form.city.trim()) { setStep3Error("Informe a cidade."); return false; }
    if (!form.phone.trim()) { setStep3Error("Informe o telefone."); return false; }
    if (!form.email.trim()) { setStep3Error("Informe o e-mail."); return false; }
    if (!form.description.trim()) { setStep3Error("Escreva uma descrição da empresa."); return false; }
    setStep3Error("");
    return true;
  }

  async function submit() {
    if (!validateStep3()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const body: Record<string, unknown> = {
        cnpj: form.cnpj,
        nomeFantasia: form.nomeFantasia,
        razaoSocial: form.razaoSocial || form.nomeFantasia,
        category: form.category,
        state: form.state,
        city: form.city,
        phone: form.phone,
        email: form.email,
        website: form.website,
        description: form.description,
        services: form.services,
      };
      if (logoDraft) body.logoBase64 = logoDraft;
      else if (isEditMode && logoRemoved && initialData?.logoUrl) body.clearLogo = true;

      const res = isEditMode
        ? await fetch(`/api/fornecedores/${initialData!.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/fornecedores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || (isEditMode ? "Erro ao atualizar." : "Erro ao cadastrar."));
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
              {isEditMode ? "Editar empresa" : "Cadastrar empresa"}
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {isEditMode ? `Etapa ${step - 1} de 2` : `Etapa ${step} de 3`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
          <div
            className="h-1 bg-brand-500 transition-all duration-300"
            style={{ width: isEditMode ? `${((step - 1) / 2) * 100}%` : `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 space-y-5">

          {/* ── STEP 1: CNPJ (create only) ── */}
          {step === 1 && !isEditMode && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Digite o CNPJ da sua empresa para iniciar o cadastro.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.cnpj}
                  onChange={(e) => set("cnpj", maskCnpj(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && advanceFromStep1()}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className={INPUT_CLASS}
                />
                {cnpjError && <p className="text-xs text-red-500 mt-1.5">{cnpjError}</p>}
              </div>

              <button
                onClick={advanceFromStep1}
                disabled={form.cnpj.replace(/\D/g, "").length !== 14}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Continuar →
              </button>
            </>
          )}

          {/* ── STEP 2: Categoria + Serviços ── */}
          {step === 2 && (
            <>
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl px-4 py-3">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">CNPJ</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{form.cnpj}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria principal *
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                  {CATEGORIES.map((c) => (
                    <label
                      key={c.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        form.category === c.value
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-brand-300"
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
                      <span>{c.emoji}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Serviços oferecidos <span className="text-gray-400">(opcional)</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Selecione um ou mais itens da lista.
                  {form.services.length > 0 && (
                    <span className="text-brand-600 dark:text-brand-400 font-medium">
                      {" "}
                      {form.services.length} selecionado{form.services.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </p>
                <input
                  type="search"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Buscar na lista…"
                  className={`${INPUT_CLASS} mb-2`}
                  aria-label="Filtrar serviços oferecidos"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 border border-gray-100 dark:border-gray-800 rounded-xl p-2 bg-gray-50/50 dark:bg-gray-950/30">
                  {filteredServiceOptions.length === 0 ? (
                    <p className="text-xs text-gray-500 col-span-full py-4 text-center">Nenhum resultado.</p>
                  ) : (
                    filteredServiceOptions.map((label) => {
                      const checked = form.services.includes(label);
                      return (
                        <label
                          key={label}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all text-left ${
                            checked
                              ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-brand-300 bg-white dark:bg-gray-900"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleOfferedService(label)}
                            className="accent-brand-500 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-xs text-gray-700 dark:text-gray-300 leading-snug">{label}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                {!isEditMode && (
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
                    ← Voltar
                  </button>
                )}
                <button
                  onClick={() => { if (form.category) setStep(3); }}
                  disabled={!form.category}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Continuar →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Dados da empresa ── */}
          {step === 3 && (
            <>
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da empresa *</label>
                <input
                  type="text"
                  value={form.nomeFantasia}
                  onChange={(e) => set("nomeFantasia", e.target.value)}
                  placeholder="Ex: ABC Construtora"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Logo da empresa <span className="text-gray-400">(opcional)</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  PNG, JPEG ou SVG · máx. 2 MB
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {logoPreview ? (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoPreview}
                        alt="Pré-visualização da logo"
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      />
                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                          Trocar arquivo
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept={LOGO_ACCEPT}
                            className="sr-only"
                            onChange={handleLogoChange}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleClearLogo}
                          className="text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 text-left"
                        >
                          Remover logo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-6 hover:border-brand-400 transition-colors">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept={LOGO_ACCEPT}
                        className="sr-only"
                        onChange={handleLogoChange}
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Clique para enviar logo
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Estado + Cidade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado *</label>
                  <div className="relative">
                    <select
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
                      className={`${INPUT_CLASS} appearance-none pr-8 cursor-pointer`}
                    >
                      <option value="">Selecione</option>
                      {BRAZIL_STATES.map((s) => (
                        <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Ex: São Paulo"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Telefone + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => set("phone", maskPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="contato@empresa.com"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Site */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                  placeholder="https://suaempresa.com.br"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  placeholder="Descreva sua empresa, experiência, diferenciais e área de atuação..."
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>

              {(step3Error || submitError) && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg px-3 py-2">
                  {step3Error || submitError}
                </p>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
                  ← Voltar
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {submitting
                    ? (isEditMode ? "Salvando..." : "Cadastrando...")
                    : (isEditMode ? "✓ Salvar alterações" : "✓ Cadastrar empresa")}
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
