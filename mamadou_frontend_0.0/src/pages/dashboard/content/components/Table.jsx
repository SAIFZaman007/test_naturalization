import { useState } from "react";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import ResponsiveTable from "../../../../components/ResponsiveTable";
import Pagination from "../../../../components/Pagination";

const Table = ({
  selectedItems,
  filteredData,
  toggleSelectAll,
  activeTab,
  searchQuery,
  toggleSelectItem,
  getStatusBadge,
  handleEditThemeOpen,
  tableeader,
  handleDetailsOpen,
  handleDeleteOpen
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const columnMap = {
    Themes: ["id", "name", "questions", "status", "lastUpdated"],
    Lesson: ["id", "LessonName", "ThemeName", "questions", "status", "lastUpdated"],
    Questions: ["id", "question", "theme", "lesson", "difficulty", "status"],
    "Revision Sheets": ["theme", "questions", "mistakes", "created", "status"],
    "Mock Exams": ["theme", "questions", "completions", "created", "status"],
  };

  // Pagination logic

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white">
      <ResponsiveTable />
      <div className="bg-white rounded-xl shadow-none scroll-smooth">
        <div className="overflow-x-auto table-wrapper">
          <table className="min-w-full divide-y divide-[#F6B0B5] border-b border-[#F6B0B5]">
            <thead className="border-b-2 border-[#F6B0B5] bg-red-50/50">
              <tr>
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length > 0 &&
                      selectedItems.length === filteredData.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-red-600 border-red-300 rounded"
                  />
                </th>
                {tableeader.map((header, index) => (
                  <th
                    key={index}
                    className={`min-w-[150px] px-6 py-3 text-xs font-semibold text-[#7C0008] uppercase tracking-wider ${header === "Actions" ? "text-center" : "text-left"
                      }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F6B0B5]">
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No {activeTab.toLowerCase()} found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const columns = columnMap[activeTab];

                  const rawDate = item.lastUpdated || item.created;
                  let formattedDate = "";
                  if (rawDate) {
                    const dateObj = new Date(rawDate);
                    if (!Number.isNaN(dateObj.getTime())) {
                      formattedDate = `${dateObj
                        .getDate()
                        .toString()
                        .padStart(2, "0")}-${(dateObj.getMonth() + 1)
                          .toString()
                          .padStart(2, "0")}-${dateObj.getFullYear()}`;
                    }
                  }

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-red-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 accent-red-600"
                        />
                      </td>

                      {columns.map((key, index) => {
                        // Show thumbnail + name for Themes on desktop
                        if (activeTab === "Themes" && key === "name") {
                          return (
                            <td key={index} className="px-6 py-4 text-sm text-gray-700">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image || "https://via.placeholder.com/64?text=No+Image"}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-md object-cover bg-gray-100"
                                />
                                <div className="truncate">
                                  <div className="text-sm font-medium text-gray-800">{item.name}</div>
                                </div>
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td key={index} className="px-6 py-4 text-sm  text-gray-700">
                            {key === "status"
                              ? getStatusBadge(item[key])
                              : key === "lastUpdated" || key === "created"
                                ? formattedDate
                                : item[key]}
                          </td>
                        );
                      })}

                      {activeTab !== "Revision Sheets" && (
                        <td className="px-6 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {activeTab === "Lesson" && (
                              <button
                                className="p-2 group"
                                onClick={() => handleDetailsOpen(item.id)}
                                title="View"
                              >
                                <Eye
                                  size={18}
                                  className="text-gray-600 group-hover:text-blue-600"
                                />
                              </button>
                            )}

                            {activeTab !== "Questions" && (
                              <button
                                className="p-2 group"
                                title="Edit"
                                onClick={() => handleEditThemeOpen(item.id)}
                              >
                                <SquarePen
                                  size={18}
                                  className="text-gray-600 group-hover:text-red-600"
                                />
                              </button>
                            )}

                            <button className="p-2 group" title="Delete">
                              <Trash2
                                onClick={() => handleDeleteOpen(item.id)}
                                size={18}
                                className="text-gray-600 group-hover:text-red-600"
                              />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          setPage={setCurrentPage}
          totalPages={totalPages}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          totalResults={filteredData.length}
        />
      </div>
    </div>
  );
};

export default Table;
