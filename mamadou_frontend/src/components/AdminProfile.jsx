import { useContext } from "react";
import { CiSettings } from "react-icons/ci";
import { MdOutlineLogout } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const AdminProfile = () => {
  const { logout } = useContext(AuthContext);
  const handleLogoutClick = () => {
    logout();
  };

  return (
    <div className="flex flex-col items-center gap-1 my-3">
      <div className="flex items-center justify-center rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-gray-50">
        <div className="w-16 h-16  md:w-20 md:h-20 flex-shrink-0  rounded-ful">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <h1 className="text-white text-lg font-normal text-center my-1">
        Floyd Miles
      </h1>

      <div className="flex gap-3">
        <Link to="/profile" className="hover:opacity-70 transition-opacity">
          <CiSettings className="text-white w-6 h-6" />
        </Link>

        <button
          onClick={handleLogoutClick}
          className="hover:opacity-70 transition-opacity"
        >
          <MdOutlineLogout className="text-white w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
