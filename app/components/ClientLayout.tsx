// app/components/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "./Navbar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // hide Navbar on auth pages
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="flex-1 overflow-y-auto scrollbar-hide">{children}</main>
    </>
  );
}
