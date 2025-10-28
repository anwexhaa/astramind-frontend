import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "AstraMind",
  description: "AI-powered Fintech Insights",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
        <nav className="w-full border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-6 py-3 flex justify-between items-center">
          <h1 className="font-semibold text-lg text-white tracking-tight">AstraMind</h1>
          <div className="flex gap-6 text-sm">
            <Link href="/dashboard" className="hover:text-zinc-300">Dashboard</Link>
            <Link href="/analyze" className="hover:text-zinc-300">Analyze</Link>
            <Link href="/reports" className="hover:text-zinc-300">Reports</Link>
            <Link href="/compare" className="hover:text-zinc-300">Compare</Link>
            <Link href="/plugin" className="hover:text-zinc-300">Plugin</Link>
            <Link href="/chat" className="hover:text-zinc-300">Chat</Link>
          </div>
        </nav>

        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
