"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-semibold mb-6">📊 Reports</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports yet. Upload one from Analyze page.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map((r) => (
            <div
              key={r._id}
              className="p-5 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500 transition"
            >
              <h2 className="text-xl font-medium mb-2">{r.filename}</h2>

              <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                {r.summary}
              </p>

              <p className="text-blue-400">
                AI Score: {r.overall_score ?? r.score ?? "N/A"}/100
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
