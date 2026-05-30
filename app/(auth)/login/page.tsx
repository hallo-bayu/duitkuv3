"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const sb = createClient();
    if (mode === "login") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) { setError("Email atau password salah"); setLoading(false); return; }
      router.push("/chat"); router.refresh();
    } else {
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user) {
        await sb.from("profiles").upsert({
          id: data.user.id, email: data.user.email!,
          daily_budget: 50000, personality: "balanced",
          streak_days: 0, total_safe_days: 0, total_over_days: 0,
        });
        router.push("/onboarding");
      }
    }
  }

  return (
    <div className="space-y-6 animate-[fadeUp_0.3s_ease-out]">
      {/* Logo / mascot */}
      <div className="text-center space-y-3 pt-8">
        <div
          className="inline-flex items-center justify-center overflow-hidden"
          style={{
            width: "88px", height: "88px",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.70)",
            border: "2.5px solid rgba(255,255,255,0.90)",
            boxShadow: "0 8px 32px rgba(108,99,255,0.18)",
            backdropFilter: "blur(14px)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/mascot.svg"
            alt="DOMI"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement!.innerHTML = '<span style="font-size:44px">🤑</span>';
            }}
          />
        </div>
        <div>
          <h1 className="text-4xl font-black text-[#1a1a2e]">Duitku</h1>
          <p className="text-[#8892AA] text-sm mt-1">Catat pengeluaran semudah chat</p>
        </div>
      </div>

      {/* Card */}
      <div className="domi-card-solid p-6 space-y-4">
        <h2 className="text-lg font-black text-[#1a1a2e] text-center">
          {mode === "login" ? "Masuk ke Duitku" : "Buat Akun Duitku"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email kamu" required className="domi-input"
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password (min. 6 karakter)" required minLength={6} className="domi-input"
          />
          {error && (
            <div className="rounded-2xl px-4 py-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}
          <button type="submit" disabled={loading} className="domi-btn w-full text-center font-bold text-base">
            {loading ? "Loading..." : mode === "login" ? "Masuk 🚀" : "Daftar Gratis 🎉"}
          </button>
        </form>
        <p className="text-center text-sm text-[#8892AA]">
          {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
          <button
            onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(null); }}
            className="font-bold hover:underline"
            style={{ color: "#6C63FF" }}
          >
            {mode === "login" ? "Daftar" : "Masuk"}
          </button>
        </p>
      </div>
      <p className="text-center text-xs text-[#8892AA]">Gratis selamanya • Tanpa kartu kredit</p>
    </div>
  );
}
