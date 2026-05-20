"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import { SunIcon, MoonIcon } from "./Icons";
import { ImprovementSuggestionModal } from "./ImprovementSuggestionModal";

const navLinks = [
  { href: "/noticias", label: "📰 Notícias" },
  { href: "/cotacoes", label: "💹 Cotações" },
  { href: "/fornecedores", label: "🏗️ Fornecedores" },
];

const TYPE_LABEL = { comprador: "Comprador", fornecedor: "Fornecedor" };
const TYPE_EMOJI = { comprador: "🛒", fornecedor: "🏗️" };

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.replace("/");
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "";

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/noticias"
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#020617] shadow-md group-hover:scale-105 transition-transform">
              <Image
                src="/brand/avysta-logo.png"
                alt="Logo Avysta"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
              avysta
              <span className="text-brand-500 font-light">comunidade</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {user && (
              <button
                type="button"
                onClick={() => setSuggestionOpen(true)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                💡 Sugestões de melhoria
              </button>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* Auth area */}
            {!loading &&
              (user ? (
                /* User avatar + dropdown (desktop) */
                <div className="hidden sm:block">
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {initial}
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight max-w-[100px] truncate">
                          {user.name.split(" ")[0]}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
                          {TYPE_EMOJI[user.type]} {TYPE_LABEL[user.type]}
                        </p>
                      </div>
                      <svg
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19 9-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown (desktop) */}
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg py-1 z-50">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>

                        {user.type === "fornecedor" && (
                          <Link
                            href="/fornecedores"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            🏗️ Minha empresa
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          ↩ Sair
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Login / Cadastro buttons (desktop) */
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/"
                    className="px-3.5 py-2 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors shadow-sm"
                  >
                    Cadastrar
                  </Link>
                </div>
              ))}

            {/* Mobile hamburger */}
            <div className="sm:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menu"
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="sr-only">Abrir menu principal</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                      menuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-[max-height,opacity] duration-200 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navLinks.map(({ href, label }) => {
            const active =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {user && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSuggestionOpen(true);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              💡 Sugestões de melhoria
            </button>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-2">
          {!loading &&
            (user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {TYPE_EMOJI[user.type]} {TYPE_LABEL[user.type]}
                    </p>
                  </div>
                </div>

                {user.type === "fornecedor" && (
                  <Link
                    href="/fornecedores"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    🏗️ Minha empresa
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
                >
                  ↩ Sair
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center px-3 py-2 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm"
                >
                  Cadastrar
                </Link>
              </div>
            ))}
        </div>
      </div>

      {suggestionOpen && user && (
        <ImprovementSuggestionModal onClose={() => setSuggestionOpen(false)} />
      )}
    </header>
  );
}
