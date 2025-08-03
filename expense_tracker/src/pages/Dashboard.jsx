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

const categoryStyles = {
  Food: "bg-green-100 text-green-800",
  Travel: "bg-blue-100 text-blue-800",
  Shopping: "bg-pink-100 text-pink-800",
  Bills: "bg-yellow-100 text-yellow-800",
  Other: "bg-gray-100 text-gray-800",
};

const COLORS = ["#34D399", "#3B82F6", "#EC4899", "#F59E0B", "#9CA3AF"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const addExpense = async (expense) => {
    try {
      await addDoc(collection(db, "expenses"), {
        ...expense,
        uid: user.uid,
        date: expense.date || new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryDataObj = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryDataObj).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyTrendData = expenses.reduce((acc, e) => {
    // const month = new Date(e.date).toLocaleString("default", {
    //   month: "short",
    // });
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

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Get unique days from expense dates
  const daysWithExpenses = new Set(expenses.map((e) => e.date));
  const averageDailySpend = daysWithExpenses.size
    ? totalAmount / daysWithExpenses.size
    : 0;

  const filteredExpenses = expenses.filter((e) => {
    if (!startDate && !endDate) return true;
    const expenseDate = new Date(e.date);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;
    return (!from || expenseDate >= from) && (!to || expenseDate <= to);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main */}
      <main className="p-4 md:p-8 space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

        <SummaryHeader expenses={expenses} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* This Month */}
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow border border-blue-100">
            <h2 className="text-sm text-gray-500 mb-2">This Month</h2>
            <p className="text-3xl font-bold text-blue-600">₹{totalAmount}</p>
          </div>

          {/* Average Daily Spend */}
          <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow border border-green-100">
            <h2 className="text-sm text-gray-500 mb-2">Avg Daily Spend</h2>
            <p className="text-3xl font-bold text-green-600">
              ₹{averageDailySpend.toFixed(2)}
            </p>
          </div>

          {/* No. of Transactions */}
          <div className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-xl shadow border border-yellow-100">
            <h2 className="text-sm text-gray-500 mb-2">Transactions</h2>
            <p className="text-3xl font-bold text-yellow-600">
              {expenses.length}
            </p>
          </div>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold mb-4">By Category</h3>
            {categoryData.length === 0 ? (
              <p className="text-gray-500">No data to show</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Line Chart */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
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
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Expenses</h3>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              + Add Expense
            </button>
          </div>

          <div className="space-y-3">
            {filteredExpenses.length === 0 ? (
              <div className="text-center text-gray-500">No expenses yet</div>
            ) : (
              filteredExpenses.map((e) => (
                <div
                  key={e.id}
                  className="flex justify-between items-center p-3 border rounded-lg hover:shadow-sm transition"
                >
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          categoryStyles[e.category] || categoryStyles["Other"]
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
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onSubmit={addExpense}
        />
      )}
    </div>
  );
}
