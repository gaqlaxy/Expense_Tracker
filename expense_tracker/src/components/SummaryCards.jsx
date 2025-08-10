// import React from "react";
// import { motion } from "framer-motion";
// import { FiCalendar, FiTrendingUp, FiList, FiBarChart2 } from "react-icons/fi";
// import {
//   getWeekRange,
//   getMonthRange,
//   filterExpensesByDateRange,
//   calculateTotal,
// } from "../utils/summaryHelpers";

// export default function SummaryCards({ expenses, isDark }) {
//   // --- This Month ---
//   const [monthStart, monthEnd] = getMonthRange();
//   const thisMonthExpenses = filterExpensesByDateRange(
//     expenses,
//     monthStart,
//     monthEnd
//   );
//   const totalThisMonth = calculateTotal(thisMonthExpenses);

//   // --- Avg Daily Spend ---
//   const daysElapsed = (monthEnd - monthStart) / (1000 * 60 * 60 * 24) + 1;
//   const averageDailySpend = totalThisMonth / daysElapsed;

//   // --- Transactions (All time + This Week) ---
//   const totalTransactions = expenses.length;
//   const [weekStart, weekEnd] = getWeekRange();
//   const thisWeekTransactions = filterExpensesByDateRange(
//     expenses,
//     weekStart,
//     weekEnd
//   ).length;

//   // --- Yearly Spend ---
//   const thisYear = new Date().getFullYear();
//   const totalThisYear = calculateTotal(
//     expenses.filter((e) => new Date(e.date).getFullYear() === thisYear)
//   );

//   const statVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.1 },
//     }),
//   };

//   const stats = [
//     {
//       title: "This Month",
//       value: `₹${totalThisMonth}`,
//       icon: <FiCalendar size={20} />,
//       light: "from-white to-blue-50 border-blue-100",
//       dark: "from-gray-800 to-blue-900 border-blue-800",
//       iconBg: "bg-blue-100 dark:bg-blue-800",
//       iconText: "text-blue-600 dark:text-blue-300",
//       valueText: "text-blue-600 dark:text-blue-300",
//     },
//     {
//       title: "Avg Daily Spend",
//       value: `₹${averageDailySpend.toFixed(2)}`,
//       icon: <FiTrendingUp size={20} />,
//       light: "from-white to-green-50 border-green-100",
//       dark: "from-gray-800 to-green-900 border-green-800",
//       iconBg: "bg-green-100 dark:bg-green-800",
//       iconText: "text-green-600 dark:text-green-300",
//       valueText: "text-green-600 dark:text-green-300",
//     },
//     {
//       title: "Transactions",
//       value: `${totalTransactions} total (${thisWeekTransactions} this week)`,
//       icon: <FiList size={20} />,
//       light: "from-white to-yellow-50 border-yellow-100",
//       dark: "from-gray-800 to-yellow-900 border-yellow-800",
//       iconBg: "bg-yellow-100 dark:bg-yellow-800",
//       iconText: "text-yellow-600 dark:text-yellow-300",
//       valueText: "text-yellow-600 dark:text-yellow-300",
//     },
//     {
//       title: "Yearly Spend",
//       value: `₹${totalThisYear}`,
//       icon: <FiBarChart2 size={20} />,
//       light: "from-white to-purple-50 border-purple-100",
//       dark: "from-gray-800 to-purple-900 border-purple-800",
//       iconBg: "bg-purple-100 dark:bg-purple-800",
//       iconText: "text-purple-600 dark:text-purple-300",
//       valueText: "text-purple-600 dark:text-purple-300",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
//       {stats.map((stat, i) => (
//         <motion.div
//           key={stat.title}
//           custom={i}
//           initial="hidden"
//           animate="visible"
//           variants={statVariants}
//           className={`flex items-center p-4 sm:p-6 rounded-xl shadow border hover:shadow-lg transition bg-gradient-to-br ${
//             isDark ? stat.dark : stat.light
//           }`}
//         >
//           <div
//             className={`p-3 rounded-full ${stat.iconBg} ${stat.iconText} mr-4`}
//           >
//             {stat.icon}
//           </div>
//           <div>
//             <h2
//               className={`text-xs sm:text-sm ${
//                 isDark ? "text-gray-300" : "text-gray-500"
//               }`}
//             >
//               {stat.title}
//             </h2>
//             <p className={`text-lg sm:text-xl font-bold ${stat.valueText}`}>
//               {stat.value}
//             </p>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }

