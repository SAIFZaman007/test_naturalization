




import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import { HiMenuAlt2 } from "react-icons/hi";
import { Link } from "react-router-dom";

const LogoIcon = () => (
  <Link to ='/' className="w-14 md:w-16 h-14 md:h-16 flex items-center justify-center">
    <img
      src="/logo.png"
      alt="MyLedger Logo"
      className="w-full h-full object-contain"
    />
  </Link>
);

export const Header = ({ onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // const handleAvatarClick = () => fileInputRef.current.click();

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setProfileImage(imageUrl);
  //   }
  // };

  return (
    <header className="w-full px-4 sm:px-6 md:px-8 py-2 border-b bg-white border-[#F6B0B5] flex justify-between items-center gap-4">
      {/* Left: Mobile Menu & Logo */}
      <div className="flex items-center flex-1 md:flex-none gap-2">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-black font-bold transition-colors p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <HiMenuAlt2 className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>
        {/* <LogoIcon /> */}
      </div>

      {/* Right: User Profile */}
      {/* <div className="relative flex items-center gap-3" ref={dropdownRef}>
        <div
          className="bg-[#000091] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden"
          onClick={handleAvatarClick}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <BiUser className="text-white w-5 h-5 md:w-6 md:h-6" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

       
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={toggleDropdown}
        >
          <div className="flex flex-col leading-tight text-[#121111]">
            <p className="text-sm md:text-base font-semibold">ImranMTS</p>
            <p className="text-xs md:text-sm font-normal">Super Admin</p>
          </div>
        
        </div>

        
      </div> */}
    </header>
  );
};
 