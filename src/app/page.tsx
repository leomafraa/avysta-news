"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { UserType } from "@/types/user";

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10)
    return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

const TYPES: { value: UserType; label: string; emoji: string; desc: string }[] = [
  { value: "comprador", label: "Comprador", emoji: "🛒", desc: "Busco materiais, serviços e fornecedores para minha obra." },
  { value: "fornecedor", label: "Fornecedor", emoji: "🏗️", desc: "Ofereço produtos ou serviços para construção civil." },
];

const FEATURES = [
  { icon: "📰", title: "Notícias do setor", desc: "Fique por dentro do mercado de construção civil em tempo real." },
  { icon: "💹", title: "Cotações de materiais", desc: "Acompanhe variações de preços baseadas no INCC e SINAPI." },
  { icon: "🏗️", title: "Diretório de fornecedores", desc: "Encontre construtoras e prestadores verificados em todo o Brasil." },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<UserType | "">("");
  const [form, setForm] = useState({
    name: "",
    empresaNomeFantasia: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/noticias");
  }, [user, loading, router]);

  function set(field: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name, empresaNomeFantasia, email, phone, password, confirmPassword } = form;
    if (!name.trim()) { setError("Informe seu nome."); return; }
    if (type === "comprador" && !empresaNomeFantasia.trim()) {
      setError("Informe o nome fantasia da empresa.");
      return;
    }
    if (!email.trim()) { setError("Informe seu e-mail."); return; }
    if (!phone.trim()) { setError("Informe seu telefone."); return; }
    if (!password || password.length < 8) { setError("A senha deve ter pelo menos 8 caracteres."); return; }
    if (password !== confirmPassword) { setError("As senhas não coincidem."); return; }
    if (!acceptedTerms) { setError("Você precisa aceitar os Termos e Condições para continuar."); return; }
    setSubmitting(true);
    setError("");
    setSuccessMessage("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          type,
          password,
          ...(type === "comprador" && {
            empresaNomeFantasia: empresaNomeFantasia.trim(),
          }),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erro ao cadastrar."); return; }
      if (data.needsEmailConfirmation) {
        setSuccessMessage(data.message || "Verifique seu e-mail para ativar a conta.");
        setStep(1);
        setForm({
          name: "",
          empresaNomeFantasia: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setType("");
        setAcceptedTerms(false);
        return;
      }
      login(data.token, data.refreshToken, data.user);
      router.push("/noticias");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left: Branding ── */}
      <div className="lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#020617]">
              <Image
                src="/brand/avysta-logo.png"
                alt="Logo Avysta"
                width={40}
                height={40}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-2xl tracking-tight">
              avysta<span className="font-light opacity-80">community</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            A maior comunidade da<br />
            <span className="text-brand-200">construção civil</span><br />
            no Brasil
          </h1>
          <p className="text-brand-100 text-lg leading-relaxed mb-12 max-w-md">
            Notícias, cotações de materiais e diretório de fornecedores para compradores e profissionais do setor.
          </p>

          <div className="space-y-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-white">{f.title}</p>
                  <p className="text-brand-200 text-sm mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-brand-300 text-xs mt-12 hidden lg:block">
          © {new Date().getFullYear()} Avysta Community · Gratuito para todos
        </p>
      </div>

      {/* ── Right: Registration ── */}
      <div className="lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Criar conta grátis</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {step === 1 ? "Como você usa a plataforma?" : "Informe seus dados"}
            </p>
            {successMessage && (
              <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl px-4 py-3">
                {successMessage}{" "}
                <Link href="/login" className="font-semibold underline underline-offset-2">
                  Ir para o login
                </Link>
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"}`} />
            ))}
          </div>

          {/* Step 1: Choose type */}
          {step === 1 && (
            <div className="space-y-4">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { setType(t.value); setError(""); }}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${type === t.value
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-brand-300"
                    }`}
                >
                  <span className="text-3xl">{t.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{t.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
                  </div>
                  {type === t.value && (
                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                onClick={() => { if (!type) { setError("Selecione o tipo de conta."); return; } setError(""); setStep(2); }}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors text-sm"
              >
                Continuar →
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Já tem conta?{" "}
                <Link href="/login" className="text-brand-500 hover:text-brand-600 font-semibold">Entrar</Link>
              </p>
            </div>
          )}

          {/* Step 2: Fill data */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                <span>{TYPES.find((t) => t.value === type)?.emoji}</span>
                <span>Conta <strong>{TYPES.find((t) => t.value === type)?.label}</strong></span>
                <button type="button" onClick={() => setStep(1)} className="ml-auto text-brand-500 hover:text-brand-600 font-medium">Alterar</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome completo *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="João da Silva"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              {type === "comprador" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Empresa (Nome Fantasia) *
                  </label>
                  <input
                    type="text"
                    value={form.empresaNomeFantasia}
                    onChange={(e) => set("empresaNomeFantasia", e.target.value)}
                    placeholder="Ex: Construtora Silva"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => set("phone", maskPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar senha *</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => { setAcceptedTerms(e.target.checked); if (e.target.checked) setError(""); }}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-colors flex items-center justify-center">
                    {acceptedTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Li e concordo com os{" "}
                  <Link href="/termos" target="_blank" className="text-brand-500 hover:text-brand-600 font-semibold underline underline-offset-2">
                    Termos e Condições
                  </Link>{" "}
                  de uso da plataforma Avysta Community.
                </span>
              </label>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg px-3 py-2">{error}</p>
              )}

              <button type="submit" disabled={submitting || !acceptedTerms} className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm">
                {submitting ? "Criando conta..." : "✓ Criar conta grátis"}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Já tem conta?{" "}
                <Link href="/login" className="text-brand-500 hover:text-brand-600 font-semibold">Entrar</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
