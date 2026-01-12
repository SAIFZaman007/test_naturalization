import React from "react";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoInformationCircleOutline } from "react-icons/io5";

const AlertDialog = ({ isOpen, onClose, title, message, type = "info" }) => {
  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: IoCheckmarkCircleOutline,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      buttonBg: "bg-green-600 hover:bg-green-700"
    },
    error: {
      icon: IoCloseCircleOutline,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
      buttonBg: "bg-gradient-to-r from-[#E1000F] to-[#3333A7] hover:shadow-xl"
    },
    info: {
      icon: IoInformationCircleOutline,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      buttonBg: "bg-gradient-to-r from-[#E1000F] to-[#3333A7] hover:shadow-xl"
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Body */}
        <div className={`p-6 ${config.bgColor} border-l-4 ${config.borderColor}`}>
          <div className="flex items-start gap-4">
            <Icon className={`w-8 h-8 ${config.iconColor} flex-shrink-0 mt-1`} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-700 text-base">{message}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-white">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 text-white rounded-lg font-medium text-sm shadow-lg transition-all ${config.buttonBg}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
