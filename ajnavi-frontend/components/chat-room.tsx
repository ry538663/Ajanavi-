"use client";

import { ArrowLeft, Flag, LoaderCircle, MessageCircle, Mic, MicOff, PhoneOff, RotateCcw, Send, Sparkles, Video, VideoOff, WifiOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { authStore } from "@/lib/auth";

type ChatMessage = { id: string; text: string; mine: boolean; sentAt: string };
type MatchPayload = { roomId: string; peerId: string; initiator: boolean; sharedInterests: string[] };

const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    ...(process.env.NEXT_PUBLIC_TURN_URL ? [{ urls: process.env.NEXT_PUBLIC_TURN_URL, username: process.env.NEXT_PUBLIC_TURN_USERNAME, credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL }] : []),
  ],
};

export function ChatRoom() {
  const params = useSearchParams();
  const isVideo = params.get("mode") !== "text";
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const roomRef = useRef<string | null>(null);
  const [status, setStatus] = useState<"permission" | "searching" | "matched" | "ended" | "unavailable">("permission");
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [shared, setShared] = useState<string[]>([]);
  const socket = getSocket();

  const createPeer = useCallback(() => {
    peerRef.current?.close();
    const peer = new RTCPeerConnection(rtcConfig);
    streamRef.current?.getTracks().forEach((track) => peer.addTrack(track, streamRef.current!));
    peer.ontrack = ({ streams }) => { if (remoteVideo.current) remoteVideo.current.srcObject = streams[0]; };
    peer.onicecandidate = ({ candidate }) => { if (candidate && roomRef.current) socket.emit("signal", { roomId: roomRef.current, type: "ice-candidate", data: candidate }); };
    peerRef.current = peer;
    return peer;
  }, [socket]);

  const startSearch = useCallback(async () => {
    setMessages([]);
    setShared([]);
    setStatus("searching");
    if (!socket.connected) socket.connect();
    const profile = authStore.getProfile();
    const requestedInterests = (params.get("interests") ?? "").split(",").filter(Boolean);
    const interests = requestedInterests.length ? requestedInterests : profile?.interests ?? [];
    socket.emit("find-match", {
      mode: isVideo ? "video" : "text",
      interests,
      profile: { name: profile?.name ?? "Stranger", country: profile?.country ?? "", interests },
    });
  }, [isVideo, params, socket]);

  useEffect(() => {
    let active = true;
    if (isVideo) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (!active) return stream.getTracks().forEach((track) => track.stop());
          streamRef.current = stream;
          if (localVideo.current) localVideo.current.srcObject = stream;
          startSearch();
        })
        .catch(() => setStatus("permission"));
    } else startSearch();

    const onMatched = async ({ roomId, initiator, sharedInterests }: MatchPayload) => {
      roomRef.current = roomId;
      setShared(sharedInterests);
      setStatus("matched");
      if (!isVideo) return;
      const peer = createPeer();
      if (initiator) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("signal", { roomId, type: "offer", data: offer });
      }
    };
    const onSignal = async ({ type, data }: { type: string; data: RTCSessionDescriptionInit | RTCIceCandidateInit }) => {
      if (!isVideo) return;
      const peer = peerRef.current ?? createPeer();
      if (type === "offer") {
        await peer.setRemoteDescription(data as RTCSessionDescriptionInit);
        for (const candidate of pendingIceRef.current.splice(0)) await peer.addIceCandidate(candidate);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("signal", { roomId: roomRef.current, type: "answer", data: answer });
      } else if (type === "answer") {
        await peer.setRemoteDescription(data as RTCSessionDescriptionInit);
        for (const candidate of pendingIceRef.current.splice(0)) await peer.addIceCandidate(candidate);
      } else if (type === "ice-candidate") {
        if (peer.remoteDescription) await peer.addIceCandidate(data as RTCIceCandidateInit);
        else pendingIceRef.current.push(data as RTCIceCandidateInit);
      }
    };
    const onMessage = ({ text, sentAt }: { text: string; sentAt: string }) => setMessages((items) => [...items, { id: crypto.randomUUID(), text, sentAt, mine: false }]);
    const onLeft = () => { peerRef.current?.close(); peerRef.current = null; roomRef.current = null; setStatus("ended"); };
    const onConnectError = () => setStatus("unavailable");

    socket.on("matched", onMatched);
    socket.on("signal", onSignal);
    socket.on("chat-message", onMessage);
    socket.on("partner-left", onLeft);
    socket.on("connect_error", onConnectError);
    return () => {
      active = false;
      socket.off("matched", onMatched); socket.off("signal", onSignal); socket.off("chat-message", onMessage); socket.off("partner-left", onLeft); socket.off("connect_error", onConnectError);
      socket.emit("leave-chat"); socket.disconnect(); peerRef.current?.close(); streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [createPeer, isVideo, socket, startSearch]);

  const toggleTrack = (kind: "audio" | "video") => {
    const track = streamRef.current?.getTracks().find((item) => item.kind === kind);
    if (track) track.enabled = !track.enabled;
    if (kind === "audio") setMicOn((value) => !value); else setCameraOn((value) => !value);
  };

  const next = () => {
    socket.emit("next-match"); peerRef.current?.close(); peerRef.current = null; pendingIceRef.current = []; roomRef.current = null; startSearch();
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim().slice(0, 500);
    if (!text || !roomRef.current) return;
    const sentAt = new Date().toISOString();
    socket.emit("chat-message", { roomId: roomRef.current, text });
    setMessages((items) => [...items, { id: crypto.randomUUID(), text, sentAt, mine: true }]);
    setDraft("");
  };

  return (
    <main className="chat-shell flex min-h-screen flex-col bg-[#19171c] text-white">
      <header className="flex h-17 items-center justify-between border-b border-white/10 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2 font-display text-lg font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#715b61]"><Sparkles size={16}/></span>Ajnavi</a>
        <div className="hidden items-center gap-2 text-xs text-white/60 sm:flex"><span className={`h-2 w-2 rounded-full ${status === "matched" ? "bg-emerald-400" : status === "unavailable" ? "bg-red-400" : "bg-amber-400"}`} />{status === "matched" ? `Connected by ${isVideo ? "video" : "chat"}` : status === "searching" ? "Finding someone…" : status === "unavailable" ? "Service unavailable" : "Conversation ended"}</div>
        <a href="/" className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Go home"><ArrowLeft size={20}/></a>
      </header>

      <div className="grid flex-1 lg:grid-cols-[1fr_360px]">
        <section className={`relative min-h-[60vh] overflow-hidden ${isVideo ? "video-workspace" : "bg-[radial-gradient(circle_at_center,#4a4252_0%,#19171c_70%)]"}`}>
          {!isVideo && <div className="absolute inset-0 grid place-items-center px-6 text-center"><div className="max-w-md">{status === "unavailable" ? <><div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-[28px] bg-red-500/10 text-red-400"><WifiOff size={42}/></div><h2 className="text-3xl font-extrabold">We couldn’t reach Ajnavi</h2><p className="mt-3 leading-7 text-white/45">The matching service is offline right now. Try again in a moment or return home.</p><div className="mt-6 flex justify-center gap-3"><button onClick={startSearch} className="rounded-xl bg-[#715b61] px-5 py-3 text-sm font-semibold">Try again</button><a href="/" className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold">Back home</a></div></> : <><div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-[28px] bg-[#715b61]/20 text-[#b09ca7]"><MessageCircle size={42}/></div><h2 className="text-3xl font-extrabold">{status === "searching" ? "Looking for someone…" : "Text chat mode"}</h2><p className="mt-3 leading-7 text-white/45">No camera, no pressure. When you’re matched, use the conversation panel to say hello.</p></>}</div></div>}
          {isVideo && <div className="video-equal-grid">
            <div className="video-panel video-panel-local">
              <video ref={localVideo} autoPlay muted playsInline className={`h-full w-full scale-x-[-1] object-cover ${cameraOn && status !== "permission" ? "" : "hidden"}`} />
              {(!cameraOn || status === "permission") && <div className="video-panel-empty"><VideoOff size={38}/><span>{status === "permission" ? "Camera access needed" : "Camera is off"}</span></div>}
              <span className="video-panel-label"><span className="bg-emerald-400"/>You</span>
            </div>
            <div className="video-panel video-panel-remote">
              <video ref={remoteVideo} autoPlay playsInline className={`h-full w-full object-cover ${status === "matched" ? "opacity-100" : "opacity-0"}`} />
              {status !== "matched" && <div className="video-match-state">
                {status === "searching" && <div><div className="relative mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-white/5"><span className="absolute inset-0 animate-[pulse-ring_1.8s_ease-out_infinite] rounded-full border border-[#b09ca7]"/><LoaderCircle className="animate-spin text-[#b09ca7]" size={30}/></div><h2 className="text-xl font-bold">Finding someone interesting</h2><p className="mt-2 text-sm text-white/45">This usually takes just a moment</p></div>}
                {status === "permission" && <div><VideoOff className="mx-auto mb-4 text-[#b09ca7]" size={38}/><h2 className="text-xl font-bold">Enable your camera</h2><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/45">Allow camera and microphone access, then refresh.</p></div>}
                {status === "ended" && <div><PhoneOff className="mx-auto mb-4 text-[#b09ca7]" size={38}/><h2 className="text-xl font-bold">They’ve left the chat</h2><button onClick={startSearch} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#715b61] px-5 py-3 text-sm font-semibold hover:bg-[#4a4252]"><RotateCcw size={17}/> Meet someone new</button></div>}
                {status === "unavailable" && <div><WifiOff className="mx-auto mb-4 text-red-400" size={38}/><h2 className="text-xl font-bold">Service unavailable</h2><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-white/45">We couldn’t connect right now.</p><button onClick={startSearch} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#715b61] px-5 py-3 text-sm font-semibold"><RotateCcw size={17}/> Try again</button></div>}
              </div>}
              <span className="video-panel-label"><span className={status === "matched" ? "bg-emerald-400" : "bg-amber-400"}/>{status === "matched" ? "Stranger" : "Waiting for match"}</span>
            </div>
          </div>}
          {shared.length > 0 && <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-2 text-xs text-white/80 backdrop-blur">You both like {shared[0]}</div>}

          <div className={isVideo ? "video-call-controls" : "absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 shadow-2xl backdrop-blur-xl"}>
            {isVideo && <><button onClick={() => toggleTrack("audio")} className={`grid h-11 w-11 place-items-center rounded-xl transition ${micOn ? "bg-white/10 hover:bg-white/20" : "bg-red-500"}`} aria-label="Toggle microphone">{micOn ? <Mic size={19}/> : <MicOff size={19}/>}</button><button onClick={() => toggleTrack("video")} className={`grid h-11 w-11 place-items-center rounded-xl transition ${cameraOn ? "bg-white/10 hover:bg-white/20" : "bg-red-500"}`} aria-label="Toggle camera">{cameraOn ? <Video size={19}/> : <VideoOff size={19}/>}</button><div className="mx-1 h-7 w-px bg-white/15" /></>}
            <button onClick={next} disabled={status !== "matched"} className="flex h-11 items-center gap-2 rounded-xl bg-[#715b61] px-4 text-sm font-semibold transition hover:bg-[#4a4252] disabled:cursor-not-allowed disabled:opacity-35"><RotateCcw size={17}/> Next</button>
            <button onClick={() => socket.emit("report-user", { roomId: roomRef.current, reason: "inappropriate" })} className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white/60 hover:bg-white/20 hover:text-white" aria-label="Report user"><Flag size={18}/></button>
          </div>
        </section>

        <aside className="chat-aside flex min-h-[360px] flex-col border-l border-white/10 bg-[#19171c]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4"><MessageCircle size={18} className="text-[#b09ca7]"/><h2 className="font-semibold">Conversation</h2></div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <div className="mx-auto max-w-[260px] py-4 text-center text-xs leading-5 text-white/35">You’re chatting with a stranger. Keep personal information private and be kind.</div>
            {messages.map((message) => <div key={message.id} className={`flex ${message.mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-5 ${message.mine ? "rounded-br-sm bg-[#715b61] text-white" : "rounded-bl-sm bg-white/10 text-white/85"}`}>{message.text}</div></div>)}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-white/10 p-3"><input value={draft} onChange={(e) => setDraft(e.target.value)} disabled={status !== "matched"} maxLength={500} placeholder="Say something…" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#b09ca7] disabled:opacity-50"/><button disabled={!draft.trim() || status !== "matched"} className="grid w-12 place-items-center rounded-xl bg-white text-[#19171c] transition hover:bg-[#eee9ed] disabled:cursor-not-allowed disabled:opacity-30" aria-label="Send message"><Send size={18}/></button></form>
        </aside>
      </div>
    </main>
  );
}
