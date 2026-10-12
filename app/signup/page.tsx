"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import api from "@/lib/api";
import Link from "next/link";
import { Brain, UserPlus, Sparkles } from "lucide-react";

export default function SignupPage() {
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // 🔗 Sync Firebase user with MongoDB
      await api.post("/api/auth/sync");

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
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#F8C8DC] rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#FFE6A7] rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B6F2E5] rounded-full blur-3xl opacity-5 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#F8C8DC] to-[#FFE6A7] rounded-full opacity-40"
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
            <UserPlus className="w-6 h-6 text-[#F8C8DC] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <p className="text-xl font-light tracking-wide">Begin your cosmic journey with us</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-5 w-96 bg-zinc-900/30 backdrop-blur-xl p-8 rounded-3xl border border-zinc-700/50 shadow-2xl shadow-[#F8C8DC]/10 hover:shadow-[#F8C8DC]/20 transition-all duration-500"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-2xl bg-black/40 border border-zinc-600 focus:border-[#B6F2E5] focus:ring-2 focus:ring-[#B6F2E5]/20 outline-none text-white placeholder-zinc-500 transition-all duration-300 hover:border-zinc-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-2xl bg-black/40 border border-zinc-600 focus:border-[#F8C8DC] focus:ring-2 focus:ring-[#F8C8DC]/20 outline-none text-white placeholder-zinc-500 transition-all duration-300 hover:border-zinc-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-8 py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] shadow-[0_0_40px_rgba(248,200,220,0.4)] hover:shadow-[0_0_60px_rgba(248,200,220,0.6)] hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#B6F2E5] hover:text-[#F8C8DC] underline underline-offset-4 decoration-2 transition-all duration-300 hover:decoration-[#FFE6A7] font-medium">
            Log in
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
