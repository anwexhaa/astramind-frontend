"use client";

import { useRouter } from "next/navigation";
import { Brain } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/dashboard");
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white font-sans">
      {/* Center content */}
      <main className="flex flex-col items-center justify-center text-center px-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-12 h-12 text-[#B6F2E5] drop-shadow-[0_0_15px_rgba(182,242,229,0.4)]" />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] bg-clip-text text-transparent">
            AstraMind
          </h1>
        </div>

        <p className="text-lg text-zinc-400 max-w-md leading-relaxed mb-10">
          Your AI-powered financial intelligence workspace.  
          Parse reports, compare trends, and chat with your own finance AI.
        </p>

        <button
          onClick={handleStart}
          className="px-10 py-3 rounded-full font-semibold text-black bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] shadow-[0_0_20px_rgba(182,242,229,0.3)] hover:scale-105 transition-transform duration-200"
        >
          Let’s Get Started →
        </button>
      </main>
    </div>
  );
}
