import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, AlertTriangle } from "lucide-react";
import { api } from "../../../api/axiosInstance";
import Modal from "./components/Modals/Modal";
import EditThemeModal from "./components/Modals/EditThemeModal";
import Details from "./components/Modals/Details";
import Table from "./components/Table";
import SearchBar from "./components/Modals/SearchBar";
import Header from "./components/Modals/Header";
import DeleteModal from "./components/Modals/DeleteModal";

const allData = {
  themes: [],
  lesson: [],
  questions: [],
};

export default function Content() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lessonsData, setLessonsData] = useState([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [lessonsError, setLessonsError] = useState(null);
  const [themesData, setThemesData] = useState([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [themesError, setThemesError] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);
  // Detect active tab
  const getActiveTabFromPath = (pathname) => {
    if (pathname.includes("/themes")) return "Themes";
    if (pathname.includes("/lesson")) return "Lesson";
    if (pathname.includes("/questions")) return "Questions";
    if (pathname.includes("/revision-sheets")) return "Revision Sheets";
    if (pathname.includes("/mock-exams")) return "Mock Exams";
    return "Themes";
  };
  const activeTab = getActiveTabFromPath(location.pathname);
  const themeshea = ["ID", "Name", "Questions", "Status", "Last Updated", "Actions"];
  const lessonhea = [
    "ID",
    "Lesson Name",
    "Theme Name",
    "Questions",
    "Status",
    "Last Updated",
    "Actions",
  ];
  const questionhea = [
    "ID",
    "Questions",
    "Theme",
    "Lesson",
    "Difficulty",
    "Status",
    "Actions",
  ];
  const revisionshea = ["Theme", "Questions", "Mistakes", "Created", "Status"];
  const mockexamhea = [
    "Theme",
    "Questions",
    "Completions",
    "Created",
    "Status",
    "Actions",
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case "Themes":
        return themesData;
      case "Lesson":
        return lessonsData;
      case "Questions":
        return questionsData;
      case "Revision Sheets":
        return allData.revisionSheets;
      case "Mock Exams":
        return allData.mockExams;
      default:
        return themesData;
    }
  };

  const currentData = getCurrentData();

  // Fetch courses (includes course -> lessons -> questions) from API
  const fetchCourses = async () => {
    setIsLoadingThemes(true);
    setIsLoadingLessons(true);
    setIsLoadingQuestions(true);
    setThemesError(null);
    setLessonsError(null);
    setQuestionsError(null);

    try {

      const response = await api.get("/dashboard/filter/course?skip=0&limit=0");
      const payload = Array.isArray(response.data) ? response.data : [];

      // Build themes (courses)
      const transformedThemes = payload.map((item) => {
        const course = item.course || {};
        const status = (item.status || course.status || "").toLowerCase() === "published" ? "Published" : "Draft";
        return {
          id: course.id,
          name: course.name || course.title || "Untitled Theme",
          image: course.image_url || course.image?.url || course.image || "",
          questions: item.total_question ?? (Array.isArray(item.questions) ? item.questions.length : 0),
          status,
          lastUpdated: course.updated_at?.split("T")[0] || course.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        };
      });

      // Build lessons list
      const transformedLessons = [];
      payload.forEach((item) => {
        const course = item.course || {};
        (item.lessons || []).forEach((lesson) => {
          // Count questions for this lesson by matching lesson_id on the course-level questions array
          const lessonQuestionsCount = Array.isArray(item.questions)
            ? item.questions.filter((q) => String(q.lesson_id) === String(lesson.id)).length
            : 0;

          transformedLessons.push({
            id: lesson.id,
            LessonName: lesson.name || "Untitled Lesson",
            ThemeName: course.name || course.title || "No Theme",
            questions: lessonQuestionsCount,
            status: (item.status || course.status || "").toLowerCase() === "published" ? "Published" : "Draft",
            lastUpdated: lesson.updated_at?.split("T")[0] || lesson.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          });
        });
      });

      // Build questions list
      const transformedQuestions = [];
      payload.forEach((item) => {
        const course = item.course || {};
        (item.questions || []).forEach((q) => {
          const lessonObj = (item.lessons || []).find((l) => String(l.id) === String(q.lesson_id));
          transformedQuestions.push({
            id: q.id,
            question: q.name || q.question || q.text || "No question text",
            theme: course.name || "No Theme",
            lesson: lessonObj?.name || "No Lesson",
            difficulty: q.difficulty || "Medium",
            status: (item.status || course.status || "").toLowerCase() === "published" ? "Published" : "Draft",
            lastUpdated: q.updated_at?.split("T")[0] || q.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          });
        });
      });

      setThemesData(transformedThemes);
      setLessonsData(transformedLessons);
      setQuestionsData(transformedQuestions);
    } catch (error) {
      let errorMsg = "Failed to connect to API";
      if (error.code === "ERR_NETWORK") {
        errorMsg = "Cannot reach the backend server. Make sure it's running!";
      } else if (error.response) {
        errorMsg = `Server error: ${error.response.status} - ${error.response.statusText}`;
      }
      setThemesError(errorMsg);
      setLessonsError(errorMsg);
      setQuestionsError(errorMsg);
    } finally {
      setIsLoadingThemes(false);
      setIsLoadingLessons(false);
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [activeTab]);

  // redirect
  useEffect(() => {
    if (location.pathname === "/content" || location.pathname === "/content/") {
      navigate("/content/themes", { replace: true });
    }
  }, [location.pathname, navigate]);
  // Reset UI on tab change
  useEffect(() => {
    setSelectedItems([]);
    setSearchQuery("");
    setCurrentPage(1);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailsOpen(false);

    setEditingItem(null);
  }, [activeTab]);

  // OPEN ADD MODAL
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  // CLOSE ADD MODAL
  const handleCloseAdd = () => {
    setIsAddModalOpen(false);
  };

  // OPEN EDIT MODAL
  const handleEditThemeOpen = (id) => {
    setEditingItem(id);
    setIsEditModalOpen(true);
  };

  // CLOSE EDIT MODAL
  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // OPEN DETAILS MODAL
  const handleDetailsOpen = (id) => {
    setEditingItem(id);
    setIsDetailsOpen(true);
  };

  // CLOSE DETAILS MODAL
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setEditingItem(null);
  };
  const handleDeleteOpen = (id) => {

    setDeleteTargetId(id);
    setIsDeleteOpen(true);

  };

  // Select logic
  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map((item) => item.id));
    }

  };

  /*** ========== FILTER DATA ========== ***/
  const filteredData = currentData.filter((item) => {
    const searchTerm = searchQuery.toLowerCase();

    if (activeTab === "Lesson") {
      return (
        item.LessonName?.toLowerCase().includes(searchTerm) ||
        item.ThemeName?.toLowerCase().includes(searchTerm)
      );
    }

    if (activeTab === "Questions") {
      return (
        item.question?.toLowerCase().includes(searchTerm) ||
        item.theme?.toLowerCase().includes(searchTerm) ||
        item.difficulty?.toLowerCase().includes(searchTerm) ||
        item.id?.toString().includes(searchTerm)
      );
    }

    if (activeTab === "Revision Sheets") {
      return (
        item.theme?.toLowerCase().includes(searchTerm) ||
        item.created?.toLowerCase().includes(searchTerm) ||
        item.id?.toString().includes(searchTerm)
      );
    }

    if (activeTab === "Mock Exams") {
      return (
        item.theme?.toLowerCase().includes(searchTerm) ||
        item.created?.toLowerCase().includes(searchTerm) ||
        item.completions?.toString().includes(searchTerm)
      );
    }

    return item.name?.toLowerCase().includes(searchTerm);
  });

  const getStatusBadge = (status) => {
    let colorClass = "";
    if (status === "Published") colorClass = "bg-[#000091] text-[#fff]";
    else if (status === "Draft") colorClass = "bg-[#FCE6E7] text-[#5F0006]";

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
      >
        {status}
      </span>
    );

  };
  return (
    <div className="h-full w-full flex flex-col font-sans scroll-smooth">
      <Header />

      <main className="flex-1 py-6  ">
        <div className="bg-white rounded-xl border border-[#F6B0B5] px-3 md:px-8 pb-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#5F0006] pt-2 my-2">
              {activeTab}
            </h2>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#E1000F] to-[#3333A7] text-white px-4  md:px-4 py-3 my-2 md:py-3.5 rounded-lg"
            >
              <Plus size={16} />
              Add {activeTab === "Lesson" ? "Lesson" : activeTab.slice(0, -1)}
            </button>
          </div>

          {(isLoadingThemes && activeTab === "Themes") || (isLoadingLessons && activeTab === "Lesson") || (isLoadingQuestions && activeTab === "Questions") ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E1000F] mb-4"></div>
              <p className="text-gray-600">Loading {activeTab === "Themes" ? "themes" : activeTab === "Lesson" ? "lessons" : "questions"} from API...</p>
            </div>
          ) : (themesError && activeTab === "Themes") || (lessonsError && activeTab === "Lesson") || (questionsError && activeTab === "Questions") ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 my-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">❌ {activeTab === "Themes" ? themesError : activeTab === "Lesson" ? lessonsError : questionsError}</h3>
                  <div className="text-sm text-red-700 space-y-2">
                    <p className="font-medium">Troubleshooting Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Make sure your FastAPI backend is running</li>
                      <li>Check if the API is accessible at: <code className="bg-red-100 px-2 py-1 rounded">{import.meta.env.VITE_API_BASE_URL || 'https://mamadou.mtscorporate.com/api/v1'}/{activeTab === "Themes" ? "courses" : activeTab === "Lesson" ? "lessons" : "questions"}</code></li>
                      <li>Verify CORS is enabled in your FastAPI backend</li>
                      <li>Check browser console for detailed error logs</li>
                    </ol>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      🔄 Retry Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <SearchBar
                activeTab={activeTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              <Table
                tableeader={
                  activeTab === "Themes"
                    ? themeshea
                    : activeTab === "Lesson"
                      ? lessonhea
                      : activeTab === "Questions"
                        ? questionhea
                        : activeTab === "Revision Sheets"
                          ? revisionshea
                          : mockexamhea
                }
                activeTab={activeTab}
                filteredData={filteredData}
                getStatusBadge={getStatusBadge}
                selectedItems={selectedItems}
                toggleSelectAll={toggleSelectAll}
                toggleSelectItem={toggleSelectItem}
                handleEditThemeOpen={handleEditThemeOpen}
                handleDetailsOpen={handleDetailsOpen}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                handleDeleteOpen={handleDeleteOpen}
              />
            </>
          )}

        </div>
      </main>

      {/* ADD Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAdd}
        themesData={themesData}
        lessonsData={lessonsData}
        refetchLessons={fetchCourses}
        refetchThemes={fetchCourses}
        refetchQuestions={fetchCourses}
        activeTab={activeTab}
      />

      {/* EDIT Modal */}
      <EditThemeModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        editingItem={editingItem}
        refetchThemes={fetchCourses}
        activeTab={activeTab}
        themesData={themesData}
      />

      {/* DETAILS Modal */}
      <Details
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        lessonData={
          editingItem ? filteredData.find((d) => d.id === editingItem) : null
        }
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteTargetId(null);
        }}
        itemName={
          activeTab === "Themes"
            ? (themesData.find((t) => t.id === deleteTargetId) || {}).name || "item"
            : activeTab === "Lesson"
              ? (lessonsData.find((l) => l.id === deleteTargetId) || {}).LessonName || "item"
              : (questionsData.find((q) => q.id === deleteTargetId) || {}).question || "item"
        }
        onConfirm={async () => {
          if (!deleteTargetId) return;
          try {
            // Delete based on active tab
            if (activeTab === "Themes") {
              await api.delete(`/courses/${deleteTargetId}`);
            } else if (activeTab === "Lesson") {
              await api.delete(`/lessons/${deleteTargetId}`);
            } else if (activeTab === "Questions") {
              await api.delete(`/questions/${deleteTargetId}`);
            }
            // refetch the data to update UI
            await fetchCourses();
          } catch (err) {
            console.error(`Failed to delete ${activeTab}:`, err);
            throw err;
          } finally {
            setDeleteTargetId(null);
          }
        }}
      />
    </div>
  );
}
