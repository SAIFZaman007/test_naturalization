import React from 'react';

const MockExams = ({ activeTab, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose && onClose();
      }}
    >
      {/* 2. Modal Content (Max Width & Responsiveness) */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl sm:max-w-md md:max-w-3xl max-h-[90vh] overflow-y-auto ">
        {/* 3. Header Section - Padding for the entire component */}
        <div className="py-4 px-6 border-b border-gray-200 relative">
          <h2 className="text-2xl font-bold text-[#5F0006]">{`Add ${activeTab}`}</h2>
          <p className="text-sm text-[#F18A91] mt-1">
            Add or update question details and answers
          </p>

          {/* Close Button (X) - Top right, adjusted for 2xl text and color */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-3xl leading-none transition duration-150"
          >
            &times;
          </button>
        </div>

        {/* 4. Form Fields Section - Added subtle background for grouping and vertical gap */}
        <div className=" px-6 py-2 space-y-8 bg-[#FFFFFF]">
          {/* Question Text Area */}
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-[#5F0006] pb-2"
            >
              Question
            </label>
            <textarea
              id="question"
              rows="3"
              placeholder="Enter your questions here."
              // Updated border color to soft gray, added indigo focus ring
              className="w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-[#F18A91] resize-none focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#F18A91] transition duration-150"
            ></textarea>
          </div>

          {/* Theme and Difficulty (Responsive Grid: 1 column on small, 2 on others) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="theme"
                className="block text-sm font-medium text-[#5F0006]  pb-1"
              >
                Theme
              </label>
              <div className="relative">
                <select
                  id="theme"
                  // Updated border color, padding, and focus ring
                  className="appearance-none w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-[#F18A91] pr-10 focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#fc7f87] transition duration-150"
                >
                  <option className="text-[#F18A91]">Select Theme</option>
                  {/* ... other options */}
                </select>
                {/* Custom Down Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#F18A91]">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-[#5F0006] mb-1"
              >
                Difficulty
              </label>
              <div className="relative">
                <select
                  id="difficulty"
                  // Updated border color, padding, and focus ring
                  className="appearance-none w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-[#F18A91] bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#F18A91] transition duration-150"
                >
                  <option className="text-gray-500">Select difficulty</option>
                  {/* ... other options */}
                </select>
                {/* Custom Down Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Name Dropdown */}
          <div>
            <label
              htmlFor="lessonName"
              className="block text-sm font-medium text-[#5F0006] pb-2"
            >
              Lesson Name
            </label>
            <div className="relative">
              <select
                id="lessonName"
                // Updated border color, padding, and focus ring
                className="appearance-none w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-[#F18A91] bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#F18A91] transition duration-150"
              >
                <option className="text-[#F18A91]">Select Lesson Name</option>
                {/* ... other options */}
              </select>
              {/* Custom Down Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#5F0006]">
              Answer Options
            </h3>
            {[
              "Answer Option 1",
              "Answer Option 2",
              "Answer Option 3",
              "Answer Option 4",
            ].map((placeholder, index) => (
              <input
                key={index}
                type="text"
                placeholder={placeholder}
                // Updated border color, padding, and focus ring
                className="w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-[#F18A91] focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#F18A91] transition duration-150"
              />
            ))}
          </div>

          {/* Correct Answer - Could be a radio group/dropdown of the options, but keeping as text field for simplicity */}
          <div>
            <h3 className="text-sm font-semibold text-[#5F0006]">
              Correct Answer
            </h3>
            <input
              type="text"
              placeholder="e.g., Answer Option 2"
              // Updated border color, padding, and focus ring
              className="w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-[#F18A91] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF] focus:border-[#FFFFFF] transition duration-150"
            />
          </div>

          {/* Upload Image Field (Improved Hover State) */}
          <div>
            <h3 className="text-sm font-semibold text-[#5F0006] mb-2">
              Upload Image (Optional)
            </h3>
            <div className="flex flex-col items-center justify-center h-32 border-2 border-[#F18A91] rounded-lg   text-[#5F0006]cursor-pointer hover:border-[#F18A91] hover:bg-indigo-50 transition duration-150 p-4">
              {/* Image Icon Placeholder */}
              <svg
                className="mx-auto h-8 w-8 text-[#F18A91]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-5 4h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-xs text-[#5F0006]">
                Drag and drop or click to upload
              </p>
            </div>
          </div>
        </div>



        <div className="flex items-center justify-center md:justify-end gap-3 px-6 pt-6 pb-6">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose} // FIXED
            className="w-[102px] h-[38px] 
               flex items-center justify-center
               text-sm font-medium 
               text-gray-700 bg-white 
               border border-gray-300 rounded-lg
               hover:bg-gray-100 
               transition"
          >
            Cancel
          </button>

          {/* Save Button */}
          <button
            type="submit"
            className="w-[102px] h-[38px]
               flex items-center justify-center
               text-sm font-medium text-white 
               bg-gradient-to-r from-[#E1000F] to-[#3333A7] 
               rounded-lg shadow-sm
               hover:from-[#7C0008] hover:to-blue-700
               transition"
          >
            Save Theme
          </button>
        </div>
      </div>
    </div>
  )

};

export default MockExams;