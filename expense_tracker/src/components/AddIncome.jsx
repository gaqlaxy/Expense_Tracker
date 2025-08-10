import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase"; // adjust path as needed

export default function AddIncome({ initialData, onClose, onSave }) {
  const [title, setTitle] = useState(initialData?.title || "Salary");
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().slice(0, 10)
  );

  async function saveIncomeToFirestore(incomeData) {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to save income");
      return;
    }

    const userId = user.uid;

    try {
      // We'll save the income data under:
      // users/{userId}/income/mainIncome (you can change doc id as needed)
      const incomeRef = doc(db, "users", userId, "income", "mainIncome");

      await setDoc(incomeRef, incomeData, { merge: true }); // merge: true to update partially if needed
      console.log("Income saved to Firestore successfully.");
    } catch (error) {
      console.error("Error saving income to Firestore: ", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) return alert("Please enter a valid amount");
    onSave({ title, amount: Number(amount), date, type: "income" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-80"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {initialData ? "Edit Income" : "Add Income"}
        </h3>

        <label className="block mb-2 text-gray-700 dark:text-gray-300">
          Title
          <input
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900 dark:text-gray-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="block mb-2 text-gray-700 dark:text-gray-300">
          Amount
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900 dark:text-gray-100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4 text-gray-700 dark:text-gray-300">
          Date
          <input
            type="date"
            className="mt-1 block w-full border rounded px-2 py-1 text-gray-900 dark:text-gray-100"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
