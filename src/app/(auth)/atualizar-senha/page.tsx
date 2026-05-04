"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabaseBrowser";

export default function AtualizarSenhaPage() {
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const hash =
          typeof window !== "undefined"
            ? window.location.hash.replace(/^#/, "")
            : "";
        if (!hash) {
          if (!cancelled) {
            setInitError(
              "Link inválido ou expirado. Solicite um novo e-mail em Esqueci minha senha.",
            );
          }
          return;
        }
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const type = params.get("type");

        if (type !== "recovery" || !access_token || !refresh_token) {
          if (!cancelled) {
            setInitError(
              "Link inválido ou expirado. Solicite um novo e-mail em Esqueci minha senha.",
            );
          }
          return;
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (sessionError) {
          if (!cancelled) {
            setInitError(
              "Não foi possível validar o link. Solicite um novo e-mail.",
            );
          }
          return;
        }

        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setInitError("Erro ao abrir o link. Tente novamente.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });
      if (updateError) {
        setError(updateError.message || "Não foi possível atualizar a senha.");
        return;
      }
      await supabase.auth.signOut();
      setDone(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
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
            Nova senha
          </h2>
          <p className="text-brand-100 text-base leading-relaxed max-w-xs">
            Escolha uma senha forte e guarde em um lugar seguro.
          </p>
        </div>
        <p className="text-brand-300 text-xs hidden lg:block">
          © {new Date().getFullYear()} Avysta Community
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Redefinir senha
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Mínimo de 8 caracteres
            </p>
          </div>

          {initError && (
            <div className="space-y-4">
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3">
                {initError}
              </p>
              <Link
                href="/recuperar-senha"
                className="block w-full text-center py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm"
              >
                Solicitar novo link
              </Link>
              <Link
                href="/login"
                className="block text-center text-sm text-brand-500 font-semibold"
              >
                Voltar ao login
              </Link>
            </div>
          )}

          {done && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Sua senha foi atualizada. Faça login com a nova senha.
              </p>
              <Link
                href="/login"
                className="block w-full text-center py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm"
              >
                Ir para o login
              </Link>
            </div>
          )}

          {ready && !done && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Nova senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
              {error && (
                <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold rounded-xl text-sm"
              >
                {submitting ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
