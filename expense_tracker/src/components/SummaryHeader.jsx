// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const categoryCards = [
//   { name: "Food", icon: "🍽️" },
//   { name: "Travel", icon: "✈️" },
//   { name: "Shopping", icon: "🛒" },
//   { name: "Utilities", icon: "⚡" },
//   { name: "Health", icon: "🏥" },
//   { name: "General", icon: "📦" },
// ];

// const categoryColors = {
//   Food: "#34D399",
//   Travel: "#3B82F6",
//   Shopping: "#EC4899",
//   Utilities: "#F59E0B",
//   Health: "#EF4444",
//   General: "#9CA3AF",
// };

// export default function SummaryHeader({ expenses }) {
//   const [filter, setFilter] = useState("Month");
//   const now = new Date();

//   const isSameWeek = (date) => {
//     const d = new Date(date);
//     const oneJan = new Date(d.getFullYear(), 0, 1);
//     const inputWeek = Math.ceil(
//       ((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
//     );
//     const currentWeek = Math.ceil(
//       ((now - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
//     );
//     return d.getFullYear() === now.getFullYear() && inputWeek === currentWeek;
//   };

//   const isSameMonth = (date) => {
//     const d = new Date(date);
//     return (
//       d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
//     );
//   };

//   const isSameYear = (date) =>
//     new Date(date).getFullYear() === now.getFullYear();

//   const filteredExpenses = expenses.filter((e) => {
//     if (!e.date) return false;
//     if (filter === "Week") return isSameWeek(e.date);
//     if (filter === "Month") return isSameMonth(e.date);
//     if (filter === "Year") return isSameYear(e.date);
//     return true;
//   });

//   const getCategoryTotal = (category) =>
//     filteredExpenses
//       .filter((e) => e.category === category)
//       .reduce((sum, e) => sum + Number(e.amount || 0), 0);

//   const cards = categoryCards.map((item) => ({
//     ...item,
//     value: getCategoryTotal(item.name),
//   }));

//   return (
//     <div className="my-6">
//       {/* Filter */}
//       <div className="flex justify-end mb-4">
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm
//                      focus:outline-none focus:ring-2 focus:ring-blue-400
//                      bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
//         >
//           <option value="Week">This Week</option>
//           <option value="Month">This Month</option>
//           <option value="Year">This Year</option>
//         </select>
//       </div>

//       {/* Cards */}
//       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
//         <AnimatePresence mode="wait">
//           {cards.map((card) => (
//             <motion.div
//               key={card.name + filter}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 10 }}
//               transition={{ duration: 0.2 }}
//               className="relative bg-gray-50 dark:bg-gray-900
//                          border border-gray-200 dark:border-gray-700
//                          rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition"
//             >
//               {/* Left color bar */}
//               <div
//                 className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
//                 style={{ backgroundColor: categoryColors[card.name] }}
//               ></div>

//               {/* Icon */}
//               <div
//                 className="text-2xl flex items-center justify-center h-10 w-10 rounded-full"
//                 style={{ backgroundColor: categoryColors[card.name] + "33" }}
//               >
//                 {card.icon}
//               </div>

//               {/* Text */}
//               <div>
//                 <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                   {card.name}
//                 </h4>
//                 <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
//                   ₹{card.value}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// use the same helpers you already have
import {
  getWeekRange,
  getMonthRange,
  filterExpensesByDateRange,
  calculateTotal,
} from "../utils/summaryHelpers";

const categoryCards = [
  { name: "Food", icon: "🍽️" },
  { name: "Travel", icon: "✈️" },
  { name: "Shopping", icon: "🛒" },
  { name: "Utilities", icon: "⚡" },
  { name: "Health", icon: "🏥" },
  { name: "General", icon: "📦" },
];

const categoryColors = {
  Food: "#34D399",
  Travel: "#3B82F6",
  Shopping: "#EC4899",
  Utilities: "#F59E0B",
  Health: "#EF4444",
  General: "#9CA3AF",
};

export default function SummaryHeader({ expenses = [] }) {
  const [filter, setFilter] = useState("Month");
  const now = new Date();

  // Normalize an expense date to a JS Date (handles Firestore Timestamp, Date, ISO string)
  const normalizeDate = (d) => {
    if (!d) return null;
    if (d instanceof Date) return d;
    if (typeof d === "object" && typeof d.toDate === "function")
      return d.toDate(); // firestore Timestamp
    return new Date(d);
  };

  // Make a normalized copy of expenses to avoid repeated parsing & to keep helpers happy
  const normalizedExpenses = useMemo(
    () =>
      expenses.map((e) => ({
        ...e,
        _parsedDate: normalizeDate(e.date), // keep original e.date untouched
      })),
    [expenses]
  );

  // Use helpers for Week / Month ranges so logic matches SummaryCards
  let filteredExpenses = [];
  if (filter === "Week") {
    const [weekStart, weekEnd] = getWeekRange(); // expect these to be JS Dates or ISO strings as per your helper
    filteredExpenses = filterExpensesByDateRange(
      normalizedExpenses,
      weekStart,
      weekEnd
    );
  } else if (filter === "Month") {
    const [monthStart, monthEnd] = getMonthRange();
    filteredExpenses = filterExpensesByDateRange(
      normalizedExpenses,
      monthStart,
      monthEnd
    );
  } else if (filter === "Year") {
    filteredExpenses = normalizedExpenses.filter((e) => {
      const d = e._parsedDate;
      return d && d.getFullYear() === now.getFullYear();
    });
  } else {
    filteredExpenses = normalizedExpenses;
  }

  // totals
  const totalSpent = calculateTotal(filteredExpenses);
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
      {/* Filter */}
      <div className="flex justify-end mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        >
          <option value="Week">This Week</option>
          <option value="Month">This Month</option>
          <option value="Year">This Year</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <AnimatePresence mode="wait">
          {/* Total Spend Card (full width) */}

          {/* Category Cards */}
          {cards.map((card) => (
            <motion.div
              key={card.name + filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-gray-50 dark:bg-gray-900 
                         border border-gray-200 dark:border-gray-700 
                         rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition"
            >
              {/* Left color bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                style={{ backgroundColor: categoryColors[card.name] }}
              ></div>

              {/* Icon */}
              <div
                className="text-2xl flex items-center justify-center h-10 w-10 rounded-full"
                style={{ backgroundColor: categoryColors[card.name] + "33" }}
              >
                {card.icon}
              </div>

              {/* Text */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {card.name}
                </h4>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ₹{card.value.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
