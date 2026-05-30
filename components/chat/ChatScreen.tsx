"use client";
import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/lib/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";
import InputBar from "@/components/chat/InputBar";
import { getBudgetStatus, formatRupiah, PERSONALITIES, type Personality } from "@/types";

interface Props {
  userId: string;
  profile: { daily_budget: number; personality: string; streak_days: number; username?: string | null; email?: string } | null;
  initialSpent: number;
}

export default function ChatScreen({ userId, profile, initialSpent }: Props) {
  const router = useRouter();
  const [spent, setSpent] = useState(initialSpent);

  // Fix real viewport height on mobile (keyboard)
  useEffect(() => {
    const update = () =>
      document.documentElement.style.setProperty("--real-vh", `${window.visualViewport?.height ?? window.innerHeight}px`);
    update();
    window.visualViewport?.addEventListener("resize", update);
    return () => window.visualViewport?.removeEventListener("resize", update);
  }, []);

  const budget = profile?.daily_budget ?? 50000;
  const personality = PERSONALITIES.find(p => p.id === profile?.personality) ?? PERSONALITIES[1];
  const displayName = profile?.username ?? profile?.email?.split("@")[0] ?? "Kamu";

  const handleTransactionSaved = useCallback(() => {
    router.refresh();
  }, [router]);

  const { messages, isLoading, sendMessage, clearMessages } = useChat({
    userId,
    onTransactionSaved: handleTransactionSaved,
  });

  const status = getBudgetStatus(spent, budget);
  const remaining = Math.max(0, budget - spent);
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const barColor = { safe: "#6C63FF", warning: "#F59E0B", danger: "#F97316", over: "#EF4444" }[status];
  const remainColor = barColor;

  return (
    <div style={{ height: "var(--real-vh, 100dvh)" }} className="flex flex-col overflow-hidden gradient-bg">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-4"
        style={{ paddingTop: "max(env(safe-area-inset-top), 14px)", paddingBottom: "0" }}
      >
        {/* Row 1: greeting + mascot image */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-[#5a6480] text-[13px] font-medium">Hai, {displayName}! 👋</p>
            {/* App name = slogan style */}
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-[22px] font-black text-[#1a1a2e] leading-tight">Duitku</h1>
              <span className="text-[18px]">💸</span>
            </div>
            {/* Personality pill */}
            <button
              onClick={() => router.push("/profile")}
              className="mt-1.5 flex items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(255,255,255,0.75)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span className="text-[13px]">{personality.emoji}</span>
              <span className="text-[11px] font-bold text-[#1a1a2e]">{personality.name}</span>
              <span className="text-[#8892AA] text-[10px]">›</span>
            </button>
          </div>

          {/* Right side: streak + mascot avatar */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {(profile?.streak_days ?? 0) > 0 && (
              <div
                className="flex flex-col items-center justify-center px-2.5 py-2 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1.5px solid rgba(255,255,255,0.80)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <span className="text-[18px] leading-none">🔥</span>
                <span className="text-[13px] font-black text-[#1a1a2e] leading-none mt-0.5">{profile!.streak_days}</span>
                <span className="text-[9px] text-[#8892AA] leading-none">streak</span>
              </div>
            )}
            {/* Mascot with border — pakai gambar jika ada, fallback emoji */}
            <div className="mascot-avatar">
              {/* Ganti src dengan path gambar mascot kamu: /icons/mascot.svg */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/mascot.svg"
                alt="DOMI"
                onError={e => {
                  // fallback ke emoji jika gambar tidak ada
                  const el = e.currentTarget;
                  el.style.display = "none";
                  const parent = el.parentElement!;
                  parent.innerHTML = '<span style="font-size:26px">🤑</span>';
                }}
              />
            </div>
          </div>
        </div>

        {/* Budget card — glass solid */}
        <div className="domi-card-solid p-4 mb-3">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[#8892AA] text-[11px] font-semibold uppercase tracking-wide mb-1">Budget Hari Ini</p>
              <p className="text-[22px] font-black text-[#1a1a2e]">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(spent)}
              </p>
              <p className="text-[#8892AA] text-[11px] mt-0.5">dari {formatRupiah(budget)}</p>
            </div>
            <div className="text-right">
              <p className="text-[#8892AA] text-[11px] font-semibold uppercase tracking-wide mb-1">Sisa Budget</p>
              <p className="text-[18px] font-black" style={{ color: remainColor }}>
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(remaining)}
              </p>
              <div
                className="mt-1 rounded-full px-2 py-0.5 inline-block"
                style={{ background: `${barColor}18` }}
              >
                <p className="text-[11px] font-bold" style={{ color: barColor }}>{Math.round(pct)}% terpakai</p>
              </div>
            </div>
          </div>
          <div className="budget-bar-track">
            <div
              className="budget-bar-fill"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)` }}
            />
          </div>
        </div>

        {/* Sub-header row */}
        <div className="flex items-center justify-between mb-2 px-0.5">
          <div>
            <p className="text-[13px] font-bold text-[#1a1a2e]">Masukan pengeluaran kamu hari ini</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-[#8892AA]">Online</span>
            </div>
          </div>
          <button
            onClick={() => sendMessage("tips hemat hari ini")}
            className="flex items-center gap-1.5 text-white text-[11px] font-bold px-3 py-2 rounded-full"
            style={{
              background: "linear-gradient(135deg, #6C63FF, #4E87F5)",
              boxShadow: "0 4px 12px rgba(108,99,255,0.30)",
            }}
          >
            <span>💡</span> Tips hemat
          </button>
        </div>
      </div>

      {/* ── CHAT MESSAGES ──────────────────────────────────── */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* ── INPUT BAR ──────────────────────────────────────── */}
      <InputBar onSend={sendMessage} isLoading={isLoading} onClear={clearMessages} hasMessages={messages.length > 1} />
    </div>
  );
}