import React from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiTrendingUp,
  FiList,
  FiBarChart2,
  FiEdit,
} from "react-icons/fi";
import {
  getWeekRange,
  getMonthRange,
  filterExpensesByDateRange,
  calculateTotal,
} from "../utils/summaryHelpers";

export default function SummaryCards({
  expenses,
  income,
  isDark,
  onEditIncome,
}) {
  // --- This Month ---
  const [monthStart, monthEnd] = getMonthRange();
  const thisMonthExpenses = filterExpensesByDateRange(
    expenses,
    monthStart,
    monthEnd
  );
  const totalThisMonth = calculateTotal(thisMonthExpenses);

  // --- Avg Daily Spend ---
  const daysElapsed = (monthEnd - monthStart) / (1000 * 60 * 60 * 24) + 1;
  const averageDailySpend = totalThisMonth / daysElapsed;

  // --- Transactions ---
  const totalTransactions = expenses.length;
  const [weekStart, weekEnd] = getWeekRange();
  const thisWeekTransactions = filterExpensesByDateRange(
    expenses,
    weekStart,
    weekEnd
  ).length;

  // --- Yearly Spend ---
  const thisYear = new Date().getFullYear();
  const totalThisYear = calculateTotal(
    expenses.filter((e) => new Date(e.date).getFullYear() === thisYear)
  );

  // --- Income Total ---
  const totalIncome = income ? Number(income.amount) : 0;

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  const stats = [
    {
      title: "Income",
      value: `₹${totalIncome}`,
      icon: <FiCalendar size={20} />,
      light: "from-white to-green-50 border-green-100",
      dark: "from-gray-800 to-green-900 border-green-800",
      iconBg: "bg-green-100 dark:bg-green-800",
      iconText: "text-green-600 dark:text-green-300",
      valueText: "text-green-600 dark:text-green-300",
      isIncome: true, // mark income card
    },
    {
      title: "This Month",
      value: `₹${totalThisMonth}`,
      icon: <FiCalendar size={20} />,
      light: "from-white to-blue-50 border-blue-100",
      dark: "from-gray-800 to-blue-900 border-blue-800",
      iconBg: "bg-blue-100 dark:bg-blue-800",
      iconText: "text-blue-600 dark:text-blue-300",
      valueText: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "Avg Daily Spend",
      value: `₹${averageDailySpend.toFixed(2)}`,
      icon: <FiTrendingUp size={20} />,
      light: "from-white to-yellow-50 border-yellow-100",
      dark: "from-gray-800 to-yellow-900 border-yellow-800",
      iconBg: "bg-yellow-100 dark:bg-yellow-800",
      iconText: "text-yellow-600 dark:text-yellow-300",
      valueText: "text-yellow-600 dark:text-yellow-300",
    },
    {
      title: "Transactions",
      value: `${totalTransactions} total (${thisWeekTransactions} this week)`,
      icon: <FiList size={20} />,
      light: "from-white to-pink-50 border-pink-100",
      dark: "from-gray-800 to-pink-900 border-pink-800",
      iconBg: "bg-pink-100 dark:bg-pink-800",
      iconText: "text-pink-600 dark:text-pink-300",
      valueText: "text-pink-600 dark:text-pink-300",
    },
    {
      title: "Yearly Spend",
      value: `₹${totalThisYear}`,
      icon: <FiBarChart2 size={20} />,
      light: "from-white to-purple-50 border-purple-100",
      dark: "from-gray-800 to-purple-900 border-purple-800",
      iconBg: "bg-purple-100 dark:bg-purple-800",
      iconText: "text-purple-600 dark:text-purple-300",
      valueText: "text-purple-600 dark:text-purple-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={statVariants}
          className={`flex items-center p-4 sm:p-6 rounded-xl shadow border hover:shadow-lg transition bg-gradient-to-br ${
            isDark ? stat.dark : stat.light
          }`}
        >
          <div
            className={`p-3 rounded-full ${stat.iconBg} ${stat.iconText} mr-4 flex items-center justify-center`}
          >
            {stat.icon}
          </div>
          <div className="flex-1">
            <h2
              className={`text-xs sm:text-sm ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {stat.title}
            </h2>
            <p className={`text-lg sm:text-xl font-bold ${stat.valueText}`}>
              {stat.value}
            </p>
          </div>

          {/* Show edit button ONLY on income card */}
          {stat.isIncome && (
            <button
              onClick={onEditIncome}
              title="Edit Income"
              className="ml-3 p-1 rounded hover:bg-green-200 dark:hover:bg-green-700 transition"
            >
              <FiEdit
                size={18}
                className={isDark ? "text-green-300" : "text-green-700"}
              />
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
