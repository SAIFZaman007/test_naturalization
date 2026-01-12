import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import authService from "../../api/authService";

const CreateNewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const email = localStorage.getItem("resetEmail");

      if (!email) {
        toast.error("Email not found. Please start from beginning.");
        navigate("/forgot-password");
        return;
      }

      const response = await authService.forgotPassword(email, data.password);

      if (response.success) {
        toast.success("Password changed successfully!");
        localStorage.removeItem("resetEmail");
        navigate("/login");
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/reset-password-otp");
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 sm:p-6 md:p-8 bg-white">
      <div className="w-full max-w-md px-6 sm:px-8 md:px-10 py-8 sm:py-10 bg-slate-200 rounded-2xl shadow-[5px_6px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-start items-center gap-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-start items-center gap-6"
        >
          {/* Logo */}
          <div className="w-32 h-28 sm:w-40 sm:h-32 md:w-44 md:h-36 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Header */}
          <div className="w-full flex flex-col justify-start items-center gap-1 px-2">
            <div className="self-stretch text-center text-neutral-900 text-xl sm:text-2xl font-bold font-['Feather']">
              Create New Password
            </div>
            <div className="text-center text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito']">
              Enter your new password to reset your account password.
            </div>
          </div>

          {/* Password Field */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-gray-700 text-xs sm:text-sm font-normal font-['Poppins']">
              Password
            </div>
            <div className="self-stretch pl-3 pr-3 py-2.5 sm:py-3 rounded border border-rose-500 inline-flex justify-between items-center gap-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="flex-1 bg-transparent text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito'] placeholder-rose-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-rose-500 hover:text-rose-600 flex-shrink-0"
              >
                {showPassword ? (
                  <IoEyeOutline size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <IoEyeOffOutline size={18} className="sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-gray-700 text-xs sm:text-sm font-normal font-['Poppins']">
              Confirm Password
            </div>
            <div className="self-stretch pl-3 pr-3 py-2.5 sm:py-3 rounded border border-rose-500 inline-flex justify-between items-center gap-2">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="flex-1 bg-transparent text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito'] placeholder-rose-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-rose-500 hover:text-rose-600 flex-shrink-0"
              >
                {showConfirmPassword ? (
                  <IoEyeOutline size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <IoEyeOffOutline size={18} className="sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="self-stretch px-5 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-indigo-800 rounded inline-flex justify-center items-center gap-1 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            <div className="justify-start text-white text-sm sm:text-base font-medium font-['Nunito']">
              {loading ? "Changing Password..." : "Change Password"}
            </div>
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="self-stretch px-5 py-3 sm:py-4 bg-stone-50 rounded inline-flex justify-center items-center gap-1 hover:bg-stone-100 transition-colors"
          >
            <div className="justify-start text-violet-600 text-sm sm:text-base font-medium font-['Nunito']">
              Back
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPassword;
