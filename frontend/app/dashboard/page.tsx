
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface BotPerformance {
  botId: string;
  uploadId: string;
  accuracy: number;
  generatedAt: string;
}

interface BotEntry {
  id: string;
  name: string;
  createdAt: string;
  accuracy: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  winLossRatio: string;
}

export default function DashboardPage() {
  const [performances, setPerformances] = useState<BotPerformance[]>([]);
  const [bots, setBots] = useState<BotEntry[]>([]);
  const [minAccuracy, setMinAccuracy] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"date" | "accuracy">("date");

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const res = await fetch("http://localhost:8001/api/bots/performance", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) setPerformances(data);
        else console.error("Performance data is not array:", data);
      } catch (err) {
        console.error("Failed to fetch bot performance", err);
      }
    };

    const fetchBots = async () => {
      try {
        const res = await fetch("http://localhost:8001/api/bots", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) setBots(data);
        else console.error("Bot data is not array:", data);
      } catch (err) {
        console.error("Failed to fetch bots", err);
      }
    };

    fetchPerformances();
    fetchBots();
  }, []);

  const filteredBots = bots
    .filter((b) => b.accuracy.daily >= minAccuracy)
    .sort((a, b) =>
      sortBy === "date"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : b.accuracy.daily - a.accuracy.daily
    );

  const accuracyChartData = {
    labels: performances?.map((p) =>
      new Date(p.generatedAt).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: "Accuracy (%)",
        data: performances?.map((p) => Math.round(p.accuracy * 100)) || [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  const totalBots = bots.length;
  const avgAccuracy =
    totalBots > 0
      ? Math.round(
          bots.reduce((sum, b) => sum + b.accuracy.daily, 0) / totalBots
        )
      : 0;

  const weeklyAvg =
    totalBots > 0
      ? Math.round(
          bots.reduce((sum, b) => sum + b.accuracy.weekly, 0) / totalBots
        )
      : 0;

  const monthlyAvg =
    totalBots > 0
      ? Math.round(
          bots.reduce((sum, b) => sum + b.accuracy.monthly, 0) / totalBots
        )
      : 0;

  return (
    <div className="space-y-6 px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Bots</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalBots}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Avg Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{weeklyAvg}%</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Avg Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{monthlyAvg}%</CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Bot Accuracy Over Time</h2>
        <Line data={accuracyChartData} />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <label className="text-sm mr-2">Filter by Min Accuracy:</label>
          <input
            type="number"
            value={minAccuracy}
            onChange={(e) => setMinAccuracy(Number(e.target.value))}
            className="border px-2 py-1 w-20 rounded"
          />
        </div>
        <div>
          <label className="text-sm mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border px-2 py-1 rounded"
          >
            <option value="date">Date</option>
            <option value="accuracy">Accuracy</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">Recent Bots</h2>
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Created At</th>
              <th className="text-left px-3 py-2">Daily Accuracy</th>
              <th className="text-left px-3 py-2">Weekly</th>
              <th className="text-left px-3 py-2">Monthly</th>
              <th className="text-left px-3 py-2">Win/Loss</th>
              <th className="text-left px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBots.map((bot) => (
              <tr key={bot.id} className="border-b hover:bg-gray-100">
                <td className="px-3 py-2">{bot.name}</td>
                <td className="px-3 py-2">
                  {new Date(bot.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">{bot.accuracy.daily}%</td>
                <td className="px-3 py-2">{bot.accuracy.weekly}%</td>
                <td className="px-3 py-2">{bot.accuracy.monthly}%</td>
                <td className="px-3 py-2">{bot.winLossRatio}</td>
                <td className="px-3 py-2 space-x-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="destructive">Retrain</Button>
                </td>
              </tr>
            ))}
            {filteredBots.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No bots found with accuracy ≥ {minAccuracy}%
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
