import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import authService from "../../api/authService";

const VerifyOtp = () => {
  const { handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));

  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // focus next input
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const onSubmit = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const email = localStorage.getItem("signupEmail");

      if (!email) {
        toast.error("Email not found. Please start from beginning.");
        navigate("/email-verification");
        return;
      }

      const response = await authService.verifyOtp(email, code);

      if (response.success) {
        toast.success("Verification successful!");
        navigate("/create-password");
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
      const email = localStorage.getItem("signupEmail");

      if (!email) {
        toast.error("Email not found. Please start from beginning.");
        navigate("/email-verification");
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

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center items-center p-3 sm:p-5"
      style={{ backgroundColor: "#0D061A" }}
    >
      <div
        className="w-full max-w-[600px] p-6 sm:p-10 md:p-16 lg:p-20 rounded-[20px] backdrop-blur-[200px] inline-flex justify-center items-center gap-2.5"
        style={{ backgroundColor: "#1B0C33" }}
      >
        <div className="flex-1 inline-flex flex-col justify-start items-center gap-12">
          {/* Header */}
          <div className="self-stretch flex flex-col justify-start items-center gap-3">
            <div className="text-center text-white text-4xl font-semibold font-['Lato'] leading-[60px]">
              Confirm your Gmail
            </div>
            <div className="text-center text-white text-xl font-normal font-['Open_Sans'] leading-loose">
              We have sent a code to your email. Enter your code to confirm your
              account.
            </div>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center text-white text-xl font-bold bg-white/10 border border-rose-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
            ))}
          </div>

          {/* Resend OTP */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="text-violet-400 hover:text-violet-300 text-sm underline mt-2 disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>

          {/* Verify Button */}
          <button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            disabled={loading}
            className="self-stretch px-6 py-3 bg-violet-600 rounded-[65px] inline-flex justify-center items-center gap-2 hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center text-white text-base font-semibold font-['Lato'] leading-normal">
              {loading ? "Verifying..." : "Verify"}
            </div>
          </button>

          {/* Sign In */}
          <div className="self-stretch inline-flex justify-center items-center gap-2">
            <div className="text-center text-white text-base font-normal font-['Open_Sans'] leading-normal">
              Have an account already?
            </div>
            <button
              onClick={handleSignIn}
              className="text-violet-600 text-base font-normal font-['Open_Sans'] underline hover:text-violet-500"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
