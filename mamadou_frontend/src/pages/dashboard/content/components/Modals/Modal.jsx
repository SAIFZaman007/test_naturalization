
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Upload, X } from "lucide-react";
import { api } from "../../../../../api/axiosInstance";
import MockExams from "./MockExams";
import Questions from "./Questions";
import Lesson from "../Lesson/Lesson";
import ModalHeader from "./ModalHeader";


export default function Modal({ isOpen, onClose, activeTab, themesData = [], lessonsData = [], refetchLessons, refetchThemes, refetchQuestions }) {
  const [themeName, setThemeName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  // STOP rendering if modal is closed
  if (!isOpen) return null;

  // Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setImagePreview(URL.createObjectURL(droppedFile));
    }
  };

  const handleDragAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  // Submit handler
  const handleCreateTheme = async (e) => {
    e.preventDefault();

    if (!themeName.trim()) {
      toast.error("Please provide a theme name");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("name", themeName);
      formData.append("description", description);
      // API expects `course_image` as the multipart field (required)
      if (!file) {
        toast.error("Please upload a course image (required)");
        setIsUploading(false);
        return;
      }
      formData.append("course_image", file);

      const res = await api.post("/dashboard/create/course", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // show success toast (use server message if available)
      toast.success(res?.data?.message || "Course created successfully");

      // refetch themes in parent so the new theme appears in the table
      try {
        if (typeof refetchThemes === "function") await refetchThemes();
      } catch (e) {
      }

      // reset
      setThemeName("");
      setDescription("");
      setFile(null);
      setImagePreview(null);

      onClose();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to create course. Check console for details.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  // Lesson Modal (Special UI)
  if (activeTab === "Lesson") {
    return (
      <Lesson
        activeTab={activeTab}
        fileInputRef={fileInputRef}
        handleClose={onClose}
        handleCreateTheme={handleCreateTheme}
        handleDragAreaClick={handleDragAreaClick}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleFileChange={handleFileChange}
        setThemeName={setThemeName}
        themeName={themeName}
        themes={themesData}
        file={file}
        setFile={setFile}
        refetchLessons={refetchLessons}
      />
    );
  }

  // Questions Modal
  if (activeTab === "Questions") {
    return (
      <Questions
        activeTab={activeTab}
        handleCreateTheme={handleCreateTheme}
        onClose={onClose}
        themes={themesData}
        lessons={lessonsData}
        refetchQuestions={refetchQuestions}
      />
    );
  }

  // Mock Exams Modal
  if (activeTab === "Mock Exams") {
    return (
      <MockExams
        activeTab={activeTab}
        onClose={onClose} // ❗ FIXED
      />
    );
  }

  // Default Modal
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-auto max-h-[90vh] overflow-auto p-6">
        {/* Header */}

        <ModalHeader activeTab={activeTab} onClose={onClose} />
        {/* Body */}
        <form onSubmit={handleCreateTheme} className="space-y-6">
          {/* Theme Name */}
          <div>
            <label className="block text-sm font-medium text-[#5F0006] py-3">
              Theme Name
            </label>
            <input
              type="text"
              placeholder="e.g., French History"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#5F0006] py-3">
              Description
            </label>
            <textarea
              placeholder="Short description for this theme"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium text-[#5F0006] mb-3">
              Upload Image
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleDragAreaClick}
              className={`rounded-lg p-6 text-center cursor-pointer transition-colors border min-h-[200px] flex items-center justify-center relative ${isDragging ? "border-red-400 bg-red-50" : "border-red-300"
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
                      setFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="text-red-400" size={28} strokeWidth={1.5} />
                  <p className="text-sm text-gray-600 mt-3">
                    <span className="font-semibold text-red-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-[102px] h-[35px] text-sm font-medium border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-[102px] h-[35px] text-sm font-medium text-white bg-gradient-to-r from-[#E1000F] to-[#3333A7] rounded"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
