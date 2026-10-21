import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="policy-section"><h2>{title}</h2><div>{children}</div></section>;
}

export function PolicyPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <main className="policy-shell min-h-screen">
    <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 md:px-8">
      <a href="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight"><span className="brand-mark"><Sparkles size={17}/></span>Ajnavi</a>
      <a href="/" className="inline-flex items-center gap-2 rounded-full border border-[#d8d1da] bg-white/70 px-4 py-2 text-sm font-semibold transition hover:bg-white"><ArrowLeft size={16}/>Back home</a>
    </nav>
    <article className="mx-auto max-w-4xl px-5 pb-20 pt-8 md:px-8 md:pt-14">
      <header className="mb-10 border-b border-[#d8d1da] pb-9"><span className="eyebrow">{eyebrow}</span><h1 className="mt-5 text-4xl font-extrabold tracking-[-.045em] sm:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-8 text-[#715b61] sm:text-lg">{intro}</p><p className="mt-4 text-xs font-semibold uppercase tracking-[.12em] text-[#b09ca7]">Effective October 9, 2026</p></header>
      <div className="policy-content">{children}</div>
    </article>
    <footer className="border-t border-[#d8d1da] px-5 py-8"><div className="mx-auto flex max-w-4xl flex-col gap-3 text-sm text-[#715b61] sm:flex-row sm:items-center sm:justify-between"><span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-[#715b61]"/>Safety and privacy come first.</span><a className="font-semibold text-[#19171c] hover:text-[#715b61]" href="/contacts">Contact Ajnavi</a></div></footer>
  </main>;
}

export const policyLinks = [
  ["Rules", "/rules"], ["Terms", "/terms"], ["Privacy", "/privacy"], ["Refund", "/refund"], ["Contacts", "/contacts"],
] as const;
