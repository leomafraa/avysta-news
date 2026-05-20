"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/AuthProvider";

const INPUT_CLASS =
  "w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm";

interface Props {
  onClose: () => void;
}

export function ImprovementSuggestionModal({ onClose }: Props) {
  const { user, token } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [nome, setNome] = useState(user?.name ?? "");
  const [empresa, setEmpresa] = useState(user?.empresaNomeFantasia ?? "");
  const [sugestao, setSugestao] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (user) {
      setNome(user.name);
      if (user.empresaNomeFantasia) setEmpresa(user.empresaNomeFantasia);
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setError("Informe seu nome.");
      return;
    }
    if (!empresa.trim()) {
      setError("Informe a empresa.");
      return;
    }
    if (!sugestao.trim()) {
      setError("Descreva sua sugestão de melhoria.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/sugestoes", {
        method: "POST",
        headers,
        body: JSON.stringify({
          nome: nome.trim(),
          empresa: empresa.trim(),
          sugestao: sugestao.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao enviar sugestão.");
        return;
      }
      setSuccess(data.message || "Sugestão enviada com sucesso!");
      setSugestao("");
      setTimeout(() => onClose(), 1800);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="suggestion-modal-title"
      onClick={submitting ? undefined : onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[min(90vh,calc(100vh-2rem))] overflow-y-auto border border-gray-200 dark:border-gray-700 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <h2
            id="suggestion-modal-title"
            className="text-lg font-bold text-gray-900 dark:text-white"
          >
            Sugestões de melhoria
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sua opinião ajuda a evoluir a Avysta Comunidade. Conte o que podemos
            melhorar na plataforma.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className={INPUT_CLASS}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Empresa *
            </label>
            <input
              type="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Nome fantasia ou razão social"
              className={INPUT_CLASS}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sugestões de melhoria *
            </label>
            <textarea
              value={sugestao}
              onChange={(e) => setSugestao(e.target.value)}
              placeholder="Descreva sua ideia, problema encontrado ou melhoria desejada..."
              rows={5}
              maxLength={5000}
              className={`${INPUT_CLASS} resize-y min-h-[120px]`}
              disabled={submitting}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
              {sugestao.length}/5000
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-xl px-4 py-3">
              {success}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !!success}
              className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {submitting ? "Enviando..." : "Enviar sugestão"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
