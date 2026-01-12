import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../../api/authService";

const ResetPasswordOtp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = [
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
  ];

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    // Focus last filled input or next empty
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs[lastIndex].current?.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter complete 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const email = localStorage.getItem("resetEmail");

      if (!email) {
        toast.error("Email not found. Please start from beginning.");
        navigate("/forgot-password");
        return;
      }

      const response = await authService.verifyOtp(email, code);

      if (response.success) {
        toast.success("Code verified! You can now reset your password.");
        navigate("/create-new-password");
      } else {
        toast.error(response.message || "Invalid code");
      }
    } catch (error) {
      toast.error(error.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResending(true);
      const email = localStorage.getItem("resetEmail");

      if (!email) {
        toast.error("Email not found. Please start from beginning.");
        navigate("/forgot-password");
        return;
      }

      const response = await authService.sendOtp(email);

      if (response.success) {
        toast.success("Code sent again to your email!");
      } else {
        toast.error(response.message || "Failed to resend code");
      }
    } catch (error) {
      toast.error(error.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4 sm:p-6 md:p-8 bg-white">
      <div className="w-full max-w-md px-6 sm:px-8 md:px-10 py-8 sm:py-10 bg-slate-200 rounded-2xl shadow-[5px_6px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-start items-center gap-6">
        <form
          onSubmit={onSubmit}
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
              Confirm your account
            </div>
            <div className="text-center text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito']">
              We have sent a code to your email. Enter the code below to confirm
              your account.
            </div>
          </div>

          {/* Code Input - OTP Boxes */}
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-gray-700 text-xs sm:text-sm font-normal font-['Poppins']">
              Code
            </div>

            {/* OTP Input Boxes */}
            <div className="self-stretch flex justify-center items-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-10 h-10 sm:w-12 sm:h-12 border border-[#F6B0B5] rounded bg-white text-neutral-900 text-xl sm:text-2xl font-semibold text-center focus:outline-none focus:ring-2 focus:ring-[#eb7c83] focus:border-[#eb7c83] transition-all"
                />
              ))}
            </div>

            {/* Resend OTP */}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm underline mt-1 disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="self-stretch px-5 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-indigo-800 rounded inline-flex justify-center items-center gap-1 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            <div className="justify-start text-white text-sm sm:text-base font-medium font-['Nunito']">
              {loading ? "Verifying..." : "Verify"}
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

export default ResetPasswordOtp;
