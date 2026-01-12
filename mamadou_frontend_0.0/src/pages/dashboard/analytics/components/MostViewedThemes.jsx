import { GoChevronRight } from "react-icons/go";
import Pagination from "../../../../components/Pagination";
import { useState, useEffect } from "react";
import CompletionModal from "./CompletionModal";

const MostViewedThemes = () => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const resultsPerPage = 6;

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://mamadou.mtscorporate.com/api/v1/dashboard/all-courses-stats", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!mounted) return;

        const mapped = (Array.isArray(data) ? data : []).map((it, idx) => ({
          id: it.course_id || idx + 1,
          topic: it.course_name || "-",
          views: it.total_students ?? 0,
          completion: Math.round(it.average_progress ?? 0),
        }));
        setItems(mapped);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load themes");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const totalResults = items.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const indexOfLastItem = currentPage * resultsPerPage;
  const indexOfFirstItem = indexOfLastItem - resultsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsOpen(false);
  };

  return (
    <div className="text-[#121111] border border-[#F6B0B5] rounded-xl bg-white px-4 sm:px-6 md:px-8 py-6 md:py-8">
      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#5F0006] mb-4">Most Viewed Themes</h2>

      {/* Loading / Error */}
      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="space-y-4 overflow-x-auto">
          {currentItems.map((data, idx) => (
            <div
              key={data.id}
              className="bg-[#F9FAFB] p-3 sm:p-4 rounded-lg flex justify-between items-center"
            >
              {/* Left section */}
              <div className="flex gap-3">
                <h2 className="flex items-center gap-1 font-bold text-3xl text-[#F18A91]">#{indexOfFirstItem + idx + 1}</h2>
                <div className="flex flex-col">
                  <h3 className="text-base sm:text-lg text-[#7C0008] font-semibold">{data.topic}</h3>
                  <p className="text-sm sm:text-base text-[#EB545E]">{data.views} views</p>
                </div>
              </div>

              {/* Right section */}
              <div>
                <div onClick={() => handleOpenModal(data)} className="flex items-center cursor-pointer gap-2 md:gap-3 lg:gap-4 text-[#EB545E]">
                  <div className="flex flex-col">
                    <h3 className="text-base sm:text-lg text-[#E7333F] font-semibold">{data.completion}%</h3>
                    <p className="text-sm sm:text-base">completion</p>
                  </div>
                  <GoChevronRight className="w-6 h-6 md:w-7 md:h-7" />
                </div>
              </div>
            </div>
          ))}

          {isOpen && selectedItem && (
            <CompletionModal
              handleCloseModal={handleCloseModal}
              topic={selectedItem.topic}
              views={selectedItem.views}
              completion={selectedItem.completion}
            />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            totalPages={totalPages}
            totalResults={totalResults}
          />
        </div>
      )}
    </div>
  );
};

export default MostViewedThemes;