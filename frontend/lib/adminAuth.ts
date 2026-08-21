"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "yavi_admin_token";

export function saveToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

/** Redirects to /admin/login if no token is present. Use in every protected admin page. */
export function useRequireAdmin() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.replace("/admin/login");
    } else {
      setToken(t);
    }
    setChecked(true);
  }, [router]);

  return { token, checked };
}
