import { Suspense } from "react";
import { ChatRoom } from "@/components/chat-room";
import { AuthGate } from "@/components/auth-gate";

export default function ChatPage() {
  return (
    <AuthGate>
      <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#19171c] text-white">Connecting…</div>}>
        <ChatRoom />
      </Suspense>
    </AuthGate>
  );
}

