"use client";

import { authStore, getDefaultProfile } from "@/lib/auth";
import { getApiUrl } from "@/lib/api";
import { ArrowRight, AtSign, Sparkles } from "lucide-react";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    const cleanEmail = email.trim().toLowerCase();
    setLoading(true);
    setError("");

    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setError(data?.message || "No account found with this email. Please sign up first.");
        return;
      }

      authStore.setEmail(cleanEmail);
      if (data.profile) {
        authStore.setProfile(data.profile);
      } else if (!authStore.getProfile()) {
        authStore.setProfile(getDefaultProfile(cleanEmail));
      }

      // Login strictly bypasses profile form and enters immediately
      router.push(redirect || "/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const isFromChat = redirect?.includes("/chat");
  const signupUrl = redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup";

  return (
    <main className="auth-shell min-h-screen px-5 py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <span className="brand-mark"><Sparkles size={17} /></span>Ajnavi
        </a>
        <div className="flex items-center gap-2 text-sm text-[#715b61]">
          <span>New to Ajnavi?</span>
          <a href={signupUrl} className="font-semibold text-[#19171c] underline underline-offset-4 hover:text-[#4a4252]">
            Sign up
          </a>
        </div>
      </div>
      <section className="mx-auto grid min-h-[calc(100vh-100px)] max-w-6xl items-center gap-12 py-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <span className="eyebrow">Your next hello starts here</span>
          <h1 className="mt-5 max-w-lg text-6xl font-extrabold leading-[1.02] tracking-[-.055em]">
            Welcome back. <span className="text-[#715b61]">Ready to meet someone new?</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-[#715b61]">
            Log in to continue having spontaneous, human conversations—by message or face to face.
          </p>
        </div>
        <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-[32px] border border-white/80 bg-white/85 p-7 shadow-[0_30px_90px_rgba(68,53,35,.14)] backdrop-blur-xl sm:p-10">
          <div className="mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-[#eee9ed] text-[#715b61]">
            <AtSign size={25} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Log in to your account</h2>
          <p className="mt-2 text-sm leading-6 text-[#715b61]">
            {isFromChat
              ? "Please enter your registered email to log in and join the chat."
              : "Enter your registered email address to sign back in."}
          </p>
          {isFromChat && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
              🔒 Login is required before you can start text or video chat.
            </div>
          )}
          <label className="mt-7 block text-sm font-semibold" htmlFor="email">Email address</label>
          <input
            suppressHydrationWarning
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            disabled={loading}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-2xl border border-[#d8d1da] bg-white px-4 py-3.5 outline-none transition focus:border-[#715b61] focus:ring-4 focus:ring-[#715b61]/10 disabled:opacity-60"
          />
          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <p className="font-semibold">{error}</p>
              {error.toLowerCase().includes("sign up") && (
                <a href={signupUrl} className="mt-1.5 inline-block font-bold text-red-900 underline underline-offset-2">
                  Click here to Sign up &rarr;
                </a>
              )}
            </div>
          )}
          <button
            disabled={loading}
            suppressHydrationWarning
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4a4252] px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#19171c] disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <span>Logging in…</span>
              </>
            ) : (
              <>
                Continue with email <ArrowRight size={18} />
              </>
            )}
          </button>
          <div className="mt-6 border-t border-[#eee9ed] pt-5 text-center text-sm text-[#715b61]">
            Don&apos;t have an account yet?{" "}
            <a href={signupUrl} className="font-semibold text-[#19171c] underline underline-offset-4 hover:text-[#4a4252]">
              Sign up here
            </a>
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-[#a497a1]">
            By continuing, you confirm that you are 18+ and agree to receive login alerts and be kind.
          </p>
        </form>
      </section>
    </main>
  );
}



export default function LoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#f5f4f6]">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

