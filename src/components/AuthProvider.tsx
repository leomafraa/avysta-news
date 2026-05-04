"use client";

import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from "react";
import type { UserPublic } from "@/types/user";
import { isAccessTokenValid } from "@/lib/jwt";

const ACCESS_KEY = "avysta_access_token";
const REFRESH_KEY = "avysta_refresh_token";
const LEGACY_TOKEN_KEY = "avysta_token";
const COOKIE_NAME = "avysta_auth";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds (cookie outlives JWT; refresh keeps session)

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
  login: (token: string, refreshToken: string, user: UserPublic) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const Ctx = createContext<AuthContext>({
  user: null, token: null, loading: true,
  login: () => {}, logout: () => {}, refreshUser: async () => {},
});

export function useAuth() {
  return useContext(Ctx);
}

async function refreshAccessToken(refreshToken: string): Promise<{ token: string; refreshToken: string } | null> {
  try {
    const r = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!r.ok) return null;
    const data = await r.json();
    if (!data?.token || !data?.refreshToken) return null;
    return { token: data.token, refreshToken: data.refreshToken };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      let access = localStorage.getItem(ACCESS_KEY);
      let refresh = localStorage.getItem(REFRESH_KEY);

      if (!access) {
        const legacy = localStorage.getItem(LEGACY_TOKEN_KEY);
        if (legacy) {
          localStorage.removeItem(LEGACY_TOKEN_KEY);
        }
      }

      if (access && !isAccessTokenValid(access) && refresh) {
        const renewed = await refreshAccessToken(refresh);
        if (renewed) {
          access = renewed.token;
          refresh = renewed.refreshToken;
          localStorage.setItem(ACCESS_KEY, access);
          localStorage.setItem(REFRESH_KEY, refresh);
          setCookie(access);
        }
      }

      if (!access) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const r = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${access}` },
        });

        if (r.status === 401 && refresh) {
          const renewed = await refreshAccessToken(refresh);
          if (renewed) {
            localStorage.setItem(ACCESS_KEY, renewed.token);
            localStorage.setItem(REFRESH_KEY, renewed.refreshToken);
            setCookie(renewed.token);
            const r2 = await fetch("/api/auth/me", {
              headers: { Authorization: `Bearer ${renewed.token}` },
            });
            if (r2.ok) {
              const data = await r2.json();
              if (!cancelled && data?.user) {
                setToken(renewed.token);
                setUser(data.user);
              }
            } else {
              throw new Error("me failed after refresh");
            }
          } else {
            throw new Error("refresh failed");
          }
        } else if (r.ok) {
          const data = await r.json();
          if (!cancelled && data?.user) {
            setToken(access);
            setUser(data.user);
            setCookie(access);
            if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
          } else {
            throw new Error("no user");
          }
        } else {
          throw new Error("me failed");
        }
      } catch {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        clearCookie();
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const login = useCallback((t: string, refreshToken: string, u: UserPublic) => {
    localStorage.setItem(ACCESS_KEY, t);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    setCookie(t);
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    clearCookie();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const access = localStorage.getItem(ACCESS_KEY);
    if (!access) return;
    try {
      const r = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${access}` } });
      if (r.ok) {
        const data = await r.json();
        if (data?.user) setUser(data.user);
      }
    } catch {
      // silently ignore
    }
  }, []);

  return (
    <Ctx.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </Ctx.Provider>
  );
}
