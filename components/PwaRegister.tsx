"use client";
import { useEffect, useState } from "react";

export default function PwaRegister() {
  const [prompt, setPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(console.error);
    const h = (e: Event) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  if (!prompt || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto">
      <div className="domi-card p-4 flex items-center gap-3 shadow-xl shadow-blue-100 border border-[#E8EEFF]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#4E87F5] flex items-center justify-center text-xl flex-shrink-0">💸</div>
        <div className="flex-1">
          <p className="text-[#1a1a2e] text-sm font-black">Install DOMI</p>
          <p className="text-[#8892AA] text-xs">Tambah ke home screen</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setDismissed(true)} className="text-[#8892AA] text-xs px-2 py-1.5 rounded-lg hover:bg-[#EEF4FF]">Nanti</button>
          <button onClick={async () => { await prompt.prompt(); setPrompt(null); }} className="bg-[#6C63FF] text-white text-xs font-bold px-3 py-1.5 rounded-xl">Install</button>
        </div>
      </div>
    </div>
  );
}
