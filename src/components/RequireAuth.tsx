"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[40vh]">
        <p className="text-sm text-gray-500 dark:text-gray-400">Carregando…</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
