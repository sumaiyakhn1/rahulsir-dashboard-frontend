import { useEffect, useState } from "react";

const API = "https://dashboard-backend-cal7.onrender.com";

export default function App() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const r = await fetch(`${API}/erp/data`).then(res => res.json());
      const s = await fetch(`${API}/erp/stats`).then(res => res.json());
      setRows(r.rows || []);
      setStats(s);
    } catch (error) {
      console.error(error);
    }
  }

  const bestClient = (() => {
    if (!rows.length) return "—";

    return rows.reduce((best, r) => {
      const s = parseFloat(r["Overall Score"] || 0);
      if (s > (best.score || 0)) return { name: r["Client"], score: s };
      return best;
    }, {}).name;
  })();

  return (
    <div className="min-h-screen px-10 py-6 bg-gradient-to-br from-[#0b0018] to-[#180033] text-white">

      {/* Header */}
      <p className="text-sm text-purple-300 mb-1 tracking-widest uppercase">
        Live ERP Adoption View
      </p>

      <h1 className="text-4xl font-bold mb-1">ERP Usage Intelligence</h1>

      <p className="text-purple-300 text-sm max-w-xl">
        See which campuses are truly using the system — ranking by actual ERP usage,
        app behaviour and module depth.
      </p>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-6 mt-10">

        {/* Active Inst. */}
        <div className="rounded-big bg-bgCard shadow-card border border-accentBorder/40 px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-purple-300 uppercase tracking-widest">
              Active Institutions
            </p>
            <span className="px-3 py-1 text-[11px] border border-purple-300/40 rounded-full">
              CLIENTS
            </span>
          </div>
          <h2 className="text-5xl font-bold mt-3">{rows.length}</h2>
          <p className="text-purple-300 mt-3 text-xs">
            Total rows with valid usage score.
          </p>
        </div>

        {/* Avg Score */}
        <div className="rounded-big bg-bgCard shadow-card border border-accentBorder/40 px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-purple-300 uppercase tracking-widest">
              Avg Overall Score
            </p>
            <span className="px-3 py-1 text-[11px] border border-purple-300/40 rounded-full">
              /30
            </span>
          </div>
          <h2 className="text-5xl font-bold mt-3">
            {stats ? stats.average_overall_score : "—"}
          </h2>
          <p className="text-purple-300 mt-3 text-xs">
            Weighted score from module + ERP usage metrics.
          </p>
        </div>

        {/* Best Client */}
        <div className="rounded-big bg-bgCard shadow-card border border-accentBorder/40 px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-purple-300 uppercase tracking-widest">
              Top Performing
            </p>
            <span className="px-3 py-1 text-[11px] border border-purple-300/40 rounded-full">
              BEST CLIENT
            </span>
          </div>
          <h2 className="text-3xl font-bold mt-4">{bestClient || "—"}</h2>
        </div>

      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-2 gap-6 mt-12">

        {/* Top vs Bottom */}
        <div className="rounded-big bg-bgCardSoft border border-accentBorder/40 px-6 py-5 shadow-card h-[350px]">
          <h3 className="text-lg font-semibold">Top vs Bottom Performing Campuses</h3>
          <p className="text-sm text-purple-300">
            Ranked by Overall Score.
          </p>

          <div className="mt-6 text-sm text-purple-200/80">
            Chart will be added here (bar chart).
          </div>
        </div>

        {/* Module-wise */}
        <div className="rounded-big bg-bgCardSoft border border-accentBorder/40 px-6 py-5 shadow-card h-[350px]">
          <h3 className="text-lg font-semibold">Module-wise Score for Selected Campus</h3>

          <div className="mt-6 text-sm text-purple-200/80">
            Radar chart will be added next.
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="rounded-big bg-bgCardSoft border border-accentBorder/40 px-6 py-5 mt-12 shadow-card">
        <h3 className="font-semibold text-lg mb-3">
          All Clients – ERP Adoption View
        </h3>

        <div className="overflow-auto max-h-[350px] rounded-xl border border-purple-900/60">
          <table className="w-full text-xs">
            <thead className="bg-[#1d0838] sticky top-0 z-10">
              <tr>
                {rows[0] &&
                  Object.keys(rows[0]).map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left font-medium text-purple-200"
                    >
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="even:bg-[#150428] odd:bg-[#120222] border-b border-purple-900/40"
                >
                  {Object.keys(row).map((h) => (
                    <td key={h} className="px-3 py-2 whitespace-nowrap">
                      {row[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-purple-300 mt-4">
          Scores and usage % are read-only from your live ERP score sheet.
        </p>
      </div>
    </div>
  );
}
