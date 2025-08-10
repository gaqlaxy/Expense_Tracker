import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase"; // adjust the path if needed
import { useAuth } from "../context/AuthContext"; // custom hook to get current user

export default function BudgetGoal({ expenses }) {
  const { user } = useAuth(); // get current logged-in user
  const [budget, setBudget] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalThisMonth = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const remaining = Math.max(0, budget - totalThisMonth);
  const percent = budget ? Math.min(100, (totalThisMonth / budget) * 100) : 0;

  useEffect(() => {
    if (!user) return;

    const fetchBudget = async () => {
      try {
        const docRef = doc(db, "users", user.uid, "budget", "monthly");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const amount = docSnap.data().amount || 0;
          setBudget(amount);
          setInput(amount);
        } else {
          setBudget(0);
          // setInput("");
          setInput(amount.toString());
        }
      } catch (err) {
        console.error("Error fetching budget:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [user]);

  const saveBudget = async () => {
    const num = Number(input);
    if (!user || isNaN(num) || num < 0) return;

    try {
      const docRef = doc(db, "users", user.uid, "budget", "monthly");
      await setDoc(docRef, { amount: num });
      setBudget(num);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Loading budget...
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl shadow border mb-6 p-4 sm:p-6 ${
        budget === 0
          ? "bg-gradient-to-br from-white to-blue-50 border-blue-100 dark:from-gray-800 dark:to-blue-900 dark:border-blue-800"
          : "bg-gradient-to-br from-white to-green-50 border-green-100 dark:from-gray-800 dark:to-green-900 dark:border-green-800"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-900 dark:text-white">
            Monthly Budget
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg px-3 py-1.5 text-sm w-32 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Set budget"
            />
            <button
              onClick={saveBudget}
              className="text-xs sm:text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            >
              Save
            </button>
          </div>
          {saved && <span className="text-green-500 text-xs ml-2">Saved!</span>}
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold">Spent:</span>{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              ₹{totalThisMonth}
            </span>
          </div>
          <div className="text-gray-700 dark:text-gray-200">
            <span className="font-semibold">Remaining:</span>{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              ₹{remaining}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-700 rounded-full border border-gray-100 dark:border-gray-600 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            percent < 90
              ? "bg-blue-500"
              : percent < 100
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      {percent >= 90 && percent < 100 && (
        <div className="text-yellow-500 text-xs mt-1">
          Almost at your budget limit!
        </div>
      )}
      {percent >= 100 && (
        <div className="text-red-500 text-xs mt-1">
          You’ve exceeded your budget!
        </div>
      )}

      <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
        {percent.toFixed(1)}% used
      </div>
    </div>
  );
}
