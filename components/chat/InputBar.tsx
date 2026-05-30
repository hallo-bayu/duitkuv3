"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  onSend: (msg: string) => void;
  isLoading: boolean;
  onClear: () => void;
  hasMessages: boolean;
}

export default function InputBar({ onSend, isLoading, onClear, hasMessages }: Props) {
  const [value, setValue] = useState("");
  const [actionsOpen, setActionsOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleSend() {
    const msg = value.trim();
    if (!msg || isLoading) return;
    onSend(msg);
    setValue("");
    setActionsOpen(false);
    ref.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); handleSend(); }
  }

  return (
    <div
      className="flex-shrink-0 input-area-glass"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 10px)",
        paddingTop: "10px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      {/* Quick action chips — slide up when open */}
      <div className={`quick-actions-wrap${actionsOpen ? " open" : ""}`}>
        <div className="flex gap-2 pb-2">
          <QuickChip
            icon="📊"
            label="Recap hari ini"
            color="#6C63FF"
            onClick={() => { onSend("recap hari ini"); setActionsOpen(false); }}
          />
          <QuickChip
            icon="📅"
            label="Recap minggu"
            color="#4E87F5"
            onClick={() => { onSend("recap minggu ini"); setActionsOpen(false); }}
          />
          <QuickChip
            icon="✏️"
            label="Ubah Budget"
            color="#F59E0B"
            onClick={() => { router.push("/profile"); setActionsOpen(false); }}
          />
        </div>
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2">
        {/* Plus / close toggle button */}
        <button
          onClick={() => setActionsOpen(v => !v)}
          style={{
            width: "44px",
            height: "44px",
            minWidth: "44px",
            borderRadius: "50%",
            background: actionsOpen
              ? "linear-gradient(135deg, #6C63FF, #4E87F5)"
              : "rgba(255,255,255,0.72)",
            border: "1.5px solid rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: actionsOpen
              ? "0 4px 14px rgba(108,99,255,0.35)"
              : "0 2px 8px rgba(108,99,255,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s",
            color: actionsOpen ? "white" : "#6C63FF",
            fontSize: "22px",
            fontWeight: 700,
          }}
          aria-label={actionsOpen ? "Tutup" : "Aksi"}
        >
          <span style={{ display: "block", transform: actionsOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", lineHeight: 1 }}>
            +
          </span>
        </button>

        {/* Text input */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setActionsOpen(false)}
          placeholder="Ketik pengeluaran, misal: makan 20rb"
          disabled={isLoading}
          style={{ fontSize: "16px" }}
          className="domi-input flex-1"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          style={{
            width: "44px",
            height: "44px",
            minWidth: "44px",
            flexShrink: 0,
            borderRadius: "50%",
            transition: "all 0.15s",
          }}
          className={`flex items-center justify-center ${
            value.trim() && !isLoading
              ? "active:scale-95"
              : "cursor-not-allowed opacity-40"
          }`}
          aria-label="Kirim"
        >
          {value.trim() && !isLoading ? (
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6C63FF, #4E87F5)",
                boxShadow: "0 4px 14px rgba(108,99,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(232,238,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#b0b8d0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

function QuickChip({
  icon, label, color, onClick,
}: {
  icon: string; label: string; color: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold transition-all active:scale-95 flex-shrink-0"
      style={{
        background: `${color}14`,
        border: `1px solid ${color}30`,
        color,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
