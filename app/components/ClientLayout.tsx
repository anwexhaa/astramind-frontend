"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import api from "@/lib/api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // hide Navbar on auth pages
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  // ✅ Auto-sync Firebase user with MongoDB on login/signup
  useEffect(() => {
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await api.post("/api/auth/sync");
          console.log("✅ Synced user to MongoDB:", user.email);
        } catch (err) {
          console.error("❌ Error syncing user:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="flex-1 overflow-y-auto scrollbar-hide">{children}</main>
    </>
  );
}
