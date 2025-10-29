"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MarketPage() {
  const [stocks, setStocks] = useState<
    { symbol: string; price: number; change: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const symbols = ["AAPL", "MSFT", "TSLA", "AMZN", "GOOGL"];
        const results = await Promise.all(
          symbols.map(async (s) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plugin/stock/${s}`
);
            const data = await res.json();
            const randomChange = (Math.random() * 2 - 1).toFixed(2); // fake daily % change
            return {
              symbol: s,
              price: data?.data?.price || 0,
              change: parseFloat(randomChange),
            };
          })
        );
        setStocks(results);
      } catch (err) {
        console.error("❌ Market fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-teal-300 bg-clip-text text-transparent">
          Market Overview
        </h1>
        <p className="text-zinc-400 mt-2">
          Live snapshots of key stocks powered by AstraMind’s plugin system.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="p-6 rounded-2xl border border-zinc-800 bg-[#111]/60 backdrop-blur-lg shadow-inner hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-zinc-200">
                {stock.symbol}
              </h3>
              {stock.change >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-rose-400" />
              )}
            </div>

            <p className="text-3xl font-bold text-zinc-100">
              ${stock.price.toFixed(2)}
            </p>
            <p
              className={`text-sm mt-2 ${
                stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change}% today
            </p>

            <div className="mt-4 h-16 bg-[#1a1a1a] rounded-lg overflow-hidden relative">
              <div
                className={`absolute bottom-0 left-0 w-full h-full ${
                  stock.change >= 0
                    ? "bg-gradient-to-t from-emerald-500/10 to-transparent"
                    : "bg-gradient-to-t from-rose-500/10 to-transparent"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
