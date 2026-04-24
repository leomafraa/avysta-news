"use client";

import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from "react";
import type { UserPublic } from "@/types/user";

const TOKEN_KEY = "avysta_token";
const COOKIE_NAME = "avysta_auth";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function setCookie(value: string) {
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function clearCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

interface AuthContext {
  user: UserPublic | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: UserPublic) => void;
  logout: () => void;
}

const Ctx = createContext<AuthContext>({
  user: null, token: null, loading: true,
  login: () => {}, logout: () => {},
});

export function useAuth() {
  return useContext(Ctx);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) { setLoading(false); return; }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${saved}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setToken(saved);
          setUser(data.user);
          setCookie(saved);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          clearCookie();
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        clearCookie();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((t: string, u: UserPublic) => {
    localStorage.setItem(TOKEN_KEY, t);
    setCookie(t);
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    clearCookie();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}
