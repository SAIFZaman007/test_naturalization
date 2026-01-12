import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import { MdOutlineCameraAlt } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState, useRef } from "react";

const ProfileSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState(
    "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const fileInputRef = useRef(null);

  // File select handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <Header
          heading={"Profile"}
          paragraph={"Manage your account settings and preferences"}
        />

        {/* Show Edit button only if path is /profile */}
        {location.pathname === "/profile" ? (
          <Link to={`/edit-profile`}>
            <button className="max-h-12 min-h-10 px-8 py-3 border-[#F18A91] text-[#fff] rounded-xl font-medium text-sm sm:text-base bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg">
              Edit
            </button>
          </Link>
        ) : (
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1 max-h-12 min-h-10 px-8 py-3 border-[#F18A91] text-[#fff] rounded-xl font-medium text-sm sm:text-base bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg"
          >
            <IoMdArrowRoundBack className="w-5" /> Back
          </button>
        )}
      </div>

      {/* <div className="relative w-24 h-24 my-4">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 shadow-lg">
          <img
            src={profileImage}
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="absolute bottom-1 right-1 flex items-center justify-center w-8 h-8 p-1 bg-white rounded-full shadow-xl cursor-pointer border border-gray-100"
          aria-label="Change profile picture"
          onClick={() => fileInputRef.current.click()}
        >
          <MdOutlineCameraAlt className="text-gray-600 w-4 h-4" />
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div> */}
    </div>
  );
};

export default ProfileSection;
