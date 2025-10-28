"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function AnalyzePage() {
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

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/analyze`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Analyze Financial Report</h2>
      <p className="text-zinc-400">
        Upload a PDF to generate insights, highlights, and risk scores.
      </p>

      <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 text-center bg-zinc-900/50">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer text-zinc-300 hover:text-white"
        >
          {file ? file.name : "Click to select or drag a PDF file here"}
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-zinc-100 text-zinc-900 px-6 py-2 rounded-lg hover:bg-white disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {error && <p className="text-red-400">{error}</p>}

      {result && (
        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 mt-6">
          <h3 className="font-medium mb-2 text-zinc-200">Analysis Summary</h3>
          <p className="text-sm text-zinc-400">{result.summary}</p>
        </div>
      )}
    </div>
  );
}
