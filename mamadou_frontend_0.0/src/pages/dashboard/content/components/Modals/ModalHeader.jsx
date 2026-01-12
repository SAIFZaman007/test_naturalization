import { XIcon } from 'lucide-react';
import React from 'react';

const ModalHeader = ({activeTab,onClose}) => {
    return (
          <div className="flex justify-between items-center py-2">
          <h3 className="text-xl font-extrabold text-[#5F0006]">
            {`Create ${
              activeTab === "Revision Sheets" ? "Sheet" : activeTab.slice(0, -1)
            }`}
          </h3>

          <button
            onClick={onClose}
            className="rounded-full text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
            title="Close"
          >
            <XIcon size={24} />
          </button>
        </div>
    );
};

export default ModalHeader;