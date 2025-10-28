import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "AstraMind",
  description: "AI-powered Fintech Insights",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
