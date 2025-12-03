import { useEffect, useState } from "react";
import TopBottomChart from "./components/TopBottomChart";

import RMPerformanceChart from "./components/RMPerformanceChart";

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

  const top3Clients = (() => {
    if (!rows.length) return [];

    return rows
      .map((r) => ({
        name: r["Client"],
        score: parseFloat(r["Overall Score"] || 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
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
          {/* <p className="text-purple-300 mt-3 text-xs">
            Total rows with valid usage score.
          </p> */}
        </div>

        {/* Avg Score */}
        <div className="rounded-big bg-bgCard shadow-card border border-accentBorder/40 px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-purple-300 uppercase tracking-widest">
              Avg Overall Score
            </p>
          </div>
          <h2 className="text-5xl font-bold mt-3">
            {stats ? `${stats.average_overall_score} / 30` : "—"}
          </h2>
          <p className="text-purple-300 mt-3 text-xs">
            Weighted score from module + ERP usage metrics.
          </p>
        </div>

        {/* Top 3 Clients */}
        <div className="rounded-big bg-bgCard shadow-card border border-accentBorder/40 px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-purple-300 uppercase tracking-widest">
              Top Performing
            </p>
            <span className="px-3 py-1 text-[11px] border border-purple-300/40 rounded-full">
              TOP 3
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {top3Clients.length > 0 ? (
              top3Clients.map((client, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-purple-300 w-6">
                      {index + 1}.
                    </span>
                    <span className="text-xl font-semibold">{client.name}</span>
                  </div>
                  <span className="text-sm text-purple-200 font-medium">
                    {client.score.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xl font-semibold">—</p>
            )}
          </div>
        </div>

      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 gap-6 mt-12">

        {/* Top vs Bottom */}
        <div className="rounded-big bg-bgCardSoft border border-accentBorder/40 px-6 py-5 shadow-card min-h-[400px] flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Top vs Bottom Performing Campuses</h3>
            <p className="text-sm text-purple-300 mt-1">
              Ranked by Overall Score.
            </p>
          </div>

          <div className="flex-1 min-h-0">
            <div className="h-full w-full">
              <TopBottomChart rows={rows} />
            </div>
          </div>
        </div>

        {/* Module-wise */}
        <div className="rounded-big bg-bgCardSoft border border-accentBorder/40 px-6 py-5 shadow-card min-h-[400px] flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">RM Performance (Average Overall Score)</h3>
            <p className="text-sm text-purple-300 mt-1">
              Average overall score grouped by Relationship Manager.
            </p>
          </div>

          <div className="flex-1 min-h-0">
            <div className="h-full w-full">
              <RMPerformanceChart rows={rows} />
            </div>
          </div>
        </div>

      </div>

      {/* Table */}
      {/* <div className="rounded-big bg-bgCardSoft border border-accentBorder/40 px-6 py-5 mt-12 shadow-card">
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
      </div> */}

      {/* Footer */}
      <div className="mt-12 pt-6 pb-4 text-center">
        <p className="text-sm text-purple-300/60">
          Developed by rahul sharma
        </p>
      </div>
    </div>
  );
}
