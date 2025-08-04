import { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiX } from "react-icons/fi";

const Toast = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
  isDark = false,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="text-green-500" size={20} />;
      case "error":
        return <FiXCircle className="text-red-500" size={20} />;
      case "warning":
        return <FiAlertCircle className="text-yellow-500" size={20} />;
      default:
        return <FiCheckCircle className="text-green-500" size={20} />;
    }
  };

  const getBgColor = () => {
    if (isDark) {
      switch (type) {
        case "success":
          return "bg-gray-800 border-green-600";
        case "error":
          return "bg-gray-800 border-red-600";
        case "warning":
          return "bg-gray-800 border-yellow-600";
        default:
          return "bg-gray-800 border-green-600";
      }
    } else {
      switch (type) {
        case "success":
          return "bg-green-50 border-green-200";
        case "error":
          return "bg-red-50 border-red-200";
        case "warning":
          return "bg-yellow-50 border-yellow-200";
        default:
          return "bg-green-50 border-green-200";
      }
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${getBgColor()} shadow-lg flex items-center gap-3 min-w-80 animate-slide-in`}
    >
      {getIcon()}
      <span
        className={`flex-1 text-sm font-medium ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        {message}
      </span>
      <button
        onClick={onClose}
        className={`${
          isDark
            ? "text-gray-400 hover:text-gray-200"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default Toast;
