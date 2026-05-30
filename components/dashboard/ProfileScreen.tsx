"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { PERSONALITIES, BUDGET_PRESETS, formatRupiah, type Personality, type UserProfile } from "@/types";

interface Props { user: User; profile: UserProfile | null; }

export default function ProfileScreen({ user, profile }: Props) {
  const router = useRouter();
  const [budget, setBudget] = useState(profile?.daily_budget ?? 50000);
  const [personality, setPersonality] = useState<Personality>((profile?.personality as Personality) ?? "balanced");
  const [customBudget, setCustomBudget] = useState("");
  const [isCustom, setIsCustom] = useState(!BUDGET_PRESETS.includes(profile?.daily_budget ?? 50000));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const finalBudget = isCustom ? (parseInt(customBudget.replace(/\D/g, "")) || budget) : budget;

  async function handleSave() {
    setSaving(true);
    const sb = createClient();
    await sb.from("profiles").update({ daily_budget: finalBudget, personality }).eq("id", user.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
    router.refresh();
  }

  async function handleLogout() {
    const sb = createClient();
    await sb.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = (user.email ?? "DM").slice(0, 2).toUpperCase();
  const displayName = profile?.username ?? user.email?.split("@")[0] ?? "Pengguna";
  const fmt = (n: number) => n >= 1_000_000 ? `Rp${(n / 1_000_000).toFixed(1)}jt` : `Rp${Math.round(n / 1000)}rb`;

  return (
    <div
      className="max-w-lg mx-auto px-4 space-y-4 overflow-y-auto h-full"
      style={{ paddingTop: "max(env(safe-area-inset-top), 20px)", paddingBottom: "20px" }}
    >
      <div>
        <h2 className="text-xl font-black text-[#1a1a2e]">Profil</h2>
        <p className="text-[#8892AA] text-xs">Atur preferensi DOMI kamu</p>
      </div>

      {/* Avatar card */}
      <div className="domi-card-solid p-5 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
          style={{
            background: "linear-gradient(135deg, #6C63FF, #4E87F5)",
            boxShadow: "0 6px 20px rgba(108,99,255,0.35)",
          }}
        >
          {initials}
        </div>
        <div>
          <p className="text-[#1a1a2e] font-black text-base">{displayName}</p>
          <p className="text-[#8892AA] text-xs">{user.email}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-[#F59E0B]">{profile?.streak_days ?? 0} streak</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">✅</span>
              <span className="text-xs font-bold text-[#10C98F]">{profile?.total_safe_days ?? 0} hari aman</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="domi-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-[#1a1a2e]">Budget Harian</h3>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(108,99,255,0.10)", color: "#6C63FF" }}
          >
            {formatRupiah(profile?.daily_budget ?? 50000)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {BUDGET_PRESETS.map(p => (
            <button
              key={p}
              onClick={() => { setBudget(p); setIsCustom(false); }}
              className="py-2.5 rounded-xl text-xs font-bold border-2 transition-all"
              style={!isCustom && budget === p ? {
                borderColor: "#6C63FF",
                background: "rgba(108,99,255,0.10)",
                color: "#6C63FF",
              } : {
                borderColor: "rgba(232,238,255,0.8)",
                background: "rgba(255,255,255,0.40)",
                color: "#8892AA",
              }}
            >
              {fmt(p)}
            </button>
          ))}
          <button
            onClick={() => setIsCustom(true)}
            className="col-span-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all"
            style={isCustom ? {
              borderColor: "#6C63FF",
              background: "rgba(108,99,255,0.10)",
              color: "#6C63FF",
            } : {
              borderColor: "rgba(232,238,255,0.8)",
              background: "rgba(255,255,255,0.40)",
              color: "#8892AA",
            }}
          >
            Custom 🎯
          </button>
        </div>
        {isCustom && (
          <input
            type="number"
            value={customBudget}
            onChange={e => setCustomBudget(e.target.value)}
            placeholder="Masukkan jumlah..."
            className="domi-input text-center"
          />
        )}
      </div>

      {/* Personality */}
      <div className="domi-card p-5 space-y-3">
        <h3 className="font-black text-[#1a1a2e]">Kepribadian DOMI</h3>
        <div className="space-y-2">
          {PERSONALITIES.map(p => (
            <button
              key={p.id}
              onClick={() => setPersonality(p.id)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left"
              style={personality === p.id ? {
                borderColor: "#6C63FF",
                background: "rgba(108,99,255,0.08)",
              } : {
                borderColor: "rgba(232,238,255,0.7)",
                background: "rgba(255,255,255,0.35)",
              }}
            >
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: personality === p.id ? "#6C63FF" : "#1a1a2e" }}>
                  {p.name}
                </p>
                <p className="text-[#8892AA] text-xs">{p.description}</p>
              </div>
              {personality === p.id && <span className="font-black" style={{ color: "#6C63FF" }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {saved ? (
        <div className="text-center py-3 font-black" style={{ color: "#10C98F" }}>✅ Tersimpan!</div>
      ) : (
        <button onClick={handleSave} disabled={saving} className="domi-btn w-full">
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      )}

      <button
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl border-2 font-bold text-sm transition-colors"
        style={{
          borderColor: "rgba(239,68,68,0.20)",
          color: "#EF4444",
          background: "rgba(255,255,255,0.40)",
        }}
      >
        🚪 Keluar dari Akun
      </button>
    </div>
  );
}
