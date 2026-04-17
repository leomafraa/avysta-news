"use client";

import { useState, useRef, useEffect } from "react";
import { SearchIcon, XMarkIcon } from "./Icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar notícias sobre construção civil...",
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className={`relative flex items-center w-full transition-all duration-200 ${
        focused
          ? "ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-gray-900 rounded-xl"
          : ""
      }`}
    >
      <SearchIcon className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full pl-11 pr-12 py-3.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none shadow-sm"
        aria-label="Buscar notícias"
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-3 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Limpar busca"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
      {!value && (
        <span className="absolute right-3 hidden sm:flex items-center gap-1 text-xs text-gray-300 dark:text-gray-600 pointer-events-none">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-400 dark:text-gray-500 font-mono">⌘K</kbd>
        </span>
      )}
    </div>
  );
}
