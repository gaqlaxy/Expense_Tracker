// src/components/ExpenseItem.jsx
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { FiTrash2, FiEdit } from "react-icons/fi";

const ExpenseItem = ({ expense, onDelete, onEdit, currency = "₹" }) => {
  const [swipeX, setSwipeX] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (e) => setSwipeX(e.deltaX),
    onSwiped: () => setSwipeX(0),
    onSwipedLeft: () => onDelete(expense.id),
    onSwipedRight: () => onEdit(expense.id),
    preventScrollOnSwipe: true,
  });

  const getBgColor = () => {
    if (swipeX > 30) return "bg-blue-500"; // swipe right for edit
    if (swipeX < -30) return "bg-red-500"; // swipe left for delete
    return "bg-transparent";
  };

  return (
    <div className="relative mb-3">
      {/* Swipe background */}
      <div
        className={`absolute inset-0 flex items-center justify-between px-4 text-white font-medium rounded-lg transition-colors duration-200 ${getBgColor()}`}
      >
        <span>{swipeX > 30 && <FiEdit size={20} />}</span>
        <span>{swipeX < -30 && <FiTrash2 size={20} />}</span>
      </div>

      {/* Foreground content */}
      <div
        {...handlers}
        className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center transition-transform duration-150"
        style={{ transform: `translateX(${swipeX}px)` }}
      >
        <div>
          <p className="font-medium">{expense.description}</p>
          <p className="text-sm text-gray-500">
            {new Date(expense.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {currency}
            {expense.amount}
          </span>
          {/* Desktop Actions */}
          <button
            onClick={() => onEdit(expense.id)}
            className="text-blue-500 hover:text-blue-700 hidden sm:block"
          >
            <FiEdit />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="text-red-500 hover:text-red-700 hidden sm:block"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
