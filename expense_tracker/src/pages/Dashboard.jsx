import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SummaryHeader from "../components/SummaryHeader";
import AddExpenseModal from "../components/AddExpenseModal";
import AddIncome from "../components/AddIncome";
import SummaryCards from "../components/SummaryCards";
import ExpenseItem from "../components/ExpenseItem";
// import { isSameWeek, isSameMonth, isSameYear } from "date-fns";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  CardSkeleton,
  ExpenseItemSkeleton,
  ChartSkeleton,
} from "../components/SkeletonLoader";
import { FiPlus, FiLogOut, FiCalendar, FiMoon, FiSun } from "react-icons/fi";

import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import { FiTrash, FiEdit } from "react-icons/fi";
import BudgetGoal from "../components/BudgetGoal";
import { FiTrendingUp, FiList, FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";

const categoryStyles = {
  Food: "bg-green-100 text-green-800",
  Travel: "bg-blue-100 text-blue-800",
  Shopping: "bg-pink-100 text-pink-800",
  Utilities: "bg-yellow-100 text-yellow-800",
  Health: "bg-red-100 text-red-800",
  General: "bg-gray-100 text-gray-800",
};

const COLORS = [
  "#34D399",
  "#3B82F6",
  "#EC4899",
  "#F59E0B",
  "#EF4444",
  "#9CA3AF",
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [toast, setToast] = useState(null);
  const [existingExpense, setExistingExpense] = useState(null);

  const [showAddIncome, setShowAddIncome] = useState(false);
  const [userId, setUserId] = useState(null);
  const [income, setIncome] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // Now you can fetch income for this user
        const incomeQuery = query(
          collection(db, "income"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(incomeQuery);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setIncome({ id: docData.id, ...docData.data() });
        } else {
          setIncome(null);
        }
      } else {
        setUserId(null);
        setIncome(null);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    async function fetchIncome() {
      try {
        // Remove userId filtering for now, or define userId properly as above
        const q = query(collection(db, "income"));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setIncome({ id: docData.id, ...docData.data() });
        }
      } catch (error) {
        console.error("Failed to fetch income", error);
      }
    }
    fetchIncome();
  }, []);

  const handleSaveIncome = async (newIncomeData) => {
    try {
      if (income) {
        // update existing
        const incomeRef = doc(db, "income", income.id);
        await updateDoc(incomeRef, newIncomeData);
        setIncome({ ...income, ...newIncomeData });
      } else {
        // add new
        const docRef = await addDoc(collection(db, "income"), {
          ...newIncomeData,
          userId, // if multi-user app
        });
        setIncome({ id: docRef.id, ...newIncomeData });
      }
      setShowAddIncome(false);
    } catch (error) {
      console.error("Error saving income:", error);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      showToast("Failed to logout. Please try again.", "error");
    }
  };

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };
  const addExpense = async (expenseData, editId = null) => {
    try {
      // Normalize payload
      const payload = {
        ...expenseData,
        uid: user.uid,
        date: expenseData.date || new Date().toISOString().split("T")[0],
        amount: Number(expenseData.amount || 0),
        category: expenseData.category || "General",
        note: expenseData.note || "",
        title: expenseData.title || "",
      };

      if (editId) {
        // UPDATE
        await updateDoc(doc(db, "expenses", editId), payload);
        showToast("Expense updated successfully!", "success");
      } else {
        // CREATE
        await addDoc(collection(db, "expenses"), payload);
        showToast("Expense added successfully!", "success");
      }

      // no local setExpenses here — your onSnapshot listener will pick up the change
    } catch (err) {
      console.error("Error saving expense:", err);
      showToast("Failed to save expense. Please try again.", "error");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "expenses"),
      where("uid", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdd = () => {
    setExistingExpense(null);
    setShowModal(true);
  };

  // Handle opening in Edit mode
  const handleEdit = (expense) => {
    setExistingExpense(expense);
    setShowModal(true);
  };

  // Handle submit for both Add & Edit
  const handleSubmit = (data, id) => {
    if (id) {
      updateExpense({ ...data, id }); // Edit
    } else {
      addExpense({ ...data, id: Date.now() }); // Add new
    }
    setShowModal(false);
    setExistingExpense(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Expense Tracker</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8 space-y-8">
          {/* Category Cards Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 my-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow animate-pulse"
              >
                <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-24"></div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>

          {/* Expense List Skeleton */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="h-8 bg-gray-300 rounded w-28"></div>
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <ExpenseItemSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const categoryDataObj = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const groupedExpenses = expenses.reduce((acc, e) => {
    if (!acc[e.category]) acc[e.category] = [];
    acc[e.category].push(e);
    return acc;
  }, {});
  const categoryData = Object.entries(categoryDataObj).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyTrendData = expenses.reduce((acc, e) => {
    const dateObj = new Date(e.date);
    const month = `${dateObj.getFullYear()}-${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}`;
    const existing = acc.find((d) => d.month === month);
    if (existing) {
      existing.amount += e.amount;
    } else {
      acc.push({ month, amount: e.amount });
    }
    return acc;
  }, []);

  // Calculate this month's expenses
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthExpenses = expenses.filter((e) =>
    e.date.startsWith(currentMonth)
  );
  const totalThisMonth = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  // Calculate average daily spend for this month
  const daysWithExpensesThisMonth = new Set(
    thisMonthExpenses.map((e) => e.date)
  );
  const averageDailySpend = daysWithExpensesThisMonth.size
    ? totalThisMonth / daysWithExpensesThisMonth.size
    : 0;

  // Calculate yearly spend
  const currentYear = new Date().getFullYear();
  const thisYearExpenses = expenses.filter((e) =>
    e.date.startsWith(currentYear.toString())
  );
  const totalThisYear = thisYearExpenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter((e) => {
    if (!startDate && !endDate) return true;
    const expenseDate = new Date(e.date);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;
    return (!from || expenseDate >= from) && (!to || expenseDate <= to);
  });

  return (
    <div
      className={`min-h-screen ${isDark ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <header
        className={`${
          isDark ? "bg-gray-800 text-white" : "bg-white"
        } shadow-sm py-4 px-4 sm:px-6 flex justify-between items-center`}
      >
        <h1 className="text-lg sm:text-xl font-bold">Expense Tracker</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs sm:text-sm px-2 sm:px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-1 sm:gap-2"
          >
            <FiLogOut size={14} className="sm:size-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="p-3 sm:p-4 md:p-8 space-y-6 sm:space-y-8">
        {/* <SummaryCards
          expenses={expenses}
          isDark={isDark}
          onEditIncome={() => setShowAddIncome(true)}
        /> */}

        <SummaryCards
          expenses={expenses}
          income={income}
          isDark={isDark}
          onEditIncome={() => setShowAddIncome(true)}
        />

        <SummaryHeader expenses={expenses} />

        <BudgetGoal expenses={expenses} />

        {/* Grouped Expenses by Category */}
        {/* <div className="mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? "text-white" : ""}`}>
            Expenses by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {Object.entries(groupedExpenses).map(([category, items]) => (
              <div
                key={category}
                className={`rounded-xl shadow p-4 border ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-100"
                }`}
              >
                <h4 className={`font-bold mb-2 ${isDark ? "text-white" : ""}`}>
                  {category}
                </h4>
                <ul className="space-y-2">
                  {items.map((e) => (
                    <li
                      key={e.id}
                      className="flex justify-between items-center"
                    >
                      <span>{e.title}</span>
                      <span className="font-semibold text-blue-600">
                        ₹{e.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div> */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Expenses by Category
            </h3>
            <button
              onClick={() => navigate("/analytics")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition"
            >
              View Analytics
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {Object.entries(groupedExpenses).map(([category, items]) => {
              const categoryTotal = items.reduce(
                (sum, e) => sum + Number(e.amount),
                0
              );

              return (
                <div
                  key={category}
                  className={`rounded-xl shadow p-5 border transition hover:shadow-lg
            ${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white"
                : "bg-gradient-to-br from-white to-blue-50 border-blue-100"
            }
          `}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-lg">{category}</h4>
                    <span className="text-blue-600 font-semibold dark:text-blue-400">
                      ₹{categoryTotal.toFixed(2)}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {items.map((e) => (
                      <li
                        key={e.id}
                        className="flex justify-between items-center"
                      >
                        <span className="truncate">{e.title}</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          ₹{e.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-xl p-4 shadow`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : ""
              }`}
            >
              By Category
            </h3>
            {categoryData.length === 0 ? (
              <p className="text-gray-500">No data to show</p>
            ) : (
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={true}
                      animationDuration={800}
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `₹${value}`,
                        props.payload.name,
                      ]}
                      labelFormatter={() => ""}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom Legend */}
                <div className="flex flex-col gap-2 text-sm">
                  {categoryData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span className="font-medium">{entry.name}</span>
                      <span className="text-gray-600">₹{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Line Chart */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-xl p-4 shadow`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : ""
              }`}
            >
              Monthly Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke={isDark ? "#E5E7EB" : "#374151"}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1F2937" : "#fff",
                    border: "none",
                    borderRadius: "8px",
                    color: isDark ? "#F9FAFB" : "#111827",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Date Filter */}
        <div className="mb-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <FiCalendar size={16} className="text-gray-500" />
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar size={16} className="text-gray-500" />
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-32"
            />
          </div>
        </div>

        {/* Expense List */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-xl shadow p-4`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-lg font-semibold ${isDark ? "text-white" : ""}`}
            >
              Recent Expenses
            </h3>
            <button
              // onClick={() => setShowModal(true)}
              onClick={() => {
                setExistingExpense(null); // Reset for "Add" mode
                setShowModal(true);
              }}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FiPlus size={16} />
              Add Expense
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExpenses.map((e) => {
              const colorMap = {
                Food: "#34D399",
                Travel: "#3B82F6",
                Shopping: "#EC4899",
                Utilities: "#F59E0B",
                Health: "#EF4444",
                General: "#9CA3AF",
              };

              return (
                <div
                  key={e.id}
                  className="relative group flex rounded-xl overflow-hidden 
                   bg-white dark:bg-gray-900 
                   border border-gray-200 dark:border-gray-700 
                   shadow-sm hover:shadow-md transition"
                >
                  <div
                    className="w-2 sm:w-3"
                    style={{
                      backgroundColor: colorMap[e.category] || "#9CA3AF",
                    }}
                  ></div>

                  {/* Content Area */}
                  <div className="flex-1 p-4">
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => {
                          setExistingExpense(e);
                          setShowModal(true);
                        }}
                        className="block md:hidden md:group-hover:inline-flex 
                         text-gray-500 dark:text-gray-400 
                         hover:text-blue-500 p-1 rounded"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => deleteExpense(e.id)}
                        className="block md:hidden md:group-hover:inline-flex 
                         text-gray-500 dark:text-gray-400 
                         hover:text-red-500 p-1 rounded"
                      >
                        <FiTrash size={18} />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 truncate">
                      {e.title}
                    </h3>

                    {/* Category + Date */}
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          categoryStyles[e.category] ||
                          categoryStyles["General"]
                        }`}
                      >
                        {e.category}
                      </span>
                      <span>{e.date}</span>
                    </div>

                    {/* Amount */}
                    <div className="mt-3 text-xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{e.amount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <AddExpenseModal
          onClose={() => {
            setShowModal(false);
            setExistingExpense(null); // reset after closing
          }}
          onSubmit={addExpense}
          existingExpense={existingExpense}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          isDark={isDark}
        />
      )}

      {showAddIncome && (
        <AddIncome
          initialData={income}
          onClose={() => setShowAddIncome(false)}
          onSave={handleSaveIncome}
        />
      )}
    </div>
    // Mobile Floating Button
  );
}
