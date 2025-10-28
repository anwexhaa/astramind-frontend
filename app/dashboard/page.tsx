"use client";

import { useRouter } from "next/navigation";
import {
  BarChart3,
  Brain,
  FileText,
  TrendingUp,
  Layers,
  MessageSquare,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const cards = [
    {
      title: "Analyze Reports",
      desc: "Upload and analyze PDFs using AstraMind’s AI engine.",
      icon: <FileText className="w-6 h-6 text-indigo-400" />,
      href: "/analyze",
    },
    {
      title: "View Reports",
      desc: "Access all previously analyzed financial summaries.",
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      href: "/reports",
    },
    {
      title: "Compare Insights",
      desc: "Compare multiple companies or reports side by side.",
      icon: <BarChart3 className="w-6 h-6 text-teal-400" />,
      href: "/compare",
    },
    {
      title: "Plugin Center",
      desc: "Integrate APIs and enhance AstraMind’s intelligence.",
      icon: <Brain className="w-6 h-6 text-pink-400" />,
      href: "/plugin",
    },
    {
      title: "AI Chat",
      desc: "Talk to AstraMind — your conversational financial analyst.",
      icon: <MessageSquare className="w-6 h-6 text-yellow-400" />,
      href: "/chat",
    },
    {
      title: "Market Overview",
      desc: "Check real-time portfolio data and stock movements.",
      icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
      href: "/market",
    },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#0a0a0a] text-zinc-100 px-10 py-8 flex flex-col">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-teal-300 bg-clip-text text-transparent">
          AstraMind Dashboard
        </h1>
        <p className="text-zinc-400 mt-2">
          Your command center for financial intelligence and AI-powered insights.
        </p>
      </header>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => router.push(card.href)}
            className="group cursor-pointer p-6 rounded-2xl border border-zinc-800 bg-[#111]/60 backdrop-blur-lg shadow-inner transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-[#1a1a1a] group-hover:bg-[#222] transition">
                {card.icon}
              </div>
            </div>
            <h3 className="font-semibold text-zinc-200 text-lg mb-1 group-hover:text-indigo-400 transition">
              {card.title}
            </h3>
            <p className="text-sm text-zinc-400">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
