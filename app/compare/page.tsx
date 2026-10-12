"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowLeftRight, Loader2, Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Report {
  _id: string;
  filename: string;
  summary: string;
}

export default function ComparePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedA, setSelectedA] = useState<string>("");
  const [selectedB, setSelectedB] = useState<string>("");
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [comparisonResult, setComparisonResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await api.get("/api/reports");
        setReports(response.data.reports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }
    fetchReports();
  }, []);

  const uploadAndAnalyze = async (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    const res = await api.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.report;
  };

  const handleCompare = async () => {
    setLoading(true);
    setComparisonResult("");
    try {
      let reportA: Report | undefined;
      let reportB: Report | undefined;

      if (selectedA) reportA = reports.find((r) => r._id === selectedA);
      if (fileA) reportA = await uploadAndAnalyze(fileA);

      if (selectedB) reportB = reports.find((r) => r._id === selectedB);
      if (fileB) reportB = await uploadAndAnalyze(fileB);

      if (!reportA || !reportB) throw new Error("Missing report data");

      const response = await api.post("/api/compare"
, {
        reportA,
        reportB,
      });

      setComparisonResult(response.data.result || "No comparison available.");
    } catch (error) {
      console.error("Error comparing reports:", error);
      setComparisonResult("⚠️ Failed to compare reports. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#0a0a0f] to-[#111111] text-white px-6 py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-full">
        {/* Heading */}
        <h1
          className="text-4xl font-extrabold mb-10 text-center 
          bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] 
          bg-clip-text text-transparent 
          [background-clip:text] [webkit-background-clip:text] [webkit-text-fill-color:transparent]
          drop-shadow-none shadow-none border-none outline-none"
        >
          ⚖️ Compare Reports
        </h1>

        {/* Comparison Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-5xl p-8 rounded-3xl border border-zinc-800/70 bg-[#0d0d0f]/70 backdrop-blur-xl 
          shadow-[0_0_25px_rgba(248,200,220,0.15)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center mb-8">
            {/* Report A */}
            <div className="flex flex-col gap-3">
              <select
                className="bg-[#0d0d14] border border-zinc-700/60 rounded-xl p-3 text-gray-200 focus:outline-none focus:border-[#F8C8DC] transition"
                value={selectedA}
                onChange={(e) => {
                  setSelectedA(e.target.value);
                  setFileA(null);
                }}
              >
                <option value="">Select Report A</option>
                {reports.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.filename}
                  </option>
                ))}
              </select>

              <label className="flex items-center justify-center gap-2 bg-[#0d0d14] border border-zinc-700/60 rounded-xl p-3 cursor-pointer hover:border-[#F8C8DC]/70 transition">
                <Upload size={18} className="text-[#F8C8DC]" />
                <span className="text-gray-300 text-sm">
                  {fileA ? fileA.name : "Or upload PDF A"}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFileA(e.target.files[0]);
                      setSelectedA("");
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Middle Icon */}
            <div className="flex justify-center items-center">
              <ArrowLeftRight className="text-[#FFE6A7]" size={28} />
            </div>

            {/* Report B */}
            <div className="flex flex-col gap-3">
              <select
                className="bg-[#0d0d14] border border-zinc-700/60 rounded-xl p-3 text-gray-200 focus:outline-none focus:border-[#F8C8DC] transition"
                value={selectedB}
                onChange={(e) => {
                  setSelectedB(e.target.value);
                  setFileB(null);
                }}
              >
                <option value="">Select Report B</option>
                {reports.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.filename}
                  </option>
                ))}
              </select>

              <label className="flex items-center justify-center gap-2 bg-[#0d0d14] border border-zinc-700/60 rounded-xl p-3 cursor-pointer hover:border-[#F8C8DC]/70 transition">
                <Upload size={18} className="text-[#F8C8DC]" />
                <span className="text-gray-300 text-sm">
                  {fileB ? fileB.name : "Or upload PDF B"}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFileB(e.target.files[0]);
                      setSelectedB("");
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCompare}
              disabled={
                loading || (!selectedA && !fileA) || (!selectedB && !fileB)
              }
              className="px-8 py-3 rounded-xl font-medium text-white 
              bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] 
              hover:shadow-[0_0_25px_rgba(248,200,220,0.4)] 
              transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin text-[#FFE6A7]" size={18} /> Comparing...
                </span>
              ) : (
                "Compare"
              )}
            </button>
          </div>
        </motion.div>

        {/* Result Section */}
        {comparisonResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 p-8 bg-gradient-to-b from-[#111] to-[#0c0c0c] border border-zinc-800/70 rounded-3xl 
            shadow-[0_0_30px_rgba(248,200,220,0.25)] max-w-5xl overflow-hidden"
          >
            <h2 className="text-2xl font-semibold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7]">
              AI Comparison Result
            </h2>
            <div className="text-gray-300 text-sm leading-relaxed max-h-[35vh] overflow-y-auto pr-2 
            scrollbar-thin scrollbar-thumb-[#F8C8DC]/40 scrollbar-track-zinc-800/30 hover:scrollbar-thumb-[#FFE6A7]/60">
              <ReactMarkdown>{comparisonResult}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
