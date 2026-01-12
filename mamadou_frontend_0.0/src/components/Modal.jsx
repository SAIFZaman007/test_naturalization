   

import { IoClose } from "react-icons/io5";

const Modal = ({ closeModal, children, className }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121111CC] bg-opacity-70 p-4 sm:p-6">
      {/* Modal Content Container */}
      <div
        className={`
          relative 
          w-full 
          lg:w-[60%] 
          max-h-[90vh] 
          overflow-y-auto
          rounded-lg 
          bg-white 
          p-4 sm:p-6 md:p-7 lg:p-8 
          shadow-2xl 
          ${className}
        `}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 rounded-full bg-white p-2 text-gray-700 transition hover:bg-gray-200 hover:text-gray-900"
        >
          <IoClose className="h-6 w-6 text-red-600" />
        </button>

        {/* Modal Body */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

