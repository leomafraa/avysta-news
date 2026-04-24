"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10)
    return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export default function LoginPageWrapper() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login } = useAuth();
  const next = searchParams.get("next") || "/noticias";

  const [credential, setCredential] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace("/noticias");
  }, [user, loading, router]);

  const looksLikePhone = /^\(?\d/.test(credential) && !/[@]/.test(credential);

  function handleCredential(val: string) {
    setCredential(looksLikePhone || /^\d/.test(val) ? maskPhone(val) : val);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!credential.trim()) { setError("Informe seu e-mail ou telefone."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credential.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erro ao entrar."); return; }
      login(data.token, data.user);
      router.push(next);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left: Branding strip ── */}
      <div className="lg:w-2/5 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-2xl tracking-tight">
            avysta<span className="font-light opacity-80">community</span>
          </span>
        </Link>

        <div className="hidden lg:block">
          <h2 className="text-3xl font-extrabold leading-snug mb-4">
            Bem-vindo<br />de volta 👋
          </h2>
          <p className="text-brand-100 text-base leading-relaxed max-w-xs">
            Entre com seu e-mail ou telefone cadastrado para acessar notícias, cotações e fornecedores.
          </p>
        </div>

        <p className="text-brand-300 text-xs hidden lg:block">
          © {new Date().getFullYear()} Avysta Community
        </p>
      </div>

      {/* ── Right: Login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              avysta<span className="text-brand-500 font-light">community</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Entrar na conta</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use o e-mail ou telefone que você cadastrou
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                E-mail ou Telefone
              </label>
              <input
                type="text"
                value={credential}
                onChange={(e) => handleCredential(e.target.value)}
                placeholder="seu@email.com ou (11) 99999-9999"
                autoFocus
                autoComplete="username"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3">
                ⚠️ {error}
                {error.includes("Nenhuma conta") && (
                  <span className="block mt-1">
                    <Link href="/" className="text-brand-500 font-semibold hover:text-brand-600">
                      Criar conta grátis →
                    </Link>
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors shadow-md shadow-brand-500/20 text-sm"
            >
              {submitting ? "Verificando..." : "Entrar →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Não tem conta?{" "}
            <Link href="/" className="text-brand-500 hover:text-brand-600 font-semibold">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
