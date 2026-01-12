

import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName = "item" }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!onConfirm) return onClose();
    try {
      setLoading(true);
      await onConfirm();
    } catch (err) {
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose && onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <h2 className="text-sm font-semibold text-gray-800 mb-2">Are you sure?</h2>

        <p className="text-sm text-gray-500 mb-8">This will permanently delete the {itemName}.</p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
