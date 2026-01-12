const Pagination = ({
  indexOfFirstItem,
  indexOfLastItem,
  totalResults,
  handlePrevious,
  currentPage,
  handleNext,
  totalPages,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between mt-2 px-4 pt-3 bg-white gap-4">
      <div className="text-sm sm:text-base text-[#EB545E]">
        Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to
        <span className="font-semibold px-1">
          {Math.min(indexOfLastItem, totalResults)}
        </span>
        of <span className="font-semibold px-1">{totalResults}</span> results
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-8 py-3 border-2 border-[#F18A91] text-[#F18A91] rounded-xl font-medium text-sm sm:text-base ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-pink-50"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`flex items-center gap-1 max-h-12 min-h-10 px-10 py-6.5 border-[#F18A91] text-[#fff] rounded-xl font-medium text-sm sm:text-base bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg ${
            currentPage === totalPages || totalPages === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;




