"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {app} from "@/lib/firebase"; // ✅ default import — matches your firebase.ts

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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // ✅ Get current user's email from Firebase Auth
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch user-specific reports
  useEffect(() => {
    async function fetchReports() {
      if (!userEmail) return;

      try {
        const response = await axios.get(
          `http://localhost:3001/api/reports?email=${encodeURIComponent(userEmail)}`
        );
        setReports(response.data.reports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">
      <div className="max-w-6xl w-full">
        {/* Heading */}
        <h1
          className="text-4xl font-extrabold mb-12 text-center 
          bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] 
          bg-clip-text text-transparent 
          [background-clip:text] [webkit-background-clip:text] [webkit-text-fill-color:transparent]
          drop-shadow-none shadow-none border-none outline-none"
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: "-0.5rem",
          }}
        >
          Reports Overview
        </h1>

        {/* Loading / Empty / Reports */}
        {loading ? (
          <div className="text-zinc-400 text-lg text-center">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-zinc-500 text-lg text-center">
            No reports yet. Upload one from{" "}
            <span className="text-[#F8C8DC] font-medium">Analyze</span> page.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {reports.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedReport(r)}
                className="relative group p-6 rounded-3xl border border-zinc-800 
                bg-gradient-to-br from-[#0b0b0b] via-[#111] to-[#0b0b0b] backdrop-blur-xl 
                cursor-pointer hover:border-[#F8C8DC]/50 
                hover:shadow-[0_0_25px_rgba(248,200,220,0.2)] transition-all"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#B6F2E5]/10 via-[#F8C8DC]/10 to-[#FFE6A7]/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10">
                  <h2 className="text-lg font-semibold mb-3 text-white/90 truncate">
                    {r.filename}
                  </h2>

                  <p className="text-sm text-zinc-400 mb-4 line-clamp-3 leading-relaxed">
                    {r.summary}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-[#F8C8DC] text-sm font-medium">AI Score</p>
                    <span className="text-2xl font-semibold text-[#FFE6A7]">
                      {r.overall_score ?? r.score ?? "N/A"}
                      <span className="text-sm text-zinc-500">/100</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
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
              className="relative bg-gradient-to-b from-[#111] to-[#0c0c0c] border border-zinc-800/70 
              shadow-[0_0_30px_rgba(248,200,220,0.25)] rounded-3xl w-[90%] max-w-3xl p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-[#F8C8DC] transition"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] bg-clip-text text-transparent">
                {selectedReport.filename}
              </h2>

              <div
                className="max-h-[50vh] overflow-y-auto pr-3 text-zinc-300 text-sm leading-relaxed 
                scrollbar-thin scrollbar-thumb-[#B6F2E5]/40 scrollbar-track-zinc-800/40 hover:scrollbar-thumb-[#F8C8DC]/60 transition-all"
              >
                {selectedReport.summary}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
