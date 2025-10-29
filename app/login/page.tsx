"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Brain, LogIn, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/");
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#B6F2E5] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F8C8DC] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFE6A7] rounded-full blur-3xl opacity-5 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#B6F2E5] to-[#F8C8DC] rounded-full opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="relative">
          <Brain className="w-14 h-14 text-[#B6F2E5] drop-shadow-[0_0_20px_rgba(182,242,229,0.6)] animate-float" />
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-[#FFE6A7] animate-pulse" />
        </div>
        <h1 className="text-6xl font-black bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(182,242,229,0.3)]">
          AstraMind
        </h1>
      </div>

      <main className="flex flex-col items-center justify-center text-center px-6 relative z-10">
        <div className="flex items-center gap-3 mb-8 text-zinc-300 group">
          <div className="p-2 rounded-full bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-all duration-300">
            <LogIn className="w-6 h-6 text-[#F8C8DC] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <p className="text-xl font-light tracking-wide">Welcome back — your journey continues</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5 w-96 bg-zinc-900/30 backdrop-blur-xl p-8 rounded-3xl border border-zinc-700/50 shadow-2xl shadow-[#B6F2E5]/10 hover:shadow-[#B6F2E5]/20 transition-all duration-500"
        >
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 rounded-2xl bg-black/40 border border-zinc-600 focus:border-[#B6F2E5] focus:ring-2 focus:ring-[#B6F2E5]/20 outline-none text-white placeholder-zinc-500 transition-all duration-300 hover:border-zinc-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-2xl bg-black/40 border border-zinc-600 focus:border-[#F8C8DC] focus:ring-2 focus:ring-[#F8C8DC]/20 outline-none text-white placeholder-zinc-500 transition-all duration-300 hover:border-zinc-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-8 py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] shadow-[0_0_40px_rgba(182,242,229,0.4)] hover:shadow-[0_0_60px_rgba(182,242,229,0.6)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-[0_0_40px_rgba(182,242,229,0.4)] relative overflow-hidden group"
          >
            <span className="relative z-10">{loading ? "Logging in..." : "Log In"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFE6A7] via-[#F8C8DC] to-[#B6F2E5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-400">
          New here?{" "}
          <Link
            href="/signup"
            className="text-[#B6F2E5] hover:text-[#F8C8DC] underline underline-offset-4 decoration-2 transition-all duration-300 hover:decoration-[#FFE6A7] font-medium"
          >
            Create an account
          </Link>
        </p>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}