"use client";

import { authStore, isCompleteProfile } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authStore.getEmail()) return router.replace("/login");
    if (!isCompleteProfile(authStore.getProfile())) return router.replace("/profile");
    setReady(true);
  }, [router]);

  if (!ready) return <div className="grid min-h-screen place-items-center bg-[#f5f4f6] text-sm text-[#715b61]">Preparing your space…</div>;
  return children;
}
