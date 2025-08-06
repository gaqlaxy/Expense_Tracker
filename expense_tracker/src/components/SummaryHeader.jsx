// import React, { useState, useMemo } from "react";
// import dayjs from "dayjs";

// const categoryCards = [
//   { name: "Food", icon: "🍽️", color: "bg-rose-500" },
//   { name: "Travel", icon: "✈️", color: "bg-blue-500" },
//   { name: "Shopping", icon: "🛒", color: "bg-green-500" },
//   { name: "Utilities", icon: "⚡", color: "bg-yellow-500" },
//   { name: "Health", icon: "🏥", color: "bg-red-500" },
//   { name: "General", icon: "📦", color: "bg-gray-500" },
// ];

// const FILTERS = ["Week", "Month", "Year"];

// export default function SummaryHeader({ expenses }) {
//   const [filter, setFilter] = useState("Month");

//   const filteredExpenses = useMemo(() => {
//     const now = dayjs();
//     return expenses.filter((e) => {
//       const date = dayjs(e.date);
//       if (filter === "Week") return date.isAfter(now.subtract(7, "day"));
//       if (filter === "Month") return date.isAfter(now.subtract(1, "month"));
//       if (filter === "Year") return date.isAfter(now.subtract(1, "year"));
//       return true;
//     });
//   }, [expenses, filter]);

//   const getCategoryTotal = (category) =>
//     filteredExpenses
//       .filter((e) => e.category === category)
//       .reduce((sum, e) => sum + Number(e.amount), 0);

//   // const cards = categoryCards.map((item) => ({
//   //   ...item,
//   //   value: getCategoryTotal(item.name),
//   // }));
//   const cards = categoryCards.map((item) => ({
//     ...item,
//     value: filteredExpenses
//       .filter((e) => e.category === item.name)
//       .reduce((sum, e) => sum + Number(e.amount), 0),
//   }));

//   console.log("All Expenses", expenses);
//   console.log("Filtered Expenses", filteredExpenses);

//   return (
//     <div className="my-6">
//       {/* Dropdown Filter */}
//       <div className="mb-4 flex justify-end">
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border px-3 py-1 rounded-md text-sm bg-white shadow-sm"
//         >
//           {FILTERS.map((f) => (
//             <option key={f} value={f}>
//               {f}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
//         {cards.map((card, i) => (
//           <div
//             key={i}
//             className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4 hover:shadow-lg transition"
//           >
//             <div
//               className={`text-white text-2xl rounded-full p-3 ${card.color}`}
//             >
//               {card.icon}
//             </div>
//             <div>
//               <h4 className="text-sm font-semibold text-gray-600">
//                 {card.name}
//               </h4>
//               <p className="text-lg font-bold text-gray-900">₹{card.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";

// You can also move this to a separate config file if needed
const categoryCards = [
  { name: "Food", icon: "🍽️", color: "bg-rose-500" },
  { name: "Travel", icon: "✈️", color: "bg-blue-500" },
  { name: "Shopping", icon: "🛒", color: "bg-green-500" },
  { name: "Utilities", icon: "⚡", color: "bg-yellow-500" },
  { name: "Health", icon: "🏥", color: "bg-red-500" },
  { name: "General", icon: "📦", color: "bg-gray-500" },
];

export default function SummaryHeader({ expenses }) {
  const [filter, setFilter] = useState("Month");

  const now = new Date();

  const isSameWeek = (date) => {
    const inputDate = new Date(date);
    const nowDate = new Date();
    const oneJan = new Date(nowDate.getFullYear(), 0, 1);
    const inputWeek = Math.ceil(
      ((inputDate - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
    );
    const currentWeek = Math.ceil(
      ((nowDate - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
    );
    return (
      inputDate.getFullYear() === nowDate.getFullYear() &&
      inputWeek === currentWeek
    );
  };

  const isSameMonth = (date) => {
    const d = new Date(date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  };

  const isSameYear = (date) => {
    return new Date(date).getFullYear() === now.getFullYear();
  };

  // Filter logic
  const filteredExpenses = expenses.filter((e) => {
    if (!e.date) return false;
    if (filter === "Week") return isSameWeek(e.date);
    if (filter === "Month") return isSameMonth(e.date);
    if (filter === "Year") return isSameYear(e.date);
    return true;
  });

  // Compute totals per category from filtered expenses
  const getCategoryTotal = (category) =>
    filteredExpenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const cards = categoryCards.map((item) => ({
    ...item,
    value: getCategoryTotal(item.name),
  }));

  return (
    <div className="my-6">
      {/* Filter Dropdown */}
      <div className="flex justify-end mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Week">This Week</option>
          <option value="Month">This Month</option>
          <option value="Year">This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4 hover:shadow-lg transition"
          >
            <div
              className={`text-white text-2xl rounded-full p-3 ${card.color}`}
            >
              {card.icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600">
                {card.name}
              </h4>
              <p className="text-lg font-bold text-gray-900">₹{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
