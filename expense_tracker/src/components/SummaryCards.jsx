import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import {
  getWeekRange,
  getMonthRange,
  filterExpensesByDateRange,
  calculateTotal,
} from "../utils/summaryHelpers";

export default function SummaryCards({ expenses }) {
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [weeklyPopup, setWeeklyPopup] = useState("");
  const [monthlyPopup, setMonthlyPopup] = useState("");

  useEffect(() => {
    if (!expenses || expenses.length === 0) return;

    // Weekly comparison
    const [thisWeekStart, thisWeekEnd] = getWeekRange(new Date());
    const [lastWeekStart, lastWeekEnd] = getWeekRange(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const thisWeekExpenses = filterExpensesByDateRange(
      expenses,
      thisWeekStart,
      thisWeekEnd
    );
    const lastWeekExpenses = filterExpensesByDateRange(
      expenses,
      lastWeekStart,
      lastWeekEnd
    );

    const thisWeekTotal = calculateTotal(thisWeekExpenses);
    const lastWeekTotal = calculateTotal(lastWeekExpenses);

    const weeklyChange =
      lastWeekTotal === 0
        ? 100
        : (((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1);

    setWeeklySummary({ thisWeekTotal, lastWeekTotal, weeklyChange });

    if (weeklyChange > 0) {
      setWeeklyPopup(
        `You've spent ${weeklyChange}% more this week than last week.`
      );
    } else if (weeklyChange < 0) {
      setWeeklyPopup(
        `Good job! You've spent ${Math.abs(weeklyChange)}% less this week.`
      );
    }

    // Monthly comparison
    const [thisMonthStart, thisMonthEnd] = getMonthRange(new Date());
    const [lastMonthStart, lastMonthEnd] = getMonthRange(
      new Date(new Date().setMonth(new Date().getMonth() - 1))
    );

    const thisMonthExpenses = filterExpensesByDateRange(
      expenses,
      thisMonthStart,
      thisMonthEnd
    );
    const lastMonthExpenses = filterExpensesByDateRange(
      expenses,
      lastMonthStart,
      lastMonthEnd
    );

    const thisMonthTotal = calculateTotal(thisMonthExpenses);
    const lastMonthTotal = calculateTotal(lastMonthExpenses);

    const monthlyChange =
      lastMonthTotal === 0
        ? 100
        : (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(
            1
          );

    setMonthlySummary({ thisMonthTotal, lastMonthTotal, monthlyChange });

    if (monthlyChange > 0) {
      setMonthlyPopup(
        `You've spent ${monthlyChange}% more this month than last month.`
      );
    } else if (monthlyChange < 0) {
      setMonthlyPopup(
        `Nice! You've saved ${Math.abs(monthlyChange)}% compared to last month.`
      );
    }
  }, [expenses]);

  if (!weeklySummary || !monthlySummary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Weekly Card */}

      {weeklySummary && (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">This Week's Spending</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹{weeklySummary.thisWeekTotal}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last Week: ₹{weeklySummary.lastWeekTotal}
          </p>

          {/* Visual Comparison */}
          <div className="flex items-center gap-2 mt-3">
            {weeklySummary.weeklyChange >= 0 ? (
              <FaArrowUp className="text-red-500" />
            ) : (
              <FaArrowDown className="text-green-500" />
            )}
            <span
              className={`text-sm font-medium ${
                weeklySummary.weeklyChange >= 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {Math.abs(weeklySummary.weeklyChange)}%{" "}
              {weeklySummary.weeklyChange >= 0 ? "increase" : "decrease"}
            </span>
          </div>

          {/* Popup message */}
          {weeklyPopup && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
              {weeklyPopup}
            </div>
          )}
        </div>
      )}

      {/* Monthly Card */}

      {monthlySummary && (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">This Month's Spending</h3>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ₹{monthlySummary.thisMonthTotal}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last Month: ₹{monthlySummary.lastMonthTotal}
          </p>

          {/* Visual Comparison */}
          <div className="flex items-center gap-2 mt-3">
            {monthlySummary.monthlyChange >= 0 ? (
              <FaArrowUp className="text-red-500" />
            ) : (
              <FaArrowDown className="text-green-500" />
            )}
            <span
              className={`text-sm font-medium ${
                monthlySummary.monthlyChange >= 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {Math.abs(monthlySummary.monthlyChange)}%{" "}
              {monthlySummary.monthlyChange >= 0 ? "increase" : "decrease"}
            </span>
          </div>

          {/* Popup message */}
          {monthlyPopup && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
              {monthlyPopup}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
