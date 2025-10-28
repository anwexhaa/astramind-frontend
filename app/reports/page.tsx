"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Report {
  _id: string;
  filename: string;
  summary: string;
  score: number;
  overall_score?: number;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await axios.get("http://localhost:3001/api/reports");
        setReports(response.data.reports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#111121] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold mb-10 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          📊 Reports Overview
        </h1>

        {loading ? (
          <div className="text-gray-400 text-lg">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-gray-500 text-lg">
            No reports yet. Upload one from{" "}
            <span className="text-blue-400">Analyze</span> page.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedReport(r)}
                className="relative group p-6 rounded-3xl border border-gray-800/60 bg-gray-900/40 backdrop-blur-xl cursor-pointer transition hover:border-blue-500/80 hover:shadow-[0_0_25px_rgba(56,189,248,0.3)]"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-600/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10">
                  <h2 className="text-xl font-medium mb-3 text-white/90 truncate">
                    {r.filename}
                  </h2>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                    {r.summary}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-blue-400 text-sm">AI Score</p>
                    <span className="text-2xl font-semibold text-cyan-300">
                      {r.overall_score ?? r.score ?? "N/A"}
                      <span className="text-sm text-gray-400">/100</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 🔷 Report Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              className="relative bg-gradient-to-b from-[#111122] to-[#0c0c15] border border-gray-800/70 shadow-[0_0_30px_rgba(56,189,248,0.25)] rounded-3xl w-[90%] max-w-3xl p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {selectedReport.filename}
              </h2>

              <div className="max-h-[50vh] overflow-y-auto pr-2 mb-2 text-gray-300 text-sm leading-relaxed">
                {selectedReport.summary}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
