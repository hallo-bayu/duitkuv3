"use client";
import { useState } from "react";
import { formatRupiah, CATEGORY_EMOJI, getBudgetStatus, type Transaction, type UserProfile } from "@/types";

interface Props { profile: UserProfile | null; transactions: Transaction[]; userId: string; }
type Period = "today" | "week" | "month";

export default function RecapScreen({ profile, transactions }: Props) {
  const [period, setPeriod] = useState<Period>("month");
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

  const filtered = transactions.filter(t =>
    period === "today" ? t.date === today :
    period === "week"  ? t.date >= weekAgo : true
  );

  const total = filtered.reduce((s, t) => s + t.amount, 0);
  const budget = profile?.daily_budget ?? 50000;
  const daysInPeriod = period === "today" ? 1 : period === "week" ? 7 : 30;
  const budgetTotal = budget * daysInPeriod;
  const status = getBudgetStatus(total, budgetTotal);
  const pct = budgetTotal > 0 ? Math.min((total / budgetTotal) * 100, 100) : 0;

  const byCategory: Record<string, number> = {};
  filtered.forEach(t => { byCategory[t.category] = (byCategory[t.category] || 0) + t.amount; });
  const cats = Object.entries(byCategory).sort(([, a], [, b]) => b - a);

  const barColor = { safe: "#6C63FF", warning: "#F59E0B", danger: "#F97316", over: "#EF4444" }[status];

  const PERIODS = [
    { id: "today" as Period, label: "Hari Ini" },
    { id: "week"  as Period, label: "7 Hari" },
    { id: "month" as Period, label: "Bulan Ini" },
  ];

  return (
    <div
      className="max-w-lg mx-auto px-4 space-y-4 overflow-y-auto h-full"
      style={{ paddingTop: "max(env(safe-area-inset-top), 20px)", paddingBottom: "16px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1a1a2e]">Recap</h2>
          <p className="text-[#8892AA] text-xs">Ringkasan pengeluaranmu</p>
        </div>
        <button
          onClick={() => window.open(`/api/export?format=csv&month=${today.slice(0, 7)}`, "_blank")}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl"
          style={{
            background: "rgba(108,99,255,0.10)",
            color: "#6C63FF",
            border: "1px solid rgba(108,99,255,0.15)",
          }}
        >
          ↓ Export CSV
        </button>
      </div>

      {/* Period tabs */}
      <div
        className="flex gap-1.5 p-1 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.55)",
          border: "1.5px solid rgba(255,255,255,0.80)",
          backdropFilter: "blur(14px)",
        }}
      >
        {PERIODS.map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all"
            style={period === p.id ? {
              background: "linear-gradient(135deg, #6C63FF, #4E87F5)",
              color: "white",
              boxShadow: "0 4px 12px rgba(108,99,255,0.30)",
            } : { color: "#8892AA" }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary card */}
      <div className="domi-card-solid p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[#8892AA] text-[11px] font-semibold uppercase tracking-wide mb-1">Total Pengeluaran</p>
            <p className="text-3xl font-black" style={{ color: barColor }}>
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(total)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#8892AA] text-[11px] font-semibold uppercase tracking-wide mb-1">Sisa Budget</p>
            <p className="text-lg font-black" style={{ color: barColor }}>
              {formatRupiah(Math.max(0, budgetTotal - total))}
            </p>
          </div>
        </div>
        <div className="budget-bar-track">
          <div className="budget-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
        </div>
        <p className="text-[#8892AA] text-xs mt-2 text-right">{Math.round(pct)}% dari {formatRupiah(budgetTotal)}</p>
      </div>

      {/* By category */}
      {cats.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-black text-[#1a1a2e] text-sm px-1">Per Kategori</h3>
          {cats.map(([cat, amt]) => (
            <div key={cat} className="domi-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "rgba(108,99,255,0.10)" }}
                  >
                    {CATEGORY_EMOJI[cat] ?? "📦"}
                  </div>
                  <span className="font-semibold text-[#1a1a2e] text-sm capitalize">{cat}</span>
                </div>
                <span className="font-black text-[#1a1a2e] text-sm">{formatRupiah(amt)}</span>
              </div>
              <div className="budget-bar-track h-1.5">
                <div
                  className="budget-bar-fill"
                  style={{ width: `${total > 0 ? (amt / total) * 100 : 0}%`, background: "#6C63FF" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transaction history */}
      {filtered.length > 0 && (
        <div className="space-y-2 pb-2">
          <h3 className="font-black text-[#1a1a2e] text-sm px-1">Riwayat ({filtered.length})</h3>
          {filtered.slice(0, 30).map(tx => (
            <div key={tx.id} className="domi-card p-3.5 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "rgba(108,99,255,0.10)" }}
              >
                {CATEGORY_EMOJI[tx.category] ?? "📦"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#1a1a2e] text-sm font-semibold truncate">{tx.description || tx.raw_input}</p>
                <p className="text-[#8892AA] text-xs capitalize">
                  {tx.category} · {new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </p>
              </div>
              <p className="font-black text-sm flex-shrink-0" style={{ color: "#6C63FF" }}>-{formatRupiah(tx.amount)}</p>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="domi-card p-10 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-[#8892AA] text-sm">Belum ada transaksi</p>
        </div>
      )}
    </div>
  );
}
