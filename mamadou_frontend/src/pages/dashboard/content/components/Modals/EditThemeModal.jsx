import { useRef, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { api } from "../../../../../api/axiosInstance";
import apiService from "../../../../../api/apiService";

export default function EditThemeModal({
  isOpen,
  setIsModalOpen,
  activeTab,
  onClose,
  editingItem,
  refetchThemes,
  themesData = [],
}) {
  const [themeName, setThemeName] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Close modal

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      console.log("File dropped:", file);
    }
  };
  const handleDragAreaClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      console.log("File selected:", file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!editingItem) {
        console.warn("No editingItem id provided. Aborting PATCH.");
        onClose && onClose();
        return;
      }

      // Build payload according to API: { name, description, image_url, course_id }
      const payload = {};
      if (themeName) payload.name = themeName;
      if (description) payload.description = description;
      if (selectedCourseId) payload.course_id = selectedCourseId;

      // If an image file was selected, try to upload it first and obtain a URL
      if (selectedFile) {
        try {
          const uploadRes = await apiService.uploadFile(
            "/api/upload",
            selectedFile,
            "file"
          );

          if (uploadRes && uploadRes.success) {
            // attempt common paths for returned URL
            const data = uploadRes.data || {};
            const imgUrl =
              data.url ||
              data.file ||
              data.file_url ||
              data.path ||
              data.data?.url ||
              data.data?.file_url ||
              null;

            if (imgUrl) payload.image_url = imgUrl;
          }
        } catch (uploadErr) {
          console.warn(
            "Image upload failed, continuing without image_url:",
            uploadErr
          );
        }
      }

      // Send PATCH to lessons endpoint
      const res = await apiService.patch(`/lessons/${editingItem}`, payload);

      if (res && res.success) {
        if (typeof refetchThemes === "function") await refetchThemes();

        // Reset and close
        setThemeName("");
        setDescription("");
        setSelectedFile(null);
        setImagePreview(null);
        setSelectedCourseId("");
        onClose && onClose();
      } else {
        console.error("Failed to update lesson:", res);
      }
    } catch (err) {
      console.error("Failed to update:", err?.response || err);
      onClose && onClose();
    }
  };
  const handleCreateTheme = (e) => {
    e.preventDefault();
    setThemeName("");
    setIsModalOpen(false);
  };

  if (!isOpen) return null;
  if (activeTab === "Lesson") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center  justify-center bg-black/60 px-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose && onClose();
        }}
      >
        {/* 2. Form Box */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl sm:max-w-md md:max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* 3. Header Section */}
          <div className="p-6 border-b border-gray-200  relative">
            <h2 className="text-xl font-semibold text-[#5F0006]">{`Edit ${activeTab}`}</h2>
            <p className="text-sm text-[#F18A91] mt-1">
              Add or update theme information
            </p>
            {/* Close Button (X) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          {/* 4. Form Fields Section */}
          <form onSubmit={handleSubmit} className="p-6 space-y-2">
            {/* Lesson Name Field */}
            <div>
              <label
                htmlFor="lessonName"
                className="block text-sm font-medium text-[#5F0006] mb-1"
              >
                Lesson Name
              </label>
              <input
                id="lessonName"
                type="text"
                placeholder="e.g. French History"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                className="w-full px-4 py-2 border border-[#F18A91] rounded-md text-sm text-black focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            {/* Select Themes Field */}
            <div>
              <label
                htmlFor="selectThemes"
                className="block text-sm font-medium text-[#5F0006] mb-1"
              >
                Select Themes
              </label>
              <div className="relative">
                <select
                  id="selectThemes"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="appearance-none w-full px-4 py-2 border border-red-300 rounded-md text-sm text-black bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Select a theme</option>
                  {themesData.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#F18A91]">
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

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#5F0006] mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                placeholder="Brief description of the theme"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-red-300 rounded-md text-sm text-black resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
              ></textarea>
            </div>

            {/* Upload Image Field */}
            <div>
              <label className="block text-sm font-medium text-[#5F0006] mb-1">
                Upload Image
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleDragAreaClick}
                className="flex items-center justify-center h-48 border border-red-300 rounded-md border-dashed bg-gray-50 text-[#5F0006] cursor-pointer hover:bg-gray-100 relative overflow-hidden"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12"
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
                  </div>
                )}
              </div>

              <input
                id="lesson-image-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex items-center justify-center md:justify-end gap-3 px-6 pt-6">
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
                Save Lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (activeTab === "Questions" || activeTab === "Mock Exams") {
    return (
      // 1. Modal/Dialog Container (Fully Responsive Overlay)
      // Removed fixed width here. The inner container will handle max-width.
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose && onClose();
        }}
      >
        {/* 2. Modal Content (Max Width & Responsiveness) */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl sm:max-w-md md:max-w-3xl max-h-[90vh] overflow-y-auto ">
          {/* 3. Header Section - Padding for the entire component */}
          <div className="py-3 px-6 border-b border-gray-200 relative">
            <h2 className="text-2xl font-bold text-[#5F0006]">{`Edit ${activeTab}`}</h2>
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
          <div className=" px-6 py-2 space-y-5 bg-[#FFFFFF]">
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
                className="w-full px-4 py-2.5 border border-[#F18A91] rounded-lg text-sm text-black resize-none focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#F18A91] transition duration-150"
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
                    className="appearance-none w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-black pr-10 focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#fc7f87] transition duration-150"
                  >
                    <option className="text-black">Select Theme</option>
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
                    className="appearance-none w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-black bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#F18A91] transition duration-150"
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
                className="block text-sm font-medium text-[#5F0006] pb-1"
              >
                Lesson Name
              </label>
              <div className="relative">
                <select
                  id="lessonName"
                  // Updated border color, padding, and focus ring
                  className="appearance-none w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-black bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#F18A91] transition duration-150"
                >
                  <option className="text-black">Select Lesson Name</option>
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
            <div className="space-y-2.5">
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
                  className="w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#F18A91] focus:border-[#F18A91] transition duration-150"
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
                  className="w-full px-4 py-3 border border-[#F18A91] rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#FFFFFF] focus:border-[#FFFFFF] transition duration-150"
              />
            </div>

            {/* Upload Image Field (Improved Hover State) */}
            <div>
              <h3 className="text-sm font-semibold text-[#5F0006] mb-1">
                Upload Image (Optional)
              </h3>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleDragAreaClick}
                className="flex flex-col items-center justify-center h-32 border-2 border-[#F18A91] rounded-lg text-[#5F0006] cursor-pointer hover:border-[#F18A91] hover:bg-indigo-50 transition duration-150 p-4 relative overflow-hidden"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
              Save Question
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose && onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-[827px] h-[700px]  p-6">
        {/* Header */}
        <div className="flex justify-between items-center py-2">
          <h3 className="text-xl font-extrabold text-[#5F0006]">
            {`Edit ${activeTab}`}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="theme-name"
              className="block text-sm font-medium text-[#5F0006] py-2"
            >
              Theme Name
            </label>
            <input
              id="theme-name"
              type="text"
              placeholder="e.g., French History"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#5F0006] py-2"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label
              htmlFor="theme-image-upload"
              className="block text-sm font-medium text-[#5F0006] mb-3"
            >
              Upload Image
            </label>
            <input
              id="theme-image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleDragAreaClick}
              className={`border rounded-lg p-6 text-center cursor-pointer transition-colors relative min-h-[200px] flex items-center justify-center ${
                isDragging ? "border-red-400 bg-red-50" : "border-red-300"
              } hover:border-red-400`}
            >
              {imagePreview ? (
                <div className="relative w-full flex flex-col items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-[180px] object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Upload className="text-red-400" size={28} strokeWidth={1.5} />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-red-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center md:justify-end gap-3 px-6 py-6">
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
