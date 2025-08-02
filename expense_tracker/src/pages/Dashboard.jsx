// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import AddExpenseModal from "../components/AddExpenseModal";

// export default function Dashboard() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);
//   const [expenses, setExpenses] = useState([]);

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   const addExpense = (expense) => {
//     // For now, just add locally — we'll use Firebase later
//     setExpenses((prev) => [...prev, expense]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
//         <h1 className="text-xl font-bold text-gray-800">Expense Tracker</h1>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-gray-600">{user?.email}</span>
//           <button
//             onClick={handleLogout}
//             className="text-sm px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="p-4 md:p-8">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//           {/* Just display total for now */}

//           <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-xl shadow text-center border border-blue-100">
//             <h2 className="text-sm text-gray-500 mb-1">This Month</h2>
//             <p className="text-2xl font-bold text-blue-600">
//               ₹{expenses.reduce((sum, e) => sum + e.amount, 0)}
//             </p>
//           </div>
//         </div>

//         {/* Expense List */}
//         <div className="bg-white rounded-xl shadow p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">Recent Expenses</h3>
//             <button
//               onClick={() => setShowModal(true)}
//               className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               + Add Expense
//             </button>
//           </div>

//           <div className="space-y-3">
//             {expenses.length === 0 ? (
//               <div className="text-center text-gray-500">No expenses yet</div>
//             ) : (
//               expenses.map((e, i) => (
//                 <div
//                   key={i}
//                   className="flex justify-between items-center p-3 border rounded-lg"
//                 >
//                   <div>
//                     <p className="font-medium">{e.title}</p>
//                     <p className="text-sm text-gray-500">
//                       {e.category} • {e.date}
//                     </p>
//                   </div>
//                   <span className="font-semibold text-blue-600">
//                     ₹{e.amount}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </main>

//       {showModal && (
//         <AddExpenseModal
//           onClose={() => setShowModal(false)}
//           onSubmit={addExpense}
//         />
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddExpenseModal from "../components/AddExpenseModal";

// Category styles (can be extracted later to a separate file or config)
const categoryStyles = {
  Food: "bg-green-100 text-green-800",
  Travel: "bg-blue-100 text-blue-800",
  Shopping: "bg-pink-100 text-pink-800",
  Bills: "bg-yellow-100 text-yellow-800",
  Other: "bg-gray-100 text-gray-800",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

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
      <main className="p-4 md:p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow border border-blue-100">
            <h2 className="text-sm text-gray-500 mb-2">This Month</h2>
            <p className="text-3xl font-bold text-blue-600">
              ₹{expenses.reduce((sum, e) => sum + e.amount, 0)}
            </p>
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
            {expenses.length === 0 ? (
              <div className="text-center text-gray-500">No expenses yet</div>
            ) : (
              expenses.map((e, i) => (
                <div
                  key={i}
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
