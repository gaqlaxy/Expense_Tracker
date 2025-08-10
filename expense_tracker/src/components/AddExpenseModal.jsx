// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export default function AddExpenseModal({
//   onClose,
//   onSubmit,
//   existingExpense,
// }) {
//   const isEdit = !!existingExpense;

//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("General");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [note, setNote] = useState("");

//   const categories = [
//     "Food",
//     "Travel",
//     "Shopping",
//     "Utilities",
//     "Health",
//     "General",
//   ];

//   useEffect(() => {
//     if (isEdit) {
//       setTitle(existingExpense.title || "");
//       setAmount(existingExpense.amount || "");
//       setCategory(existingExpense.category || "General");
//       setDate(existingExpense.date || new Date().toISOString().split("T")[0]);
//       setNote(existingExpense.note || "");
//     }
//   }, [existingExpense]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (parseFloat(amount) <= 0) return alert("Amount must be greater than 0");
//     const expenseData = {
//       title: title.trim(),
//       amount: parseFloat(amount),
//       category,
//       date,
//       note: note.trim(),
//     };
//     onSubmit(expenseData, isEdit ? existingExpense.id : null);
//     onClose();
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.2 }}
//         className="bg-white dark:bg-gray-900 dark:text-gray-200 w-full max-w-md rounded-xl p-6 shadow-lg relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-xl font-semibold mb-4">
//           {isEdit ? "Edit Expense" : "Add New Expense"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium">Title</label>
//             <input
//               type="text"
//               value={title}
//               autoFocus
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2
//                    focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
//               required
//             />
//           </div>

//           {/* Amount */}
//           <div>
//             <label className="block text-sm font-medium">Amount (₹)</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2
//                    focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
//               required
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium">Category</label>
//             <div className="flex gap-2 flex-wrap">
//               {categories.map((cat) => (
//                 <button
//                   type="button"
//                   key={cat}
//                   onClick={() => setCategory(cat)}
//                   className={`px-3 py-1 rounded-full border transition-colors ${
//                     category === cat
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-sm font-medium">Date</label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2
//                    focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
//               required
//             />
//           </div>

//           {/* Note */}
//           <div>
//             <label className="block text-sm font-medium">Note (optional)</label>
//             <textarea
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2
//                    focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
//               rows={2}
//             />
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400
//                    dark:bg-gray-700 dark:hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//             >
//               {isEdit ? "Update" : "Add"}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddExpenseModal({
  onClose,
  onSubmit,
  existingExpense,
}) {
  const isEdit = !!existingExpense;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Utilities",
    "Health",
    "General",
  ];

  useEffect(() => {
    if (isEdit) {
      setTitle(existingExpense.title || "");
      setAmount(existingExpense.amount || "");
      setCategory(existingExpense.category || "General");
      setDate(existingExpense.date || new Date().toISOString().split("T")[0]);
      setNote(existingExpense.note || "");
    }
  }, [existingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseData = {
      title,
      amount: parseFloat(amount),
      category,
      date,
      note,
    };
    onSubmit(expenseData, isEdit ? existingExpense.id : null);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex justify-center items-center 
                   bg-black/30 dark:bg-black/50 backdrop-blur-sm dark:backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 dark:text-gray-200 w-full max-w-md rounded-xl p-6 shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4">
            {isEdit ? "Edit Expense" : "Add New Expense"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 
                           focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 
                           focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium">Category</label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full border transition-colors ${
                      category === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 
                           focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                required
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium">
                Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 
                           focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 
                           dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
