import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Demo behavior: Just show toast
      toast.success(`Password reset link sent to ${data.email} (Demo Mode)`, {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to send reset link. Try again.", {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
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
              alt="Test Naturalisation"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Header Text */}
          <div className="w-full flex flex-col justify-start items-center gap-1 px-2">
            <div className="self-stretch text-center text-neutral-900 text-xl sm:text-2xl font-bold font-['Feather']">
              Forgot Password
            </div>
            <div className="text-center text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito']">
              Enter your email to receive a reset link
            </div>
          </div>

          {/* Email Input */}
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-gray-700 text-xs sm:text-sm font-normal font-['Poppins']">
              Email Address
            </div>
            <div className="self-stretch pl-3 pr-3 py-2.5 sm:py-3 rounded border border-rose-500 inline-flex justify-start items-center gap-2">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3.75"
                  y="5.25"
                  width="16.5"
                  height="13.5"
                  rx="1.5"
                  stroke="#F43F5E"
                  strokeWidth="1.5"
                />
                <path
                  d="M3.75 8.25L12 13.5L20.25 8.25"
                  stroke="#F43F5E"
                  strokeWidth="1.5"
                />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="flex-1 min-w-0 bg-transparent text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito'] placeholder-rose-400 focus:outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="self-stretch px-5 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-indigo-800 rounded inline-flex justify-center items-center gap-1 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            <div className="justify-start text-white text-sm sm:text-base font-medium font-['Nunito']">
              {loading ? "Sending..." : "Send Reset Link"}
            </div>
          </button>

          {/* Back to Login Link */}
          <Link
            to="/login"
            className="self-stretch text-center justify-start text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito'] hover:text-red-600 transition-colors"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
