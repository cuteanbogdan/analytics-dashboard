import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface TrendsChartProps {
  data: { date: string; count: number }[];
  label: string;
  backgroundColor?: string;
  borderColor?: string;
}

const TrendsChart: React.FC<TrendsChartProps> = ({
  data,
  label,
  backgroundColor = "rgba(99, 102, 241, 0.2)",
  borderColor = "rgba(99, 102, 241, 1)",
}) => {
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label,
        data: data.map((entry) => entry.count),
        fill: true,
        backgroundColor,
        borderColor,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: label }, beginAtZero: true },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TrendsChart;
