import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "DOMI — Catat Pengeluaran Semudah Chat",
  description: "Catat pengeluaran semudah chat. Tahu kondisi dompetmu setiap hari.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DOMI" },
};
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1,
  userScalable: false, viewportFit: "cover", themeColor: "#C8D8FF",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
      </head>
      <body className="gradient-bg text-[#1a1a2e] antialiased overflow-hidden">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
