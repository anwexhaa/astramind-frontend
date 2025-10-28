"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Analyze", href: "/analyze" },
    { name: "Reports", href: "/reports" },
    { name: "Compare", href: "/compare" },
    { name: "Plugin", href: "/plugin" },
    { name: "Chat", href: "/chat" },
  ];

  return (
    <nav className="w-full border-b border-white/10 bg-[#09090b] px-8 py-4 flex justify-between items-center backdrop-blur-md shadow-[0_0_25px_rgba(182,242,229,0.08)]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <Brain className="w-6 h-6 text-[#B6F2E5] drop-shadow-[0_0_10px_rgba(182,242,229,0.5)]" />
        <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] bg-clip-text text-transparent">
          AstraMind
        </h1>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6 text-sm">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative transition ${
                isActive ? "text-white font-medium" : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.name}
              {isActive && (
                <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#B6F2E5] to-[#F8C8DC]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
