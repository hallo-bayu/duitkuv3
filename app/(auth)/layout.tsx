export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-5">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
