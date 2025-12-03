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

export default function RMPerformanceChart({ rows }) {
  if (!rows || !rows.length) return <p className="text-purple-300">No data available</p>;

  // Group scores by RM
  const rmGroups = {};

  rows.forEach((row) => {
    const rm = row["RM"] || "Unknown";
    const score = parseFloat(row["Overall Score"] || 0);

    if (!rmGroups[rm]) rmGroups[rm] = [];
    rmGroups[rm].push(score);
  });

  // Compute average scores
  const rmAverages = Object.keys(rmGroups).map((rm) => {
    const scores = rmGroups[rm];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { rm, avg: +avg.toFixed(2) };
  });

  // Sort descending (best RM first)
  const sorted = rmAverages.sort((a, b) => b.avg - a.avg);

  const labels = sorted.map((d) => d.rm);
  const scores = sorted.map((d) => d.avg);

  // Gradient color based on score
  const colors = scores.map((s) => {
    if (s >= 25) return "rgba(74, 222, 128, 0.9)";     // green
    if (s >= 20) return "rgba(250, 204, 21, 0.9)";     // yellow
    if (s >= 15) return "rgba(251, 146, 60, 0.9)";     // orange
    return "rgba(239, 68, 68, 0.9)";                   // red
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Avg Overall Score",
        data: scores,
        backgroundColor: colors,
        borderRadius: 8,
        barThickness: 22,
      },
    ],
  };

  const options = {
    indexAxis: "y", // <<< HORIZONTAL BARS
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.raw} / 30`,
        },
      },
    },
    scales: {
      x: {
        max: 30,
        beginAtZero: true,
        ticks: { color: "#d8b4fe", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#d8b4fe", font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
