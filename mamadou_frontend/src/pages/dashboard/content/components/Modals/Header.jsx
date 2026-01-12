
import { Link, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: "Themes", path: "/content/themes" },
    { name: "Lesson", path: "/content/lesson" },
    { name: "Questions", path: "/content/questions" },
    // { name: "Revision Sheets", path: "/content/revision-sheets" },
    // { name: "Mock Exams", path: "/content/mock-exams" },
  ];

  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollAmount = 200; // Scroll px per click

  const handleScroll = (direction) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const updateArrows = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateArrows);
      updateArrows();
    }
    return () => {
      if (container) container.removeEventListener("scroll", updateArrows);
    };
  }, []);

  const ArrowButton = ({ direction, onClick, isVisible }) => (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 p-1.5 z-10 transition-opacity flex items-center justify-center 
                  text-[#7C0008]  rounded-full   h-8 w-8 focus:outline-none 
                  ${direction === "prev" ? "-left-4" : "-right-4  "}
                  ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"} md:hidden`}
      aria-label={direction === "prev" ? "Scroll Left" : "Scroll Right"}
    >
      {direction === "prev" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          strokeLinejoin="round"
          className="lucide lucide-chevron-left w-6 h-6 text-[#7C0008]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          strokeLinejoin="round"
          className="lucide lucide-chevron-right w-6 h-6 text-[#7C0008]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      )}
    </button>
  );

  return (
    <div className="   pb-5 relative">
      <div className="">

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Content Management
        </h1>
        <p className="text-red-500 text-base pt-1">
          Manage themes, questions, revision sheets, and media
        </p>


      </div>
      {/* Tabs with Arrows */}
      <div className="relative w-full px-2 md:px-0 mt-6 ">
        <ArrowButton
          direction="prev"
          onClick={() => handleScroll("left")}
          isVisible={showLeftArrow}
        />
        <ArrowButton
          direction="next"
          onClick={() => handleScroll("right")}
          isVisible={showRightArrow}
        />

        <div
          ref={tabsContainerRef}
          className="md:inline-flex overflow-x-auto scrollbar-hide flex gap-2 bg-[#fce6e7]  px-3 py-2 rounded-lg md:rounded-xl shadow-inner scroll-smooth "
        >
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${currentPath.startsWith(tab.path) ||
                  (tab.path === "/content/themes" && currentPath === "/content")
                  ? "bg-white shadow-md ring-2 ring-red-300 text-red-700"
                  : "bg-transparent hover:bg-red-100/70 text-gray-700"
                }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
