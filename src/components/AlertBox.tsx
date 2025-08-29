// AlertBox.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type AlertType = "success" | "error" | "warning" | "confirm"; // Added 'confirm' type

interface AlertBoxProps {
  type: AlertType;
  message: string;
  onClose: () => void; // For simple alerts, this is "OK" or "Cancel" for confirm
  isOpen: boolean;
  onConfirm?: () => void; // New: Optional handler for confirmation (e.g., "Yes" button)
  confirmText?: string; // New: Optional text for the confirm button
  cancelText?: string; // New: Optional text for the cancel button
  title?: string; // New: Optional title for the alert/confirmation
}

const typeStyles: Record<AlertType, string> = {
  success: "bg-green-100 text-green-700 border-green-500",
  error: "bg-red-100 text-red-700 border-red-500",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-500",
  confirm: "bg-blue-100 text-blue-700 border-blue-500", // Style for confirmation
};

const AlertBox: React.FC<AlertBoxProps> = ({
  type,
  message,
  onClose,
  isOpen,
  onConfirm, // Destructure new props
  confirmText = "Yes", // Default text for confirm button
  cancelText = "No", // Default text for cancel button
  title, // Destructure new title prop
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`w-96 rounded-2xl border p-6 shadow-lg ${typeStyles[type]}`}
          >
            <h2 className="text-lg font-semibold capitalize">
              {title || type}{" "}
              {/* Use title if provided, otherwise default to type */}
            </h2>
            <p className="mt-2">{message}</p>
            {type === "confirm" && onConfirm ? ( // Render two buttons for 'confirm' type
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={onClose} // onClose will act as "No"
                  className="rounded-xl bg-white px-4 py-2 font-medium text-gray-800 shadow hover:bg-gray-100"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm} // onConfirm will act as "Yes"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700"
                >
                  {confirmText}
                </button>
              </div>
            ) : (
              // Render single "OK" button for other alert types
              <button
                onClick={onClose}
                className="mt-4 w-full rounded-xl bg-white px-4 py-2 font-medium text-gray-800 shadow hover:bg-gray-100"
              >
                OK
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AlertBox;
