//analyze/page.tsx

"use client";

import { useState } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Brain, FileUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AnalyzePage() {
  const { user } = useAuth(); // ✅ access Firebase user
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }
    if (!user) {
      setError("Please log in to analyze and save reports.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      // ✅ Analyze & auto-save report to DB
      // The backend links the report to the user from the auth token
      const response = await api.post(
        "/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(response.data);
    } catch (err: any) {
      console.error("❌ Analyze error:", err);
      // Show the backend's reason (e.g. "File too large", expired login)
      const reason = err?.response?.data?.error;
      setError(reason ? `Failed to analyze report: ${reason}` : "Failed to analyze report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Brain className="w-10 h-10 text-[#B6F2E5] drop-shadow-[0_0_15px_rgba(182,242,229,0.4)]" />
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] bg-clip-text text-transparent">
          AstraMind Analyzer
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-zinc-400 text-center mb-10 max-w-xl leading-relaxed">
        Upload any financial PDF to extract key insights, detect risk signals,
        and generate AI-powered summaries — all securely stored to your account.
      </p>

      {/* Upload Section */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-xl p-8 border border-zinc-800 bg-gradient-to-br from-[#0b0b0b] via-[#111] to-[#0b0b0b] rounded-3xl shadow-[0_0_25px_rgba(182,242,229,0.08)]"
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />

        <label
          htmlFor="file-input"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <FileUp className="w-10 h-10 mb-3 text-[#B6F2E5]" />
          <p className="text-zinc-300 hover:text-white transition text-center">
            {file ? (
              <span className="text-[#F8C8DC] font-medium">{file.name}</span>
            ) : (
              "Click to upload or drag a PDF file"
            )}
          </p>
          <p className="text-xs text-zinc-500 mt-2">Supported format: .pdf</p>
        </label>
      </motion.div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-8 bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] text-black font-semibold px-6 py-2 rounded-full hover:opacity-90 disabled:opacity-60 transition"
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 mt-4 font-medium drop-shadow-[0_0_6px_rgba(255,0,0,0.4)]">
          {error}
        </p>
      )}

      {/* Result Display */}
      {result && result.summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-6 rounded-2xl border border-zinc-800 bg-gradient-to-br from-[#0b0b0b] via-[#111] to-[#0b0b0b] shadow-[0_0_20px_rgba(255,230,167,0.05)] max-w-2xl w-full"
        >
          <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[#B6F2E5] via-[#F8C8DC] to-[#FFE6A7] bg-clip-text text-transparent">
            Analysis Summary
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {result.summary}
          </p>
        </motion.div>
      )}
    </div>
  );
}
