"use client";
import React, { useEffect, useState } from "react";

interface Bot {
  id: string;
  name: string;
  accuracy: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  winLossRatio: string;
  createdAt: string;
}

export default function RecentBotsTable({ token }: { token: string }) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [minAccuracy, setMinAccuracy] = useState(0);
  const [sortField, setSortField] = useState<"daily" | "weekly" | "monthly" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const res = await fetch("http://localhost:8001/api/bots", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch bots");
        const data = await res.json();
        setBots(data);
      } catch (err) {
        console.error("Bot fetch error:", err);
      }
    };

    if (token) fetchBots();
  }, [token]);

  const filteredBots = bots
    .filter((bot) => (bot.accuracy?.daily ?? 0) >= minAccuracy)
    .sort((a, b) => {
      if (sortField === "date") {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      } else {
        const aVal = a.accuracy?.[sortField] ?? 0;
        const bVal = b.accuracy?.[sortField] ?? 0;
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
    });

  const toggleSort = (field: "daily" | "weekly" | "monthly" | "date") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="mt-10 bg-white shadow rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">🤖 Recent Bots</h3>
        <div className="flex items-center space-x-4">
          <label className="text-sm">Min Accuracy:</label>
          <input
            type="number"
            value={minAccuracy}
            onChange={(e) => setMinAccuracy(Number(e.target.value))}
            min={0}
            max={100}
            className="border px-2 py-1 rounded text-sm w-16"
          />
        </div>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort("date")}>Bot Name</th>
            <th className="px-6 py-3 cursor-pointer text-green-600" onClick={() => toggleSort("daily")}>Daily</th>
            <th className="px-6 py-3 cursor-pointer text-blue-600" onClick={() => toggleSort("weekly")}>Weekly</th>
            <th className="px-6 py-3 cursor-pointer text-indigo-600" onClick={() => toggleSort("monthly")}>Monthly</th>
            <th className="px-6 py-3">Win/Loss</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBots.map((bot) => (
            <tr key={bot.id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-3">{bot.name}</td>
              <td className="px-6 py-3 font-bold text-green-600">{bot.accuracy?.daily ?? "—"}%</td>
              <td className="px-6 py-3 font-bold text-blue-600">{bot.accuracy?.weekly ?? "—"}%</td>
              <td className="px-6 py-3 font-bold text-indigo-600">{bot.accuracy?.monthly ?? "—"}%</td>
              <td className="px-6 py-3">{bot.winLossRatio ?? "—"}</td>
              <td className="px-6 py-3 space-x-2 text-sm">
                <button className="text-blue-500 hover:underline">View</button>
                <button className="text-yellow-500 hover:underline">Edit Config</button>
                <button className="text-purple-500 hover:underline">Retrain</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
