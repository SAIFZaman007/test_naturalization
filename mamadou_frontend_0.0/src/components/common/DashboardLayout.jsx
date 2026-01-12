import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

// Function to get page title from path
const getTitleFromPath = (path) => {
  switch (path) {
    case "/":
      return "Dashboard";
    case "/trade-entry":
      return "Trade Entry";
    case "/trade-log":
      return "Trade Log";
    case "/reflections":
      return "Reflections";
    default:
      return "Dashboard";
  }
};

export const DashboardLayout = () => {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen w-screen flex flex-col  overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 z-30">
        <Header title={title} onMenuClick={toggleSidebar} />
      </div>

      {/* Main Content Area with Sidebar - Critical: min-h-0 for flex overflow */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Desktop: always visible, Mobile: slide in/out */}
        <div
          className={`
            fixed md:relative inset-y-0 left-0 z-50 md:z-auto
            transform transition-transform duration-300 ease-in-out
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
            flex-shrink-0 overflow-y-auto
          `}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Scrollable Content Area - This will scroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
