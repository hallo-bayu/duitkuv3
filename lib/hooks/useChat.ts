"use client";
import { useState, useCallback, useRef } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "transaction" | "recap" | "error" | "help";
  stats?: { totalSpent: number; remaining: number; budget: number; status: string; pct: number };
}

const WELCOME: Message = {
  id: "welcome", role: "assistant", type: "help",
  content: "Halo! Saya **DOMI** 💸\n\nCukup ketik pengeluaranmu:\n• `kopi 15rb`\n• `makan siang 25000`\n• `bensin 50rb`\n\nKetik `recap hari ini` untuk laporan.",
  timestamp: new Date(),
};

export function useChat(options: { userId?: string; onTransactionSaved?: () => void } = {}) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Keep stable ref to avoid stale closure issues
  const onSavedRef = useRef(options.onTransactionSaved);
  onSavedRef.current = options.onTransactionSaved;

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(), role: "user",
      content: content.trim(), timestamp: new Date(),
    };
    const assistantId = crypto.randomUUID();
    const loadingMsg: Message = {
      id: assistantId, role: "assistant",
      content: "", timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content.trim() }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: data.message, type: data.type, stats: data.stats }
            : m
        )
      );

      if (data.type === "transaction") {
        onSavedRef.current?.();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      setError(msg);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, content: `❌ ${msg}` } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]); // removed `messages` from deps — not needed

  const clearMessages = useCallback(() => {
    setMessages([{ ...WELCOME, timestamp: new Date() }]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
