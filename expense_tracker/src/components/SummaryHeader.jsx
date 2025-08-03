// components/SummaryHeader.jsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const categoryCards = [
  { name: "This Month", value: 0, icon: "📅", color: "bg-blue-500" },
  { name: "Food", value: 0, icon: "🍽️", color: "bg-rose-500" },
  { name: "Transport", value: 0, icon: "🚗", color: "bg-yellow-500" },
  { name: "Shopping", value: 0, icon: "🛒", color: "bg-green-500" },
  { name: "Others", value: 0, icon: "📦", color: "bg-gray-500" },
];

export default function SummaryHeader({ expenses }) {
  const getCategoryTotal = (category) =>
    expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalThisMonth = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const cards = categoryCards.map((item) => ({
    ...item,
    value:
      item.name === "This Month" ? totalThisMonth : getCategoryTotal(item.name),
  }));

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 my-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4 hover:shadow-lg transition"
        >
          <div className={`text-white text-2xl rounded-full p-3 ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-600">{card.name}</h4>
            <p className="text-lg font-bold text-gray-900">₹{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
