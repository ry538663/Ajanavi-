import { Suspense } from "react";
import { ChatRoom } from "@/components/chat-room";

export default function ChatPage() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center">Connecting…</div>}><ChatRoom /></Suspense>;
}
