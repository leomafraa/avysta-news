"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";
import { SunIcon, MoonIcon } from "./Icons";

const navLinks = [
  { href: "/noticias", label: "Notícias" },
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
    router.push("/noticias");
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "";

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/noticias" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
              avysta
              <span className="text-brand-500 font-light">community</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
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
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            {/* Auth area */}
            {!loading && (
              user ? (
                /* User avatar + dropdown */
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
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
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
              ) : (
                /* Login / Cadastro buttons */
                <div className="flex items-center gap-2">
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
              )
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
