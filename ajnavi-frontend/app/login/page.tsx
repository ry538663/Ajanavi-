"use client";

import { authStore, isCompleteProfile } from "@/lib/auth";
import { ArrowRight, AtSign, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    authStore.setEmail(email.trim().toLowerCase());
    router.push(isCompleteProfile(authStore.getProfile()) ? "/" : "/profile");
  };

  return <main className="auth-shell min-h-screen px-5 py-8">
    <div className="mx-auto flex max-w-6xl items-center justify-between"><a href="/" className="flex items-center gap-2 font-display text-xl font-extrabold"><span className="brand-mark"><Sparkles size={17}/></span>Ajnavi</a></div>
    <section className="mx-auto grid min-h-[calc(100vh-100px)] max-w-6xl items-center gap-12 py-10 lg:grid-cols-2">
      <div className="hidden lg:block"><span className="eyebrow">Your next hello starts here</span><h1 className="mt-5 max-w-lg text-6xl font-extrabold leading-[1.02] tracking-[-.055em]">Come as you are. <span className="text-[#715b61]">Leave a little less unknown.</span></h1><p className="mt-6 max-w-md text-lg leading-8 text-[#715b61]">Ajnavi makes room for spontaneous, human conversations—by message or face to face.</p></div>
      <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-[32px] border border-white/80 bg-white/85 p-7 shadow-[0_30px_90px_rgba(68,53,35,.14)] backdrop-blur-xl sm:p-10">
        <div className="mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-[#eee9ed] text-[#715b61]"><AtSign size={25}/></div>
        <h2 className="text-3xl font-extrabold tracking-tight">Welcome to Ajnavi</h2><p className="mt-2 text-sm leading-6 text-[#715b61]">Log in with your email to create a profile and start connecting.</p>
        <label className="mt-7 block text-sm font-semibold" htmlFor="email">Email address</label><input suppressHydrationWarning id="email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-[#d8d1da] bg-white px-4 py-3.5 outline-none transition focus:border-[#715b61] focus:ring-4 focus:ring-[#715b61]/10"/>{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button suppressHydrationWarning className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4a4252] px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#19171c]">Continue with email <ArrowRight size={18}/></button>
        <p className="mt-5 text-center text-xs leading-5 text-[#715b61]">By continuing, you confirm that you are 18+ and agree to be kind.</p>
      </form>
    </section>
  </main>;
}
