"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/chat",         label: "Chat",    icon: ChatIcon    },
  { href: "/recap",        label: "Recap",   icon: RecapIcon   },
  { href: "/achievements", label: "Capaian", icon: TrophyIcon  },
  { href: "/profile",      label: "Profil",  icon: ProfileIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-shrink-0 bottom-nav-glass" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <ul className="flex max-w-lg mx-auto">
        {NAV.map(item => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                style={{ minHeight: "56px" }}
                className="flex flex-col items-center justify-center gap-1 transition-all relative"
              >
                {active && (
                  <div
                    className="absolute top-2"
                    style={{
                      width: "40px",
                      height: "28px",
                      borderRadius: "14px",
                      background: "rgba(108,99,255,0.12)",
                    }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1 }}>
                  <Icon active={active} />
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: active ? 700 : 500,
                    position: "relative",
                    zIndex: 1,
                    color: active ? "#6C63FF" : "#8892AA",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#6C63FF" : "none"}
      stroke={active ? "#6C63FF" : "#8892AA"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function RecapIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#6C63FF" : "#8892AA"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      {active && (
        <>
          <line x1="18" y1="20" x2="18" y2="10" stroke="#6C63FF" strokeWidth="3" />
          <line x1="12" y1="20" x2="12" y2="4" stroke="#6C63FF" strokeWidth="3" />
          <line x1="6" y1="20" x2="6" y2="14" stroke="#6C63FF" strokeWidth="3" />
        </>
      )}
    </svg>
  );
}

function TrophyIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#6C63FF" : "none"}
      stroke={active ? "#6C63FF" : "#8892AA"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 21 16 21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <path d="M7 4H17L17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11V4Z" />
      <path d="M7 7H4C4 7 4 11 7 11" />
      <path d="M17 7H20C20 7 20 11 17 11" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#6C63FF" : "none"}
      stroke={active ? "#6C63FF" : "#8892AA"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
