import React from "react";

export default function WeeklyMonthlySummary({ expenses, isDark, budget }) {
  // --- Weekly calculations ---
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // Sunday as 7
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  function isInCurrentWeek(dateStr) {
    const d = new Date(dateStr);
    return d >= weekStart && d <= weekEnd;
  }

  const thisWeekExpenses = expenses.filter((e) => isInCurrentWeek(e.date));
  const totalThisWeek = thisWeekExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgThisWeek =
    thisWeekExpenses.length > 0
      ? totalThisWeek / new Set(thisWeekExpenses.map((e) => e.date)).size
      : 0;

  // --- Monthly calculations ---
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthExpenses = expenses.filter((e) =>
    e.date.startsWith(currentMonth)
  );
  const totalThisMonth = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const avgThisMonth =
    thisMonthExpenses.length > 0
      ? totalThisMonth / new Set(thisMonthExpenses.map((e) => e.date)).size
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
      {/* Weekly Summary */}
      <div
        className={`${
          isDark
            ? "bg-gradient-to-br from-gray-800 to-indigo-900 border-indigo-800"
            : "bg-gradient-to-br from-white to-indigo-50 border-indigo-100"
        } p-4 sm:p-6 rounded-xl shadow border`}
      >
        <h2
          className={`text-xs sm:text-sm ${
            isDark ? "text-gray-300" : "text-gray-500"
          } mb-2`}
        >
          This Week
        </h2>
        <p className="text-xl sm:text-2xl font-bold text-indigo-600">
          ₹{totalThisWeek}
        </p>
        <div className="text-xs sm:text-sm mt-2 text-gray-600 dark:text-gray-300">
          Avg: ₹{avgThisWeek.toFixed(2)}
          <br />
          Transactions: {thisWeekExpenses.length}
        </div>
      </div>
      {/* Monthly Summary */}
      <div
        className={`${
          isDark
            ? "bg-gradient-to-br from-gray-800 to-blue-900 border-blue-800"
            : "bg-gradient-to-br from-white to-blue-50 border-blue-100"
        } p-4 sm:p-6 rounded-xl shadow border`}
      >
        <h2
          className={`text-xs sm:text-sm ${
            isDark ? "text-gray-300" : "text-gray-500"
          } mb-2`}
        >
          This Month
        </h2>
        <p className="text-xl sm:text-2xl font-bold text-blue-600">
          ₹{totalThisMonth}
        </p>
        <div className="text-xs sm:text-sm mt-2 text-gray-600 dark:text-gray-300">
          Avg: ₹{avgThisMonth.toFixed(2)}
          <br />
          Transactions: {thisMonthExpenses.length}
          <br />
          {budget > 0 && (
            <span>
              Budget: ₹{budget}
              <br />
              <span
                className={
                  totalThisMonth > budget
                    ? "text-red-500 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                {totalThisMonth > budget ? "Over Budget" : "Within Budget"}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
