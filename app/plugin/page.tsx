"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { TrendingUp, DollarSign, BarChart3, Brain } from "lucide-react";

export default function PluginPage() {
  const [stockData, setStockData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/plugin/stock/history/AAPL`
);
        const json = await res.json();

        if (json.success && json.history) {
          const formatted = json.history.map((h: any) => ({
            time: new Date(h.date).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            price: h.close,
          }));
          setStockData(formatted);
        } else {
          console.error("⚠️ No valid stock data found");
        }
      } catch (e) {
        console.error("Stock fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  const currencyData = [
    { name: "USD", value: 55, color: "#B6F2E5" },
    { name: "EUR", value: 25, color: "#F8C8DC" },
    { name: "INR", value: 20, color: "#FFE6A7" },
  ];

  const marketData = [
    { name: "Tech", value: 78 },
    { name: "Finance", value: 65 },
    { name: "Energy", value: 48 },
    { name: "Health", value: 58 },
  ];

  const cards = [
    {
      title: "Live Stock Tracker",
      icon: <TrendingUp className="text-[#B6F2E5]" size={26} />,
      gradient: "from-[#0b0b0b] via-[#151515] to-[#0b0b0b]",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stockData}>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#bbb" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              minTickGap={10}
              angle={-30}
              textAnchor="end"
            />
            <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(18, 22, 30, 0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#B6F2E5" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#B6F2E5"
              strokeWidth={3}
              dot={false}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Currency Insights",
      icon: <DollarSign className="text-[#F8C8DC]" size={26} />,
      gradient: "from-[#0b0b0b] via-[#151515] to-[#0b0b0b]",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={currencyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={6}
            >
              {currencyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(18, 22, 30, 0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#ffffff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Market Analytics",
      icon: <BarChart3 className="text-[#FFE6A7]" size={26} />,
      gradient: "from-[#0b0b0b] via-[#151515] to-[#0b0b0b]",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={marketData}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(18, 22, 30, 0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="value" fill="#B6F2E5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-black text-white font-sans px-6 py-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-10 h-10 text-[#B6F2E5] drop-shadow-[0_0_15px_rgba(182,242,229,0.4)]" />
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] bg-clip-text text-transparent">
          AstraMind Plugins
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-zinc-400 text-center mb-16 max-w-2xl leading-relaxed">
        Visualize key market data and financial signals in real-time — powered by AstraMind’s AI-driven insights.
      </p>

      {/* Report Overview Label */}
      <motion.h2
        className="text-2xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        PLUGINS
      </motion.h2>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl pb-20">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={`rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br ${card.gradient} shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-3">
                {card.icon}
                {card.title}
              </h2>
            </div>
            <div className="h-60 flex items-center justify-center">
              {loading ? <p className="text-zinc-400">Loading...</p> : card.content}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
