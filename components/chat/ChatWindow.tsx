"use client";
import { useEffect, useRef } from "react";
import type { Message } from "@/lib/hooks/useChat";

export default function ChatWindow({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="chat-messages px-4 py-3 space-y-3">
      {messages.map(m => <Bubble key={m.id} message={m} />)}
      {isLoading && <LoadingBubble />}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}

function LoadingBubble() {
  return (
    <div className="flex items-end gap-2 msg-appear">
      <MascotSmall />
      <div className="bubble-ai px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span className="loading-dot w-2 h-2 rounded-full bg-[#6C63FF]/50 inline-block" />
          <span className="loading-dot w-2 h-2 rounded-full bg-[#6C63FF]/50 inline-block" />
          <span className="loading-dot w-2 h-2 rounded-full bg-[#6C63FF]/50 inline-block" />
        </div>
      </div>
    </div>
  );
}

function MascotSmall() {
  return (
    <div
      className="w-8 h-8 rounded-[12px] flex-shrink-0 mb-1 overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #e8f0ff, #d4e8ff)",
        border: "1.5px solid rgba(255,255,255,0.85)",
        boxShadow: "0 2px 8px rgba(108,99,255,0.15)",
      }}
    >
      {/* Sama dengan mascot di header */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/mascot.svg"
        alt=""
        className="w-full h-full object-cover"
        onError={e => {
          const el = e.currentTarget;
          el.style.display = "none";
          el.parentElement!.innerHTML = '<span style="font-size:16px">🤑</span>';
        }}
      />
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  // Receipt-style = has budget bar markers
  const isReceipt =
    !isUser &&
    message.content.includes("💸") &&
    message.content.includes("Hari ini:");

  const time = message.timestamp.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isUser) {
    return (
      <div className="flex justify-end msg-appear">
        <div className="max-w-[78%]">
          <div className="bubble-user px-4 py-3">
            <p style={{ fontSize: "15px", lineHeight: "1.5", color: "white" }}>{message.content}</p>
          </div>
          <p className="text-[10px] text-[#8892AA] text-right mt-1 mr-1">{time} ✓✓</p>
        </div>
      </div>
    );
  }

  if (isReceipt) {
    return (
      <div className="flex items-end gap-2 msg-appear">
        <MascotSmall />
        <div className="bubble-ai max-w-[84%] px-4 py-3">
          <ReceiptContent content={message.content} />
          <p className="text-[10px] text-[#8892AA] mt-2">{time}</p>
        </div>
      </div>
    );
  }

  // Regular AI message — sanitized HTML render (bold, code, newlines only)
  const safeHtml = message.content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /`(.*?)`/g,
      '<code style="background:rgba(108,99,255,0.10);padding:2px 6px;border-radius:6px;color:#6C63FF;font-size:12px;font-family:monospace">$1</code>'
    )
    .split("\n")
    .join("<br/>");

  return (
    <div className="flex items-end gap-2 msg-appear">
      <MascotSmall />
      <div className="bubble-ai max-w-[84%] px-4 py-3">
        <p
          style={{ fontSize: "14px", lineHeight: "1.65", color: "#1a1a2e" }}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
        <p className="text-[10px] text-[#8892AA] mt-1.5">{time}</p>
      </div>
    </div>
  );
}

function ReceiptContent({ content }: { content: string }) {
  const lines = content.split("\n").filter(Boolean);
  const barIdx = lines.findIndex(l => l.includes("█") || l.includes("░"));

  const reactionLines = lines.slice(0, barIdx > 0 ? barIdx : 1);
  const statLines = barIdx > 0 ? lines.slice(barIdx) : lines.slice(1);

  // Extract reaction text (strip bar chars)
  const reaction = reactionLines
    .join(" ")
    .replace(/[█░🟢🟡🟠🔴\d%]+/g, "")
    .trim();

  // Parse stat lines (key: value)
  const stats: { key: string; value: string; highlight?: boolean }[] = [];
  statLines.forEach(line => {
    const stripped = line.replace(/[█░🟢🟡🟠🔴]/g, "").trim();
    if (stripped.includes(":")) {
      const [k, ...v] = stripped.split(":");
      const val = v.join(":").replace(/\*\*/g, "").trim();
      if (!val.includes("%") && val.length > 0) {
        const highlight = k.toLowerCase().includes("sisa") || k.toLowerCase().includes("over");
        stats.push({ key: k.trim(), value: val, highlight });
      }
    }
  });

  // Color for status
  const isOver = content.includes("🔴") || content.includes("Over budget");
  const isDanger = content.includes("🟠");
  const isWarning = content.includes("🟡");
  const accentColor = isOver ? "#EF4444" : isDanger ? "#F97316" : isWarning ? "#F59E0B" : "#6C63FF";

  return (
    <div>
      {/* Reaction */}
      <p className="font-bold text-[#1a1a2e] text-[13px] mb-2 leading-snug">
        {reaction || "Dicatat! ✅"}
      </p>
      {/* Stats rows */}
      {stats.length > 0 && (
        <div className="space-y-1.5 bg-white/30 rounded-2xl px-3 py-2.5">
          {stats.map((s, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-[#5a6480] text-[12px]">{s.key}</span>
              <span
                className="font-black text-[13px]"
                style={{ color: s.highlight ? accentColor : "#1a1a2e" }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
