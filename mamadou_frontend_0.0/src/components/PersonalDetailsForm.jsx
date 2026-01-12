import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import userService from "../api/userService";

const PersonalDetailsForm = ({ isEditing = false }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch current user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        
        if (response.success) {
          // Handle ExtendedAppUserResponse structure
          const userData = response.data?.user_details || response.data;
          
          setFormData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            phone_number: userData.phone_number || "",
            newPassword: "",
            confirmPassword: ""
          });
        }
      } catch (err) {
        toast.error("Failed to load profile data");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validation
    if (isEditing) {
      if (!formData.first_name?.trim() || !formData.last_name?.trim()) {
        toast.error("First name and last name are required");
        return;
      }

      if (!formData.email?.trim()) {
        toast.error("Email is required");
        return;
      }

      // Password validation if provided
      if (formData.newPassword) {
        if (formData.newPassword.length < 8) {
          toast.error("Password must be at least 8 characters");
          return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
      }
    }

    try {
      setSaving(true);

      // Prepare update data
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number
      };

      // Only include password if it's being changed
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await userService.updateProfile(updateData);

      if (response.success) {
        toast.success("Profile updated successfully!");
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          newPassword: "",
          confirmPassword: ""
        }));

        // Update localStorage with new user info
        if (response.data?.user) {
          const userData = response.data.user;
          const userName = `${userData.first_name} ${userData.last_name}`.trim();
          localStorage.setItem('userName', userName);
        } else if (updateData.first_name || updateData.last_name) {
          const userName = `${updateData.first_name} ${updateData.last_name}`.trim();
          localStorage.setItem('userName', userName);
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const getIcon = (show) => (show ? FaEyeSlash : FaEye);

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto" />
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      <div className="flex flex-col gap-4">
        {/* First Name */}
        <div className="my-2">
          <p className="text-base mb-1.5 text-[#5F0006]">First Name</p>
          <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
            <input
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full py-2 text-gray-700 px-2 placeholder-[#f1d5d6] focus:outline-none focus:ring-0 border-none"
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="my-2">
          <p className="text-base mb-1.5 text-[#5F0006]">Last Name</p>
          <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
            <input
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full py-2 text-gray-700 px-2 placeholder-[#f1d5d6] focus:outline-none focus:ring-0 border-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <p className="text-base mb-1 text-[#5F0006]">Email</p>
          <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full py-2 text-gray-700 px-2 placeholder-[#f1d5d6] focus:outline-none focus:ring-0 border-none"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <p className="text-base mb-1 text-[#5F0006]">Phone Number</p>
          <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
            <input
              type="tel"
              name="phone_number"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full py-2 text-gray-700 px-2 placeholder-[#f1d5d6] focus:outline-none focus:ring-0 border-none"
            />
          </div>
        </div>

        {/* Password Fields (only when editing) */}
        {isEditing && (
          <>
            {/* New Password */}
            <div className="my-2">
              <p className="text-base mb-1.5 text-[#5F0006]">New Password (Optional)</p>
              <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
                <FiLock className="h-5 w-5 ml-3 text-[#f1d5d6]" />
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min 8 characters)"
                  className="w-full py-2.5 text-gray-700 px-3 placeholder-[#f1d5d6] focus:outline-none focus:ring-0 border-none bg-transparent text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="p-2 mr-1 text-[#5F0006]"
                >
                  {React.createElement(getIcon(showNew), {
                    className: "h-5 w-5",
                  })}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-base mb-1.5 text-[#5F0006]">
                Confirm New Password
              </label>
              <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
                <FiLock className="h-5 w-5 ml-3 text-[#f1d5d6]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full py-2.5 text-gray-700 px-3 placeholder-[#f1d5d6] focus:outline-none focus:ring-0 border-none bg-transparent text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="p-2 mr-1 text-[#5F0006]"
                >
                  {React.createElement(getIcon(showConfirm), {
                    className: "h-5 w-5",
                  })}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Submit Button (only when editing) */}
      {isEditing && (
        <div className="w-full flex justify-end pt-5">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1 max-h-12 min-h-10 px-8 py-3 border-[#F18A91] text-[#fff] rounded-xl font-medium text-sm sm:text-base bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
};

export default PersonalDetailsForm;