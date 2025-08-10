// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const categoryCards = [
//   { name: "Food", icon: "🍽️", color: "bg-rose-500" },
//   { name: "Travel", icon: "✈️", color: "bg-blue-500" },
//   { name: "Shopping", icon: "🛒", color: "bg-green-500" },
//   { name: "Utilities", icon: "⚡", color: "bg-yellow-500" },
//   { name: "Health", icon: "🏥", color: "bg-red-500" },
//   { name: "General", icon: "📦", color: "bg-gray-500" },
// ];

// export default function SummaryHeader({ expenses }) {
//   const [filter, setFilter] = useState("Month");
//   const now = new Date();

//   const isSameWeek = (date) => {
//     const inputDate = new Date(date);
//     const nowDate = new Date();
//     const oneJan = new Date(nowDate.getFullYear(), 0, 1);
//     const inputWeek = Math.ceil(
//       ((inputDate - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
//     );
//     const currentWeek = Math.ceil(
//       ((nowDate - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
//     );
//     return (
//       inputDate.getFullYear() === nowDate.getFullYear() &&
//       inputWeek === currentWeek
//     );
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
//           className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Week">This Week</option>
//           <option value="Month">This Month</option>
//           <option value="Year">This Year</option>
//         </select>
//       </div>

//       {/* Cards with animation */}
//       <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
//         <AnimatePresence mode="wait">
//           {cards.map((card) => (
//             <motion.div
//               key={card.name + filter}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4 hover:shadow-lg transition"
//             >
//               <div
//                 className={`text-white text-2xl rounded-full p-3 ${card.color}`}
//               >
//                 {card.icon}
//               </div>
//               <div>
//                 <h4 className="text-sm font-semibold text-gray-600">
//                   {card.name}
//                 </h4>
//                 <p className="text-lg font-bold text-gray-900">₹{card.value}</p>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function SummaryHeader({ expenses }) {
  const [filter, setFilter] = useState("Month");
  const now = new Date();

  const isSameWeek = (date) => {
    const d = new Date(date);
    const oneJan = new Date(d.getFullYear(), 0, 1);
    const inputWeek = Math.ceil(
      ((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
    );
    const currentWeek = Math.ceil(
      ((now - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
    );
    return d.getFullYear() === now.getFullYear() && inputWeek === currentWeek;
  };

  const isSameMonth = (date) => {
    const d = new Date(date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  };

  const isSameYear = (date) =>
    new Date(date).getFullYear() === now.getFullYear();

  const filteredExpenses = expenses.filter((e) => {
    if (!e.date) return false;
    if (filter === "Week") return isSameWeek(e.date);
    if (filter === "Month") return isSameMonth(e.date);
    if (filter === "Year") return isSameYear(e.date);
    return true;
  });

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
                  ₹{card.value}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
