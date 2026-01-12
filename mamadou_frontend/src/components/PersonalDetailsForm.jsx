import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FiLock } from "react-icons/fi";

const PersonalDetailsForm = ({ isEditing = false, profile = true }) => {
  const defaultName = "Alma Lawson";
  const defaultEmail = "alma.lawson@example.com";
  const defaultOldPassword = "YourActualOldPassword";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getIcon = (show) => (show ? FaEyeSlash : FaEye);

  const handleSave = () => {
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        {/* NAME */}
        <div className="my-4">
          <p className="text-base md:mb-1.5 mb-1 text-[#5F0006] ">Name</p>
          <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
            <input
              type="text"
              placeholder="Type your name"
              value={isEditing ? name : defaultName}
              onChange={(e) => setName(e.target.value)}
              readOnly={!isEditing}
              className="w-full py-2 text-gray-700 px-2 placeholder-[#f1d5d6] focus:outline-none focus:ring-0 border-none"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <p className="text-base mb-1 text-[#5F0006]">Email</p>
          <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
            <input
              type="text"
              placeholder="Enter your email"
              value={isEditing ? email : defaultEmail}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!isEditing}
              className="w-full py-2 text-gray-700 px-2 placeholder-[#f1d5d6] focus:outline-none focus:ring-0 border-none"
            />
          </div>
        </div>

        {/* OLD PASSWORD → Profile page only */}
        {/* {profile && !isEditing && (
          <div className="my-4">
            <p className="text-base md:mb-1.5 mb-1 text-[#5F0006]">Old Password</p>
            <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
              <FiLock className="h-5 w-5 ml-3 " />
              <input
                type={showOld ? "text" : "password"}
                name="old-password"
                value={defaultOldPassword}
                readOnly
                className="w-full py-2.5 text-gray-700 px-3 placeholder-[#f1d5d6] focus:outline-none focus:ring-0 border-none bg-transparent text-base"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="p-2 mr-1  text-[#5F0006]"
              >
                {React.createElement(getIcon(showOld), {
                  className: "h-5 w-5",
                })}
              </button>
            </div>
          </div>
        )} */}

        {/* NEW + CONFIRM PASSWORD → Editing page only */}
        {isEditing && (
          <>
            NEW PASSWORD
            <div className="my-4">
              <p className="text-base md:mb-1.5 mb-1 text-[#5F0006]">New Password</p>
              <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
                <FiLock className="h-5 w-5 ml-3 text-[#f1d5d6]" />
                <input
                  type={showNew ? "text" : "password"}
                  name="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-base md:mb-1.5 mb-1 text-[#5F0006]">
                Confirm New Password
              </label>
              <div className="flex items-center w-full bg-white rounded-lg border border-[#EB545E] shadow-sm">
                <FiLock className="h-5 w-5 ml-3 text-[#f1d5d6] " />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm-new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

      {/* SAVE BUTTON */}
      {/* {isEditing && (
        <div className="w-full flex justify-end pt-5">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 max-h-12 min-h-10 px-8 py-3 border-[#F18A91] text-[#fff] rounded-xl font-medium text-sm sm:text-base bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg"
          >
            Save
          </button>
        </div>
      )} */}
    </div>
  );
};

export default PersonalDetailsForm;
