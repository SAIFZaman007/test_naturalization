import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { isValidProfilePic, getUserInitials } from "../../utils/profileUtils";
import userService from "./../../api/userService";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCalendarOutline,
  IoShieldCheckmarkOutline,
  IoCameraOutline,
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        if (response.success) {
          setProfileData(response.data);
          // Update AuthContext with fresh data from backend
          updateUser({
            ...response.data,
            name: `${response.data.fname} ${response.data.lname}`,
          });
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Handle file selection
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setUploadSuccess(false);

      const response = await userService.updateProfilePhoto(file);

      if (response.success) {
        const updatedProfilePic = response.data.profilePic;

        setProfileData((prev) => ({
          ...prev,
          profilePic: updatedProfilePic,
        }));

        updateUser({ profilePic: updatedProfilePic });

        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
        toast.success("Profile photo uploaded successfully!");
      }
    } catch (err) {
      const errorMessage = err.message || err.error || "Failed to upload photo";

      if (errorMessage === "Route not found") {
        toast.error(
          "The photo upload endpoint is not yet available on the backend."
        );
      } else {
        toast.error(`Upload failed: ${errorMessage}`);
      }
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
      fileInputRef.current.value = "";
      }
    }
  };

  // Handle delete photo
  const handleDeletePhoto = async () => {
    setShowDeleteModal(true);
  };

  // Confirm delete photo
  const confirmDeletePhoto = async () => {
    try {
      setUploading(true);
      setShowDeleteModal(false);
      const response = await userService.deleteProfilePhoto();

      if (response.success) {
        // Update profile data to remove photo
        setProfileData((prev) => ({
          ...prev,
          profilePic: null,
        }));

        // Update AuthContext and localStorage
        updateUser({ profilePic: null });

        toast.success("Profile photo removed successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete photo");
    } finally {
      setUploading(false);
    }
  };

  const fullName = profileData
    ? profileData.username ||
      localStorage.getItem("userName") ||
      `${profileData.fname || ""} ${profileData.lname || ""}`.trim() ||
      user?.username ||
      user?.name ||
      "User Name"
    : user?.username ||
      user?.name ||
      localStorage.getItem("userName") ||
      "User Name";

  const email = profileData?.email || user?.email || "email@example.com";
  const isVerified = profileData?.isVerified ?? true;
  const memberSince = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div className="">
        <h1 className="text-white text-2xl xl:text-3xl font-bold font-['Poppins'] mb-2">
          My Profile
        </h1>
        <p className="text-white/60 text-sm font-normal font-['Poppins']">
          Manage your account information and settings
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header Section with Avatar */}
        <div className="relative bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 p-8 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white/10 overflow-hidden">
                {isValidProfilePic(profileData?.profilePic) ? (
                  <img
                    src={profileData.profilePic}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const initials = getUserInitials(fullName);
                      e.target.outerHTML = `<span class="text-white text-5xl font-bold font-['Poppins']">${initials}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-white text-5xl font-bold font-['Poppins']">
                    {getUserInitials(fullName)}
                  </span>
                )}
              </div>

              {/* Upload/Delete Photo Buttons */}
              <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-50"
                  title="Upload Photo"
                >
                  <IoCameraOutline className="text-white w-5 h-5" />
                </button>
                {isValidProfilePic(profileData?.profilePic) && (
                  <button
                    onClick={handleDeletePhoto}
                    disabled={uploading}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Remove Photo"
                  >
                    <IoCloseCircleOutline className="text-white w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Upload Status Indicator */}
              {uploading && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white/20 flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {uploadSuccess && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white/20 flex items-center justify-center animate-bounce">
                  <IoCheckmarkCircleOutline className="text-white w-4 h-4" />
                </div>
              )}
              {!uploading && !uploadSuccess && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white/20 flex items-center justify-center">
                  <IoShieldCheckmarkOutline className="text-white w-4 h-4" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-white text-xl lg:text-2xl font-bold font-['Poppins'] mb-2">
                {fullName}
              </h2>
              <p className="text-white/70 text-sm xl:text-base font-normal font-['Poppins'] mb-4">
                {email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-violet-600/30 text-violet-300 text-xs font-medium rounded-full border border-violet-500/30">
                  Active Account
                </span>
                {isVerified && (
                  <span className="px-3 py-1 bg-amber-600/30 text-amber-300 text-xs font-medium rounded-full border border-amber-500/30">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="p-4 lg:p-8">
          <h3 className="text-white text-xl font-semibold font-['Poppins'] mb-6">
            Account Information
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Name Field */}
            <div className="group sm:p-5 p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="sm:w-12 w-9 h-9 sm:h-12 bg-gradient-to-br from-violet-600/40 to-violet-700/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <IoPersonOutline className="text-violet-300 w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs font-medium font-['Poppins'] uppercase tracking-wider mb-1">
                    Full Name
                  </p>
                  <p className="text-white text-sm  font-semibold font-['Poppins'] truncate">
                    {fullName}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="group sm:p-5 p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="sm:w-12 w-9 h-9 sm:h-12 bg-gradient-to-br from-amber-500/40 to-amber-600/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <IoMailOutline className="text-amber-300 w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs font-medium font-['Poppins'] uppercase tracking-wider mb-1">
                    Email Address
                  </p>
                  <p className="text-white text-sm  whitespace-nowrap font-semibold font-['Poppins'] overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="group sm:p-5 p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="sm:w-12 w-9 h-9 sm:h-12 bg-gradient-to-br from-emerald-500/40 to-emerald-600/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <IoCalendarOutline className="text-emerald-300 w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs font-medium font-['Poppins'] uppercase tracking-wider mb-1">
                    Member Since
                  </p>
                  <p className="text-white text-sm  font-semibold font-['Poppins']">
                    {memberSince}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="group sm:p-5 p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="sm:w-12 w-9 h-9 sm:h-12 bg-gradient-to-br from-green-500/40 to-green-600/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <IoShieldCheckmarkOutline className="text-green-300 w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs font-medium font-['Poppins'] uppercase tracking-wider mb-1">
                    Account Status
                  </p>
                  <p
                    className={`text-sm  font-semibold font-['Poppins'] ${
                      isVerified ? "text-green-400" : "text-amber-400"
                    }`}
                  >
                    {isVerified ? "Active & Verified" : "Active"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="lg:px-8 px-4 pb-4 lg:pb-8">
          <div className="p-6 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-violet-600/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white text-base font-semibold font-['Poppins'] mb-2">
                  Profile Settings
                </h4>
                <p className="text-white/60 text-xs sm:text-sm font-normal font-['Poppins'] leading-relaxed">
                  Additional profile customization options and security settings
                  will be available soon. Keep your account information up to
                  date for the best experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl shadow-2xl border border-white/20 max-w-md w-full overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-600/30 rounded-xl flex items-center justify-center">
                  <IoWarningOutline className="text-red-400 w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold font-['Poppins']">
                    Remove Profile Photo
                  </h3>
                  <p className="text-white/60 text-sm font-normal font-['Poppins']">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-white/80 text-base font-normal font-['Poppins'] leading-relaxed">
                Are you sure you want to remove your profile photo? Your profile
                will display your initials instead.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold font-['Poppins'] transition-all duration-300 border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePhoto}
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl text-white font-semibold font-['Poppins'] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Removing..." : "Remove Photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
