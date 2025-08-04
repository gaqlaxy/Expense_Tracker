import React from "react";

const ProgressBar = ({ totalBudget, currentExpenses }) => {
  const percentage = totalBudget ? (currentExpenses / totalBudget) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className={`h-full rounded-full ${
          percentage > 100 ? "bg-red-500" : "bg-green-500"
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
