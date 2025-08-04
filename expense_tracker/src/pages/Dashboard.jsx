import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SummaryHeader from "../components/SummaryHeader";
import AddExpenseModal from "../components/AddExpenseModal";
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
} from "firebase/firestore";
import { db } from "../services/firebase";
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
import { FiTrash } from "react-icons/fi";

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

  const addExpense = async (expense) => {
    try {
      await addDoc(collection(db, "expenses"), {
        ...expense,
        uid: user.uid,
        date: expense.date || new Date().toISOString().split("T")[0],
      });
      showToast("Expense added successfully!", "success");
    } catch (err) {
      console.error("Error adding expense:", err);
      showToast("Failed to add expense. Please try again.", "error");
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
        <SummaryHeader expenses={expenses} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* This Month */}
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
            <p className="text-xl sm:text-3xl font-bold text-blue-600">
              ₹{totalThisMonth}
            </p>
          </div>

          {/* Average Daily Spend */}
          <div
            className={`${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-green-900 border-green-800"
                : "bg-gradient-to-br from-white to-green-50 border-green-100"
            } p-4 sm:p-6 rounded-xl shadow border`}
          >
            <h2
              className={`text-xs sm:text-sm ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-2`}
            >
              Avg Daily Spend
            </h2>
            <p className="text-xl sm:text-3xl font-bold text-green-600">
              ₹{averageDailySpend.toFixed(2)}
            </p>
          </div>

          {/* No. of Transactions */}
          <div
            className={`${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-yellow-900 border-yellow-800"
                : "bg-gradient-to-br from-white to-yellow-50 border-yellow-100"
            } p-4 sm:p-6 rounded-xl shadow border`}
          >
            <h2
              className={`text-xs sm:text-sm ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-2`}
            >
              Transactions
            </h2>
            <p className="text-xl sm:text-3xl font-bold text-yellow-600">
              {expenses.length}
            </p>
          </div>

          {/* Yearly Spend */}
          <div
            className={`${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-purple-900 border-purple-800"
                : "bg-gradient-to-br from-white to-purple-50 border-purple-100"
            } p-4 sm:p-6 rounded-xl shadow border`}
          >
            <h2
              className={`text-xs sm:text-sm ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-2`}
            >
              Yearly Spend
            </h2>
            <p className="text-xl sm:text-3xl font-bold text-purple-600">
              ₹{totalThisYear}
            </p>
          </div>
        </div>

        {/* Grouped Expenses by Category */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? "text-white" : ""}`}>
            Expenses by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {Object.entries(groupedExpenses).map(([category, items]) => (
              <div
                key={category}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-4"
              >
                <h4 className="font-bold mb-2">{category}</h4>
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
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
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

          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <div className="text-center text-gray-500">No expenses yet</div>
            ) : (
              filteredExpenses.map((e) => (
                // <div
                //   key={e.id}
                //   className="flex justify-between items-center p-3 border rounded-lg hover:shadow-sm transition"
                // >
                //   <div>
                //     <p className="font-medium">{e.title}</p>
                //     <div className="text-sm text-gray-500 flex items-center gap-2">
                //       <span
                //         className={`text-xs font-medium px-2 py-1 rounded ${
                //           categoryStyles[e.category] ||
                //           categoryStyles["General"]
                //         }`}
                //       >
                //         {e.category}
                //       </span>
                //       <span>{e.date}</span>
                //     </div>
                //   </div>
                //   <span className="font-semibold text-blue-600 text-lg">
                //     ₹{e.amount}
                //   </span>
                //   <button
                //     onClick={() => deleteExpense(e.id)}
                //     className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hidden group-hover:block"
                //     title="Delete Expense"
                //   >
                //     🗑️
                //   </button>
                // </div>
                <div
                  key={e.id}
                  className="relative group flex justify-between items-center p-3 border rounded-lg hover:shadow-sm transition"
                >
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          categoryStyles[e.category] ||
                          categoryStyles["General"]
                        }`}
                      >
                        {e.category}
                      </span>
                      <span>{e.date}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-blue-600 text-lg">
                    ₹{e.amount}
                  </span>

                  {/* 🗑 DELETE BUTTON */}
                  <button
                    onClick={() => deleteExpense(e.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hidden group-hover:block"
                    title="Delete Expense"
                  >
                    {/* 🗑️ */}
                    <FiTrash size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        // <AddExpenseModal
        //   onClose={() => setShowModal(false)}
        //   onSubmit={addExpense}
        // />
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
    </div>
  );
}
