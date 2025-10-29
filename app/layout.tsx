// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "./components/ClientLayout";

export const metadata = {
  title: "AstraMind",
  description: "AI-powered Fintech Insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
        <AuthProvider>
          {/* Client-side layout handles showing/hiding Navbar */}
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
