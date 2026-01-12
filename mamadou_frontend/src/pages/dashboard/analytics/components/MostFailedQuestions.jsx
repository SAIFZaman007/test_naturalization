import { useState, useEffect } from "react";
import Pagination from "../../../../components/Pagination";
import ResponsiveTable from "./../../../../components/ResponsiveTable";
import Tbody from "./Tbody";
import Thead from "./Thead";
import api from "../../../../api/ApiService";



const MostFailedQuestions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalResults = items.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const indexOfLastItem = currentPage * resultsPerPage;
  const indexOfFirstItem = indexOfLastItem - resultsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard/statistics/questions/', { showToast: false });
        const payload = res && res.success ? res.data : null;
        if (Array.isArray(payload) && mounted) {
          const mapped = payload.map((q) => ({
            id: q.question_id || q.id || '-',
            category: q.course_name || q.course_id || '-',
            question: q.question_name || q.question || '-',
            success_rate: typeof q.success_rate === 'number' ? `${q.success_rate}%` : (q.success_rate || '0%'),
            attempts: q.total_attempts ?? q.attempts ?? 0,
            raw: q,
          }));
          setItems(mapped);
        } else if (mounted) {
          setItems([]);
        }
      } catch (err) {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchQuestions();
    return () => { mounted = false };
  }, []);

  return (
    <div className="text-[#121111] border border-[#F6B0B5] rounded-xl md:p-5 p-4 bg-white lg:mb-12 md:mb-10 sm:mb-8 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#5F0006] py-2 my-2">Most Failed Questions</h2>
      <ResponsiveTable />
      <div className="bg-white rounded-xl shadow-none">
        <div className="overflow-x-auto table-wrapper">
          <table className="min-w-full divide-y divide-[#F6B0B5] border-b border-[#F6B0B5]">
            <Thead />
            <Tbody fakeData={currentItems} />
          </table>
        </div>
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
    </div>
  );
};

export default MostFailedQuestions;
