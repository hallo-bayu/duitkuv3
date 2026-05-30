"use client";
import type { BudgetStatus } from "@/types";

const BAR_COLORS = {
  safe:    "bg-emerald-500",
  warning: "bg-yellow-500",
  danger:  "bg-orange-500",
  over:    "bg-red-500",
};

export default function BudgetBar({ pct, status }: { pct: number; status: BudgetStatus }) {
  return (
    <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${BAR_COLORS[status]}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}
