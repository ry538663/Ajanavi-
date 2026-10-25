"use client";

import { authStore, AjnaviProfile, isCompleteProfile } from "@/lib/auth";
import { ArrowRight, ChevronRight, Flag, Globe2, HeartHandshake, LockKeyhole, LogOut, MessageCircle, Quote, Radio, ShieldCheck, Sparkles, UserRound, Users, Video, WandSparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { policyLinks } from "@/components/policy-page";
import { ThemeToggle } from "@/components/theme-toggle";

export function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<AjnaviProfile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => { const saved = authStore.getProfile(); setProfile(saved); setEmail(authStore.getEmail()); }, []);
  const connect = (mode: "text" | "video") => {
    const params = new URLSearchParams({ mode });
    if (profile?.interests.length) params.set("interests", profile.interests.join(","));
    const chatUrl = `/chat?${params.toString()}`;

    if (!email) {
      router.push(`/login?redirect=${encodeURIComponent(chatUrl)}`);
      return;
    }
    router.push(chatUrl);
  };
  const logout = () => { authStore.clear(); setEmail(null); setProfile(null); };

  return <main className="landing min-h-screen overflow-hidden">
    <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-10">
      <a href="#" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight"><span className="brand-mark"><Sparkles size={18}/></span>Ajnavi</a>
      <div className="landing-nav hidden items-center gap-5 text-sm text-[#715b61] md:flex">
        <a href="#how" className="hover:text-[#19171c]">How it works</a>
        <button type="button" onClick={() => connect("text")} className="header-mode-link cursor-pointer"><MessageCircle size={15}/>Text chat</button>
        <button type="button" onClick={() => connect("video")} className="header-mode-link header-video-link cursor-pointer"><Video size={15}/>Video chat</button>
        <a href="#safety" className="hover:text-[#19171c]">Safety</a>
        <span className="online-pill flex items-center gap-2 rounded-full border border-[#d8d1da] bg-white/60 px-3 py-1.5"><span className="h-2 w-2 rounded-full bg-[#715b61]"/>2,841 online</span>
      </div>
      <div className="landing-header-actions flex items-center gap-2">
        <button type="button" onClick={() => connect("video")} className="inline-flex items-center gap-2 rounded-full bg-[#715b61] px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg md:hidden"><Video size={16}/><span className="hidden sm:inline">Video chat</span></button>
        <ThemeToggle/>
        {email ? (
          <div className="flex items-center gap-2">
            <a href="/profile" className="flex items-center gap-2 rounded-full border border-[#d8d1da] bg-white/75 px-3 py-2 text-sm font-semibold">
              <UserRound size={16}/>
              <span className="hidden sm:inline">{profile?.name || "Profile"}</span>
            </a>
            <button onClick={logout} className="rounded-full p-2 text-[#715b61] hover:bg-white cursor-pointer" aria-label="Log out">
              <LogOut size={18}/>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <a href="/login" className="rounded-full border border-[#d8d1da] bg-white/70 px-4 py-2 text-sm font-semibold text-[#19171c] transition hover:bg-white hover:-translate-y-0.5">
              Log in
            </a>
            <a href="/signup" className="rounded-full bg-[#19171c] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#322d38] hover:-translate-y-0.5">
              Sign up
            </a>
          </div>
        )}
      </div>
    </nav>


    <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-28 pt-12 md:px-10 lg:grid-cols-[1.08fr_.92fr] lg:pt-20">
      <div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/>
      <div className="relative z-10"><span className="eyebrow animate-fade-up"><WandSparkles size={14}/> Better conversations begin with curiosity</span><h1 className="animate-fade-up delay-1 mt-6 max-w-3xl text-5xl font-extrabold leading-[.98] tracking-[-.06em] sm:text-6xl lg:text-[78px]">Meet a stranger.<br/><span className="text-[#715b61]">Find something familiar.</span></h1><p className="animate-fade-up delay-2 mt-7 max-w-xl text-lg leading-8 text-[#715b61]">A thoughtful place for spontaneous conversations. Choose a quiet text chat or say hello face to face—always on your terms.</p>
        <div className="mt-9 flex flex-wrap items-center gap-3"><button onClick={() => document.getElementById("connect")?.scrollIntoView()} className="hero-primary-action flex items-center gap-2 rounded-2xl bg-[#4a4252] px-6 py-4 font-semibold text-white shadow-[0_14px_35px_rgba(74,66,82,.24)] transition hover:-translate-y-1">Start connecting <ArrowRight size={18}/></button><span className="flex items-center gap-2 px-3 text-sm text-[#715b61]"><ShieldCheck size={17} className="text-[#715b61]"/>Private by design</span></div>
        <div className="hero-trust-row"><span><span className="hero-trust-dot"/>No endless feed</span><span>Leave anytime</span><span>Adults only</span></div>
      </div>
      <div className="hero-demo relative mx-auto w-full max-w-[520px]"><div className="hero-demo-tag hero-demo-tag-top"><Globe2 size={14}/>12 countries talking now</div><div className="conversation-card rotate-[-3deg]"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#e8e1e6] text-xl">🌿</span><div><p className="font-bold">A new perspective</p><p className="text-xs text-[#715b61]">Connected from somewhere new</p></div></div><span className="chat-live-pill rounded-full bg-[#eee9ed] px-3 py-1 text-xs font-semibold text-[#715b61]">Live</span></div><div className="mt-8 space-y-3"><div className="chat-demo-bubble w-[82%] rounded-2xl rounded-bl-sm bg-[#eee9ed] px-4 py-3 text-sm leading-6">What’s something you could talk about for hours?</div><div className="chat-demo-reply ml-auto w-[76%] rounded-2xl rounded-br-sm bg-[#4a4252] px-4 py-3 text-sm leading-6 text-white">Probably music. A good song can change an entire day.</div><div className="chat-demo-bubble w-[65%] rounded-2xl rounded-bl-sm bg-[#eee9ed] px-4 py-3 text-sm">Okay, now I need your best recommendation 👀</div></div><div className="chat-demo-input mt-8 flex items-center gap-2 rounded-2xl border border-[#ddd7df] bg-[#f8f7f9] p-2 pl-4 text-sm text-[#b09ca7]">Write a message…<span className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-[#19171c] text-white"><ArrowRight size={17}/></span></div></div><div className="chat-demo-stat absolute -bottom-8 -left-8 hidden rounded-2xl border border-white bg-white/90 p-4 shadow-xl backdrop-blur sm:block"><p className="text-2xl font-extrabold">2.8k</p><p className="text-xs text-[#715b61]">curious people online</p></div><div className="hero-demo-tag hero-demo-tag-bottom"><Sparkles size={14}/>Matched on music</div></div>
    </section>

    <section className="px-5 py-24 md:px-10 lg:py-32"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><span className="eyebrow"><Globe2 size={14}/>Real people, real moments</span><h2 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-[-.045em] sm:text-6xl">A small window into a much bigger world.</h2></div><p className="max-w-md text-base leading-7 text-[#715b61]">Every conversation begins with a stranger and a little courage. No follower counts. No performance. Just two people, present for the moment.</p></div><div className="people-mosaic"><img src="/images/global-conversations.png" alt="Four adults from around the world enjoying friendly conversations"/><div className="people-mosaic-copy"><span><Radio size={16}/>Live connections</span><p>Different cities.<br/>Same human spark.</p></div></div></div></section>

    <section id="stories" className="world-stories px-5 pb-24 md:px-10 lg:pb-32"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.25rem] lg:grid-cols-[1.45fr_.55fr]">
      <div className="world-stories-image"><img src="/images/conversations-everywhere.png" alt="Adults in different cities sharing friendly online conversations"/><div className="world-stories-caption"><span><Radio size={15}/>Happening now</span><p>Four rooms.<br/>One shared moment.</p></div></div>
      <div className="world-stories-panel"><div><span className="world-stories-kicker">Around the world</span><h2>There is always something worth talking about.</h2><p>From a first coffee in Seoul to a late sunset in Lisbon, ordinary moments become memorable when someone new is there to hear them.</p></div>
        <div className="world-stories-topics">{["Late-night ideas","Music discoveries","A different point of view"].map((topic, index) => <div key={topic}><span>0{index + 1}</span><p>{topic}</p></div>)}</div>
        <button type="button" onClick={() => connect("video")} className="world-stories-action cursor-pointer">Join a live conversation <ArrowRight size={17}/></button>
      </div>
    </div></section>

    <section id="how" className="journey-section px-5 py-24 md:px-10 lg:py-32"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div className="lg:sticky lg:top-24 lg:self-start"><span className="eyebrow">How it works</span><h2 className="mt-5 text-4xl font-extrabold tracking-[-.045em] sm:text-6xl">Three steps.<br/><span className="text-[#715b61]">One unexpected hello.</span></h2><p className="mt-6 max-w-md leading-7 text-[#715b61]">We keep the setup simple so the conversation can be the interesting part.</p></div><div className="space-y-4">{[["01","Arrive as yourself","Create a lightweight profile with the interests that make you, you.",UserRound],["02","Choose your energy","Go quiet with text or meet face to face. You are always in control of your camera and microphone.",Zap],["03","Follow the curiosity","We find someone new. Stay for a great conversation or move on with a single click.",HeartHandshake]].map(([n,title,text,Icon]) => { const StepIcon = Icon as typeof UserRound; return <article key={n as string} className="journey-card"><div className="journey-number">{n as string}</div><div className="journey-icon"><StepIcon size={24}/></div><div><h3>{title as string}</h3><p>{text as string}</p></div></article>; })}</div></div></div></section>

    <section id="connect" className="relative border-b border-[#ddd7df] bg-white/55 px-5 py-24 md:px-10 lg:py-32"><div className="mx-auto max-w-6xl"><div className="mx-auto max-w-2xl text-center"><span className="eyebrow">Choose your way in</span><h2 className="mt-4 text-4xl font-extrabold tracking-[-.04em] sm:text-5xl">Now, how do you feel like talking?</h2><p className="mt-4 text-[#715b61]">Both options are private, one-to-one, and easy to leave at any time.</p></div>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <article id="video-chat" className="connect-card connect-card-featured mode-target group text-left"><div className="connect-card-top"><span className="connect-icon bg-[#e8e1e6] text-[#4a4252]"><Video size={27}/></span><span className="connect-availability"><span/>Camera optional</span></div><p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-[#4a4252]">Face to face · Most popular</p><h3 className="mt-2 text-3xl font-extrabold">Start a video call</h3><p className="mt-3 max-w-md leading-7 text-[#715b61]">Jump into a live conversation with camera and microphone controls always within reach.</p><div className="video-mode-preview" aria-hidden="true"><div className="video-you-preview"><img src="/images/you-indian-person.png" alt=""/><small>YOU</small></div><div className="video-stranger-preview"><img src="/images/next-hello-person.png" alt=""/><small>NEXT HELLO</small></div><i><Video size={14}/><MessageCircle size={14}/></i></div><button type="button" onClick={() => connect("video")} className="connect-cta connect-cta-primary">Start video chat now <ArrowRight size={18}/></button></article>
        <article id="text-chat" className="connect-card mode-target group text-left"><div className="connect-card-top"><span className="connect-icon bg-[#eee9ed] text-[#715b61]"><MessageCircle size={27}/></span><span className="connect-availability"><span/>Ready instantly</span></div><p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-[#715b61]">Low pressure</p><h3 className="mt-2 text-3xl font-extrabold">Start a chat</h3><p className="mt-3 max-w-md leading-7 text-[#715b61]">Connect through messages first. Perfect when you want a slower, quieter hello.</p><div className="text-mode-preview" aria-hidden="true"><span>What made you smile today?</span><span>A tiny café I found by accident ☕</span><i/></div><button type="button" onClick={() => connect("text")} className="connect-cta connect-cta-primary">Start text chat now <ArrowRight size={18}/></button></article>
      </div>
    </div></section>

    <section id="safety" className="safety-section px-5 py-24 text-white md:px-10 lg:py-32"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-2 lg:items-end"><div><span className="dark-eyebrow"><ShieldCheck size={14}/>Designed with boundaries</span><h2 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-[-.045em] sm:text-6xl">Open to the world.<br/>Still yours to control.</h2></div><p className="max-w-xl text-base leading-8 text-white/55">Spontaneous should never mean powerless. Ajnavi puts the essential safety choices close at hand—before, during, and after every conversation.</p></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[LockKeyhole,"Private by default","Your browser holds your profile. Live media is peer-to-peer whenever possible."],[Flag,"Report in one tap","Flag harmful behavior without staying in an uncomfortable conversation."],[Video,"Camera control","Mute or turn off video instantly. You decide what you share."],[Users,"Adults only","Ajnavi is an 18+ space with clear community expectations."]].map(([Icon,title,text]) => { const SafetyIcon = Icon as typeof LockKeyhole; return <article key={title as string} className="safety-card"><SafetyIcon size={24}/><h3>{title as string}</h3><p>{text as string}</p></article>; })}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-8"><p className="text-sm text-white/45">Know what keeps the community welcoming.</p><a href="/rules" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#19171c] transition hover:-translate-y-0.5">Read our community rules <ArrowRight size={16}/></a></div></div></section>

    <section className="px-5 py-24 md:px-10 lg:py-32"><div className="mx-auto max-w-7xl"><div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]"><article className="story-card story-card-coral"><Quote size={32}/><blockquote>“The best conversations are the ones you could never have planned.”</blockquote><p>Ajnavi is built around that possibility—the chance that someone completely new might make your day feel a little wider.</p></article><div className="grid gap-6"><article className="story-card story-card-sage"><p className="story-kicker">Conversation starter</p><h3>What’s something you wish more people asked you about?</h3></article><article className="story-card story-card-ink"><Globe2 size={24}/><h3>Across borders, not across feeds.</h3><p>Interest-led matching gives you a place to begin without trapping you inside an algorithm.</p></article></div></div></div></section>

    <section className="faq-section px-5 py-24 md:px-10 lg:py-32"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><span className="eyebrow">Good to know</span><h2 className="mt-5 text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">A few honest answers.</h2><p className="mt-5 max-w-sm leading-7 text-[#715b61]">The less mystery around the product, the more room there is for good conversation.</p></div><div className="divide-y divide-[#d8d1da]">{[["Is Ajnavi free?","Yes. The current experience is free and has no paid plans or hidden charges."],["Are calls recorded?","No. Ajnavi does not intentionally record your video or audio conversations."],["Can I leave whenever I want?","Always. Skip, disconnect, mute, or turn off your camera at any moment."],["What happens when I report someone?","The current session is flagged and that person is blocked from matching with you again during the active server session."],["Do I need to share my real identity?","No. Use a first name and avoid sharing private details you would not give to a stranger offline."]].map(([q,a]) => <details key={q} className="faq-item"><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></div></section>

    <section className="px-5 py-12 md:px-10"><div className="final-cta mx-auto max-w-7xl"><div><span className="dark-eyebrow"><Sparkles size={14}/>Your next conversation</span><h2>Someone interesting<br/>is one hello away.</h2></div><button onClick={() => document.getElementById("connect")?.scrollIntoView()} className="final-cta-button">Start connecting <ArrowRight size={18}/></button></div></section>

    <footer className="site-footer px-5 pb-10 pt-16 md:px-10"><div className="mx-auto max-w-7xl"><div className="grid gap-12 border-b border-[#d8d1da] pb-12 md:grid-cols-[1.3fr_.7fr_.7fr]"><div><a href="#" className="flex items-center gap-2 font-display text-xl font-extrabold"><span className="brand-mark"><Sparkles size={17}/></span>Ajnavi</a><p className="mt-5 max-w-sm text-sm leading-7 text-[#715b61]">A thoughtful place for spontaneous conversations with people you may never have met otherwise.</p></div><div><p className="footer-title">Explore</p><nav className="footer-links"><a href="#connect">Start a chat</a><a href="#how">How it works</a><a href="#safety">Safety</a><a href="/contacts">Contact</a></nav></div><div><p className="footer-title">Legal</p><nav className="footer-links">{policyLinks.slice(0,4).map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav></div></div><div className="flex flex-col gap-4 pt-7 text-xs text-[#715b61] sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Ajnavi. Be curious. Be kind.</p><p className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#715b61]"/>Private conversations · Easy reporting · You’re in control</p></div></div></footer>
  </main>;
}
