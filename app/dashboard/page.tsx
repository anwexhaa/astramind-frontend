export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-zinc-400">
        Welcome to AstraMind — your AI-powered fintech dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h3 className="font-medium text-zinc-200 mb-2">Portfolio Overview</h3>
          <p className="text-sm text-zinc-400">Coming soon…</p>
        </div>
        <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h3 className="font-medium text-zinc-200 mb-2">Latest Reports</h3>
          <p className="text-sm text-zinc-400">Your analyzed PDFs will appear here.</p>
        </div>
        <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h3 className="font-medium text-zinc-200 mb-2">Trends</h3>
          <p className="text-sm text-zinc-400">Visual analytics coming soon.</p>
        </div>
      </div>
    </div>
  );
}
