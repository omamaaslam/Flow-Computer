// AlertBox.tsx
import React from "react";
import { motion } from "framer-motion";

type AlertType = "success" | "error" | "warning";

interface AlertBoxProps {
  type: AlertType;
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

const typeStyles: Record<AlertType, string> = {
  success: "bg-green-100 text-green-700 border-green-500",
  error: "bg-red-100 text-red-700 border-red-500",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-500",
};

const AlertBox: React.FC<AlertBoxProps> = ({ type, message, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className={`w-96 rounded-2xl border p-6 shadow-lg ${typeStyles[type]}`}
      >
        <h2 className="text-lg font-semibold capitalize">{type}</h2>
        <p className="mt-2">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-white px-4 py-2 font-medium text-gray-800 shadow hover:bg-gray-100"
        >
          OK
        </button>
      </motion.div>
    </div>
  );
};

export default AlertBox;
