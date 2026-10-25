"use client";

import { authStore, getDefaultProfile } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const email = authStore.getEmail();
    const currentUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/chat";
    if (!email) {
      router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    if (!authStore.getProfile()) {
      authStore.setProfile(getDefaultProfile(email));
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#19171c] text-sm text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <span className="text-white/60">Checking authentication…</span>
        </div>
      </div>
    );
  }
  return children;
}

