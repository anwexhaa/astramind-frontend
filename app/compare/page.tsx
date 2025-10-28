"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeftRight, Loader2, Upload } from "lucide-react";

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

  // 🔹 Fetch saved reports
  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await axios.get("http://localhost:3001/api/reports");
        setReports(response.data.reports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }
    fetchReports();
  }, []);

  // 🔹 Upload file to backend and return its report object
  const uploadAndAnalyze = async (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    const res = await axios.post("http://localhost:3001/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.report; // must return { _id, filename, summary }
  };

  // 🔹 Handle comparison
  const handleCompare = async () => {
    setLoading(true);
    setComparisonResult("");

    try {
      let reportA: Report | undefined;
      let reportB: Report | undefined;

      // if user selected from saved
      if (selectedA) reportA = reports.find((r) => r._id === selectedA);
      // if user uploaded new file
      if (fileA) reportA = await uploadAndAnalyze(fileA);

      if (selectedB) reportB = reports.find((r) => r._id === selectedB);
      if (fileB) reportB = await uploadAndAnalyze(fileB);

      if (!reportA || !reportB) throw new Error("Missing report data");

      const response = await axios.post("http://localhost:3001/api/compare", {
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#111121] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-semibold mb-10 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          ⚖️ Compare Reports
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 bg-gray-900/40 border border-gray-800/60 backdrop-blur-xl rounded-3xl shadow-[0_0_25px_rgba(56,189,248,0.15)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center mb-8">
            {/* Report A */}
            <div className="flex flex-col gap-3">
              <select
                className="bg-[#0d0d14] border border-gray-700/60 rounded-xl p-3 text-gray-200 focus:outline-none focus:border-cyan-400 transition"
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

              <label className="flex items-center justify-center gap-2 bg-[#0d0d14] border border-gray-700/60 rounded-xl p-3 cursor-pointer hover:border-cyan-400 transition">
                <Upload size={18} className="text-cyan-400" />
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

            <div className="flex justify-center">
              <ArrowLeftRight className="text-cyan-400" size={26} />
            </div>

            {/* Report B */}
            <div className="flex flex-col gap-3">
              <select
                className="bg-[#0d0d14] border border-gray-700/60 rounded-xl p-3 text-gray-200 focus:outline-none focus:border-cyan-400 transition"
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

              <label className="flex items-center justify-center gap-2 bg-[#0d0d14] border border-gray-700/60 rounded-xl p-3 cursor-pointer hover:border-cyan-400 transition">
                <Upload size={18} className="text-cyan-400" />
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
                loading ||
                (!selectedA && !fileA) ||
                (!selectedB && !fileB)
              }
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-medium text-white hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Comparing...
                </span>
              ) : (
                "Compare"
              )}
            </button>
          </div>
        </motion.div>

        {/* Comparison Result */}
        {comparisonResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 p-8 bg-gradient-to-b from-[#111122] to-[#0c0c15] border border-gray-800/70 rounded-3xl shadow-[0_0_30px_rgba(56,189,248,0.25)]"
          >
            <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              AI Comparison Result
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {comparisonResult}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
