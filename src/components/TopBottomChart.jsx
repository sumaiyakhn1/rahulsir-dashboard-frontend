import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TopBottomChart({ rows }) {
  if (!rows || !rows.length) return <p className="text-purple-300">No data yet…</p>;

  // Sort clients by overall score (descending)
  const sorted = [...rows].sort(
    (a, b) => parseFloat(b["Overall Score"] || 0) - parseFloat(a["Overall Score"] || 0)
  );

  const labels = sorted.map(r => r.Client);
  const scores = sorted.map(r => parseFloat(r["Overall Score"] || 0));

  // Gradient color based on score
  const gradientColors = scores.map(score => {
    if (score >= 25) return "rgba(74, 222, 128, 0.9)";   // green
    if (score >= 20) return "rgba(250, 204, 21, 0.9)";   // yellow
    if (score >= 15) return "rgba(251, 146, 60, 0.9)";   // orange
    return "rgba(239, 68, 68, 0.9)";                     // red
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Overall Score",
        data: scores,
        backgroundColor: gradientColors,
        borderRadius: 10,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#d8b4fe" },
      },
      y: {
        max: 30, // <<< Y AXIS OUT OF 30
        beginAtZero: true,
        ticks: { color: "#d8b4fe" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
