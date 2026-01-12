import React from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export const AuthLayout = ({
  title,
  subtitle,
  children,
  onSubmit,
  submitButtonText,
  footerText,
  footerLink,
  footerLinkText,
}) => {
  return (
    <div className="min-h-screen  flex justify-center items-center p-4">
      <div className="w-full max-w-[600px] p-8 sm:p-12 md:p-16 bg-brand-glass rounded-[20px] border border-white/10">
        <div className="w-full flex flex-col items-center gap-8">
          <div className="w-full flex flex-col items-center gap-3">
            <h1 className="w-full text-center text-white text-4xl font-semibold font-lato">
              {title}
            </h1>
            <p className="w-full text-center text-white/80 text-xl font-normal font-sans">
              {subtitle}
            </p>
          </div>

          <form onSubmit={onSubmit} className="w-full flex flex-col gap-7">
            {children}
            <button
              type="submit"
              className="w-full mt-4 px-6 py-4 bg-brand-primary text-white rounded-[65px] text-base font-semibold font-lato transition-colors duration-300 hover:bg-brand-primary-hover"
            >
              {submitButtonText}
            </button>
          </form>

          <div className="w-full flex justify-center items-center gap-3">
            <div className="w-full h-px bg-neutral-600"></div>
            <span className="text-center text-white/80 text-base font-sans whitespace-nowrap">
              Or sign in with
            </span>
            <div className="w-full h-px bg-neutral-600"></div>
          </div>

          <button className="w-full px-6 py-4 bg-white text-gray-800 rounded-[100px] flex justify-center items-center gap-4 shadow-lg transition-colors duration-300 hover:bg-gray-100">
            <FcGoogle size={24} />
            <span className="font-semibold font-lato">
              Continue with Google
            </span>
          </button>

          <div className="w-full text-center">
            <span className="text-white/80 text-base font-sans">
              {footerText}{" "}
            </span>
            <Link
              to={footerLink}
              className="text-violet-500 text-base font-sans underline hover:text-violet-400"
            >
              {footerLinkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
