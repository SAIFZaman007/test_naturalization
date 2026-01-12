import { NavLink } from "react-router-dom";
import { FaChartLine } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { TbUsers } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
import { IoIosPaper } from "react-icons/io";
import AdminProfile from "../AdminProfile";

const navLinks = [
  { to: "/", text: "Dashboard", icon: LuLayoutDashboard },
  { to: "/user", text: "User", icon: TbUsers },
  { to: "/content", text: "Content", icon: IoIosPaper },
  { to: "/analytics", text: "Analytics", icon: FaChartLine },
  { to: "/system", text: "System", icon: CiSettings },
];

export const Sidebar = ({ isOpen, setIsSidebarOpen, onClose }) => {
  const baseStyle =
    "w-full px-3 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-6 transition-all duration-200 h-14 md:h-16 text-sm md:text-base";

  const activeStyle =
    "bg-gradient-to-r from-[#E1000F] via-[#942F73] to-[#3333A7] shadow-[0px_20px_50px_0px_rgba(55,69,87,0.10)] text-white rounded-lg";

  const inactiveStyle =
    "text-zinc-400 hover:bg-neutral-700/30 rounded-lg";

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-black border-r border-t border-t-[#858484] flex flex-col overflow-y-auto
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:w-[250px] w-70`}
      >
        {/* Mobile Close Button */}
        <div className="flex justify-end lg:hidden mt-3 px-3">
          <button
            className="text-2xl text-neutral-400 p-2 rounded-md hover:bg-neutral-700/30 transition"
            onClick={() => setIsSidebarOpen(false)}
          >
            <RxCross2 />
          </button>
        </div>

        {/* Profile */}
        <div className="lg:hidden block">
          <AdminProfile />
        </div>
        <div className="hidden lg:block">
          <AdminProfile />
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col mt-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
                }
              >
                {({ isActive }) => {
                  const color = isActive ? "text-white" : "text-white";
                  return (
                    <>
                      <Icon
                        className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 ${color}`}
                      />
                      <span className={`font-['Poppins'] ${color}`}>
                        {link.text}
                      </span>
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};









