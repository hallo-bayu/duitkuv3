"use client";
import { getLevelInfo, getAchievements } from "@/lib/engine/gamification";
import { USER_LEVELS, type UserProfile } from "@/types";

export default function AchievementsScreen({ profile }: { profile: UserProfile | null }) {
  const safeDays = profile?.total_safe_days ?? 0;
  const { current, next, progress } = getLevelInfo(safeDays);
  const achievements = getAchievements({
    streak_days: profile?.streak_days ?? 0,
    total_safe_days: safeDays,
    total_over_days: profile?.total_over_days ?? 0,
  });
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div
      className="max-w-lg mx-auto px-4 space-y-4 overflow-y-auto h-full"
      style={{ paddingTop: "max(env(safe-area-inset-top), 20px)", paddingBottom: "16px" }}
    >
      <div>
        <h2 className="text-xl font-black text-[#1a1a2e]">Pencapaian</h2>
        <p className="text-[#8892AA] text-xs">Bangun kebiasaan keuangan sehat</p>
      </div>

      {/* Level card */}
      <div className="domi-card-solid p-5">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: "rgba(108,99,255,0.10)" }}
          >
            {current.emoji}
          </div>
          <div>
            <p className="text-[#8892AA] text-xs">Level {current.level}</p>
            <p className="text-[#1a1a2e] font-black text-lg leading-tight">{current.name}</p>
            {next && <p className="text-[#8892AA] text-xs mt-0.5">Menuju {next.emoji} {next.name}</p>}
          </div>
        </div>
        {next && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#8892AA]">
              <span>{safeDays} hari aman</span>
              <span>{next.minDays} hari target</span>
            </div>
            <div className="budget-bar-track h-2">
              <div
                className="budget-bar-fill"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #6C63FF, #4E87F5)" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Streak", value: profile?.streak_days ?? 0, icon: "🔥", color: "#F59E0B" },
          { label: "Hari Aman", value: safeDays, icon: "✅", color: "#10C98F" },
          { label: "Badge", value: `${unlocked}/${achievements.length}`, icon: "🏅", color: "#6C63FF" },
        ].map(s => (
          <div key={s.label} className="domi-card p-3 text-center">
            <span className="text-2xl">{s.icon}</span>
            <p className="font-black text-lg mt-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[#8892AA] text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="space-y-2">
        <h3 className="font-black text-[#1a1a2e] text-sm px-1">Badge</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map(a => (
            <div
              key={a.id}
              className="domi-card p-4 text-center space-y-1.5 transition-all"
              style={a.unlocked ? { border: "2px solid rgba(108,99,255,0.20)" } : { opacity: 0.45 }}
            >
              <span className={`text-3xl block ${!a.unlocked ? "grayscale" : ""}`}>{a.emoji}</span>
              <p className="text-xs font-black" style={{ color: a.unlocked ? "#1a1a2e" : "#8892AA" }}>{a.name}</p>
              <p className="text-[10px] text-[#8892AA]">{a.desc}</p>
              {a.unlocked && <p className="text-[10px] font-bold" style={{ color: "#6C63FF" }}>✓ Unlocked!</p>}
            </div>
          ))}
        </div>
      </div>

      {/* All levels */}
      <div className="space-y-2">
        <h3 className="font-black text-[#1a1a2e] text-sm px-1">Semua Level</h3>
        {USER_LEVELS.map(l => {
          const reached = safeDays >= l.minDays;
          return (
            <div
              key={l.level}
              className="domi-card p-4 flex items-center gap-3"
              style={reached ? { border: "2px solid rgba(108,99,255,0.20)" } : { opacity: 0.45 }}
            >
              <span className={`text-2xl ${!reached ? "grayscale" : ""}`}>{l.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: reached ? "#1a1a2e" : "#8892AA" }}>{l.name}</p>
                <p className="text-[#8892AA] text-xs">{l.minDays} hari aman</p>
              </div>
              {reached && <span className="text-lg font-black" style={{ color: "#6C63FF" }}>✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
