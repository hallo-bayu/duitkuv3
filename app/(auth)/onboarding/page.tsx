"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PERSONALITIES, BUDGET_PRESETS, type Personality } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(50000);
  const [customBudget, setCustomBudget] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [personality, setPersonality] = useState<Personality>("balanced");
  const [saving, setSaving] = useState(false);
  const finalBudget = isCustom ? (parseInt(customBudget.replace(/\D/g,"")) || 50000) : budget;

  async function handleFinish() {
    setSaving(true);
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) { router.push("/login"); return; }
    await sb.from("profiles").upsert({ id: user.id, email: user.email!, daily_budget: finalBudget, personality, streak_days: 0, total_safe_days: 0, total_over_days: 0 });
    router.push("/chat");
  }

  const fmt = (n: number) => `Rp${(n/1000).toFixed(0)}rb`;

  return (
    <div className="space-y-6 animate-[fadeUp_0.3s_ease-out] pt-4">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1,2,3].map(s => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-[#6C63FF]" : "bg-white/60"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <h2 className="text-2xl font-black text-[#1a1a2e]">Budget Harian</h2>
            <p className="text-[#8892AA] text-sm mt-1">Berapa target pengeluaran harianmu?</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {BUDGET_PRESETS.map(p => (
              <button key={p} onClick={() => { setBudget(p); setIsCustom(false); }}
                className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all ${!isCustom && budget === p ? "border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]" : "border-white bg-white text-[#8892AA] hover:border-[#6C63FF]/30"}`}>
                {fmt(p)}
              </button>
            ))}
            <button onClick={() => setIsCustom(true)}
              className={`col-span-2 py-4 rounded-2xl text-sm font-bold border-2 transition-all ${isCustom ? "border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]" : "border-white bg-white text-[#8892AA]"}`}>
              Custom 🎯
            </button>
          </div>
          {isCustom && (
            <input type="number" value={customBudget} onChange={e => setCustomBudget(e.target.value)}
              placeholder="Masukkan jumlah (Rp)" className="domi-input text-center text-lg font-bold" />
          )}
          <button onClick={() => setStep(2)} className="domi-btn w-full">Lanjut →</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="text-center">
            <div className="text-4xl mb-2">🎭</div>
            <h2 className="text-2xl font-black text-[#1a1a2e]">Kepribadian DOMI</h2>
            <p className="text-[#8892AA] text-sm mt-1">Bagaimana DOMI merespons?</p>
          </div>
          <div className="space-y-2.5">
            {PERSONALITIES.map(p => (
              <button key={p.id} onClick={() => setPersonality(p.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${personality === p.id ? "border-[#6C63FF] bg-white shadow-md shadow-blue-100" : "border-white bg-white/70 hover:border-[#6C63FF]/30"}`}>
                <span className="text-3xl">{p.emoji}</span>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${personality === p.id ? "text-[#6C63FF]" : "text-[#1a1a2e]"}`}>{p.name}</p>
                  <p className="text-[#8892AA] text-xs">{p.description}</p>
                </div>
                {personality === p.id && <span className="text-[#6C63FF] text-lg">✓</span>}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl border-2 border-white bg-white font-semibold text-[#8892AA]">← Kembali</button>
            <button onClick={() => setStep(3)} className="domi-btn flex-1">Lanjut →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-black text-[#1a1a2e]">Siap!</h2>
            <p className="text-[#8892AA] text-sm mt-1">Setup kamu sudah selesai</p>
          </div>
          <div className="domi-card p-5 space-y-3">
            <div className="flex justify-between">
              <span className="text-[#8892AA]">Budget Harian</span>
              <span className="font-bold text-[#6C63FF]">{fmt(finalBudget)}</span>
            </div>
            <div className="h-px bg-[#E8EEFF]" />
            <div className="flex justify-between">
              <span className="text-[#8892AA]">Kepribadian</span>
              <span className="font-bold text-[#1a1a2e]">
                {PERSONALITIES.find(p => p.id === personality)?.emoji} {PERSONALITIES.find(p => p.id === personality)?.name}
              </span>
            </div>
          </div>
          <div className="bg-[#EEF4FF] border border-[#6C63FF]/20 rounded-2xl p-4">
            <p className="text-[#6C63FF] text-sm text-center">💡 Bisa diubah kapan saja di <strong>Profil</strong></p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-2xl border-2 border-white bg-white font-semibold text-[#8892AA]">← Kembali</button>
            <button onClick={handleFinish} disabled={saving} className="domi-btn flex-1">
              {saving ? "Menyimpan..." : "Mulai DOMI! 🚀"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
