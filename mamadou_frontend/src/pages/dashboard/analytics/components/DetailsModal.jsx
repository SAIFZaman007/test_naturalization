import Modal from "../../../../components/Modal";
import { useEffect, useState } from "react";
// removed api import — Study Hours removed

const DetailsModal = ({ fakeData = [], selectedRow = null, handleClose }) => {
  const formatNumber = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const parsePercent = (v) => {
    if (v == null) return 0;
    if (typeof v === "string") return Number(v.replace("%", "")) || 0;
    return Number(v) || 0;
  };

  const filtered = (() => {
    if (!selectedRow) return [];
    // If fakeData items have course_id, match by course_id
    if (selectedRow.course_id) {
      return fakeData.filter((d) => d.course_id === selectedRow.course_id);
    }
    // Otherwise try matching by course_name or category
    if (selectedRow.category) {
      return fakeData.filter(
        (d) => d.course_name === selectedRow.category || d.category === selectedRow.category
      );
    }
    return [];
  })();

  const views = filtered.length
    ? filtered.reduce((s, x) => s + Number(x.total_attempts || x.attempts || 0), 0)
    : Number(selectedRow?.total_attempts || selectedRow?.attempts || 0);

  const completion = filtered.length
    ? Math.round(filtered.reduce((s, x) => s + parsePercent(x.success_rate), 0) / filtered.length)
    : parsePercent(selectedRow?.success_rate || selectedRow?.successRate);

  // Study Hours removed — not displayed in details modal

  return (
    <Modal
      className={"!w-[95%] sm:!w-4/5 md:!w-3/4 lg:!w-2/3 xl:!w-1/2 !p-6"}
      fakeData={fakeData}
      closeModal={handleClose}
    >
      <div className="relative">
        <button
          onClick={handleClose}
          aria-label="Close details"
          className="absolute right-0 top-0 text-[#E33] hover:text-[#b00] p-2 rounded-full"
        >
          <span className="text-2xl leading-none">×</span>
        </button>

        <div className="flex flex-col gap-6">
          <div className="text-[#5F0006]">
            <h2 className="font-bold text-2xl">Theme Statistics</h2>
            <p className="text-sm text-[#F18A91]">Detailed performance metrics for this theme</p>
          </div>

          <div>
            <h3 className="font-semibold text-[#5F0006] text-lg">{selectedRow?.course_name || selectedRow?.category || 'Theme'}</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Views card */}
              <div className="rounded-xl p-6 bg-[#EEF0FB] border border-pink-200 shadow-sm flex flex-col justify-between">
                <p className="text-sm text-[#F18A91]">Views</p>
                <h4 className="font-extrabold text-4xl md:text-5xl text-[#3942A6]">{formatNumber(views || 0)}</h4>
              </div>

              {/* Completion card */}
              <div className="rounded-xl p-6 bg-[#FDECEF] border border-pink-200 shadow-sm flex flex-col justify-between">
                <p className="text-sm text-[#E94B52]">Completion</p>
                <h4 className="font-extrabold text-4xl md:text-5xl text-[#E7333F]">{completion}%</h4>
              </div>

              {/* Study Hours removed */}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsModal;

/*
  ======= PREVIOUS IMPLEMENTATION (commented out) =======
  The original component and its answer-distribution UI were kept
  here for reference. If you need to revert or reuse parts,
  uncomment and adapt accordingly.

  const data = [
    {
      value: "1999",
      percentage: 35,
      isHighest: true,
      color: "text-white bg-blue-900",
    },
    {
      value: "1750",
      percentage: 28,
      isHighest: false,
      color: "text-gray-700 bg-gray-300",
    },
    {
      value: "1620",
      percentage: 22,
      isHighest: false,
      color: "text-gray-700 bg-gray-300",
    },
    {
      value: "1565",
      percentage: 18,
      isHighest: false,
      color: "text-gray-700 bg-gray-300",
    },
    {
      value: "1432",
      percentage: 14,
      isHighest: false,
      color: "text-gray-700 bg-gray-300",
    },
  ];

  const DetailsModal = ({ fakeData, handleClose }) => {
    return (
      <Modal
        className={"lg:!w-[40%] lg:!h-[65%]"}
        fakeData={fakeData}
        closeModal={handleClose}
      >
        <div className="flex flex-col gap-4">
          <div className="text-[#5F0006]">
            <h2 className="font-[700] text-2xl">Question Details</h2>
            <p className="text-base text-[#F18A91]">
              Detailed statistics and user feedback for this question
            </p>
          </div>

          ... (rest of the original JSX)
        </div>
      </Modal>
    );
  };

  export default DetailsModal;

*/
