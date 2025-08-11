// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";
// import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// const COLORS = [
//   "#34D399",
//   "#3B82F6",
//   "#EC4899",
//   "#F59E0B",
//   "#EF4444",
//   "#9CA3AF",
// ];

// export default function Analytics({ expenses }) {
//   const now = new Date();

//   // --- Daily Spending (last 7 days) ---
//   const last7Days = [...Array(7)].map((_, i) => {
//     const date = new Date();
//     date.setDate(now.getDate() - (6 - i));
//     const total = expenses
//       .filter((e) => new Date(e.date).toDateString() === date.toDateString())
//       .reduce((sum, e) => sum + Number(e.amount || 0), 0);
//     return {
//       day: date.toLocaleDateString("en-US", { weekday: "short" }),
//       total,
//     };
//   });

//   // --- Top 3 categories this month ---
//   const thisMonthExpenses = expenses.filter(
//     (e) =>
//       new Date(e.date).getMonth() === now.getMonth() &&
//       new Date(e.date).getFullYear() === now.getFullYear()
//   );
//   const categoryTotals = {};
//   thisMonthExpenses.forEach((e) => {
//     categoryTotals[e.category] =
//       (categoryTotals[e.category] || 0) + Number(e.amount || 0);
//   });
//   const top3 = Object.entries(categoryTotals)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 3)
//     .map(([name, value]) => ({ name, value }));

//   // --- Month vs Last Month ---
//   const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//   const thisMonthTotal = thisMonthExpenses.reduce(
//     (sum, e) => sum + Number(e.amount || 0),
//     0
//   );
//   const lastMonthTotal = expenses
//     .filter(
//       (e) =>
//         new Date(e.date).getMonth() === lastMonth.getMonth() &&
//         new Date(e.date).getFullYear() === lastMonth.getFullYear()
//     )
//     .reduce((sum, e) => sum + Number(e.amount || 0), 0);

//   const difference = thisMonthTotal - lastMonthTotal;
//   const percentageChange =
//     lastMonthTotal > 0 ? ((difference / lastMonthTotal) * 100).toFixed(1) : 0;

//   return (
//     <div className="p-6 space-y-8">
//       <h1 className="text-3xl font-bold">📊 Analytics & Insights</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Daily Trend */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
//           <h2 className="text-lg font-semibold mb-4">
//             Daily Spending (Last 7 Days)
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={last7Days}>
//               <defs>
//                 <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
//                   <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="total"
//                 stroke="url(#lineGradient)"
//                 strokeWidth={3}
//                 dot={{ r: 5 }}
//                 activeDot={{ r: 8 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Top 3 Categories */}
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
//           <h2 className="text-lg font-semibold mb-4">
//             Top 3 Categories (This Month)
//           </h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={top3}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 label
//               >
//                 {top3.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* This Month vs Last Month */}
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
//         <h2 className="text-lg font-semibold mb-4">This Month vs Last Month</h2>
//         <div className="text-gray-700 dark:text-gray-300 text-lg">
//           <p>
//             This Month:{" "}
//             <span className="font-bold">₹{thisMonthTotal.toFixed(2)}</span>
//           </p>
//           <p>
//             Last Month:{" "}
//             <span className="font-bold">₹{lastMonthTotal.toFixed(2)}</span>
//           </p>
//           <p className="flex items-center gap-2 mt-2">
//             Difference:{" "}
//             <span
//               className={`font-bold flex items-center gap-1 ${
//                 difference > 0 ? "text-red-500" : "text-green-500"
//               }`}
//             >
//               {difference > 0 ? (
//                 <ArrowUpRight size={18} />
//               ) : (
//                 <ArrowDownRight size={18} />
//               )}
//               ₹{difference.toFixed(2)} ({percentageChange}%)
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#34D399",
  "#3B82F6",
  "#EC4899",
  "#F59E0B",
  "#EF4444",
  "#9CA3AF",
];

export default function Analytics({ expenses }) {
  const now = new Date();

  // --- Daily Spending (last 7 days) ---
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(now.getDate() - (6 - i));
    const total = expenses
      .filter((e) => new Date(e.date).toDateString() === date.toDateString())
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      total,
    };
  });
  const hasDailyData = last7Days.some((d) => d.total > 0);

  // --- Top 3 categories this month ---
  const thisMonthExpenses = expenses.filter(
    (e) =>
      new Date(e.date).getMonth() === now.getMonth() &&
      new Date(e.date).getFullYear() === now.getFullYear()
  );
  const categoryTotals = {};
  thisMonthExpenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + Number(e.amount || 0);
  });
  const top3 = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, value]) => ({ name, value }));
  const hasCategoryData = top3.length > 0;

  // --- Month vs Last Month ---
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonthTotal = thisMonthExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );
  const lastMonthTotal = expenses
    .filter(
      (e) =>
        new Date(e.date).getMonth() === lastMonth.getMonth() &&
        new Date(e.date).getFullYear() === lastMonth.getFullYear()
    )
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const hasLastMonthData = lastMonthTotal > 0;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Analytics & Insights</h1>

      {/* Daily Trend */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Daily Spending (Last 7 Days)
        </h2>
        {hasDailyData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 italic">
            No spending data for the last 7 days.
          </p>
        )}
      </div>

      {/* Top 3 Categories */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Top 3 Categories (This Month)
        </h2>
        {hasCategoryData ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={top3}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {top3.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 italic">
            No category data for this month.
          </p>
        )}
      </div>

      {/* This Month vs Last Month */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">This Month vs Last Month</h2>
        {hasLastMonthData ? (
          <p className="text-gray-700 dark:text-gray-300">
            This Month: ₹{thisMonthTotal.toFixed(2)} <br />
            Last Month: ₹{lastMonthTotal.toFixed(2)} <br />
            Difference:{" "}
            <span
              className={
                thisMonthTotal > lastMonthTotal
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              ₹{(thisMonthTotal - lastMonthTotal).toFixed(2)}
            </span>
          </p>
        ) : (
          <p className="text-gray-500 italic">No data for last month yet.</p>
        )}
      </div>
    </div>
  );
}
