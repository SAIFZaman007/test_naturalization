import { useContext, useState, useEffect } from "react";
import { CiSettings } from "react-icons/ci";
import { MdOutlineLogout } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import userService from "../api/userService";

const AdminProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        
        if (response.success) {
          // Handle ExtendedAppUserResponse structure
          const userData = response.data?.user_details || response.data;
          setProfileData(userData);
          
          // Store in localStorage for quick access
          if (userData) {
            const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            if (fullName) {
              localStorage.setItem('userName', fullName);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogoutClick = () => {
    logout();
  };

  // Get name from profile data
  const displayName = profileData
    ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() ||
      profileData.email?.split('@')[0] ||
      "User"
    : localStorage.getItem('userName') || user?.name || "User";

  const profilePicture = profileData?.profile_image || user?.profilePic;
  
  // Get initials for avatar
  const getInitials = (name) => {
    if (!name || name === "User") return "U";
    const nameParts = name.split(' ').filter(Boolean);
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-1 my-3">
        <div className="w-20 h-20 rounded-full bg-gray-700 animate-pulse" />
        <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mt-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 my-3">
      {/* Profile Picture */}
      <div className="flex items-center justify-center rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-700">
        {profilePicture && profilePicture !== 'null' && profilePicture !== '' ? (
          <img
            src={profilePicture}
            alt={displayName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <span class="text-white text-2xl font-bold">
                    ${getInitials(displayName)}
                  </span>
                `;
              }
            }}
          />
        ) : (
          <span className="text-white text-2xl font-bold">
            {getInitials(displayName)}
          </span>
        )}
      </div>

      {/* Name - Display actual name from database */}
      <h1 className="text-white text-lg font-normal text-center my-1 px-2">
        {displayName}
      </h1>

      {/* Action Buttons */}
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