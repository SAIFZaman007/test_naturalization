// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { useAuth } from "../../hooks/useAuth";
// import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
// import { GoogleLogin } from "@react-oauth/google";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);

//       // Demo login without backend
//       if (data.email === "demo@test.com" && data.password === "demo123") {
//         const mockUserData = {
//           token: "demo-token-12345",
//           user: {
//             id: "1",
//             email: data.email,
//             username: "Demo User",
//             fname: "Demo",
//             lname: "User",
//           },
//         };

//         // Save user data
//         localStorage.setItem("userName", "Demo User");
//         localStorage.setItem("authToken", mockUserData.token);
//         localStorage.setItem("user", JSON.stringify(mockUserData.user));

//         toast.success("Login successful! Welcome Demo User");
//         login(mockUserData);
//         navigate("/");
//       } else {
//         toast.error("Invalid credentials! Use demo@test.com / demo123", {
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       toast.error("Login failed. Please try again.", {
//         autoClose: 3000,
//       });
//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async () => {
//     toast.info("Google sign-in is disabled in demo mode", {
//       autoClose: 3000,
//     });
//   };

//   const handleGoogleError = () => {
//     toast.info("Google sign-in is disabled in demo mode", {
//       autoClose: 3000,
//     });
//   };

//   return (
//     <div className="min-h-screen w-full flex justify-center items-center p-4 sm:p-6 md:p-8 bg-white">
//       <div className="w-full max-w-md px-6 sm:px-8 md:px-10 py-8 sm:py-10 bg-slate-200 rounded-2xl shadow-[5px_6px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-start items-center gap-6">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="w-full flex flex-col justify-start items-center gap-6"
//         >
//           {/* Logo */}
//           <div className="w-32 h-28 sm:w-40 sm:h-32 md:w-44 md:h-36 flex items-center justify-center">
//             <img
//               src="/logo.png"
//               alt="Test Naturalisation"
//               className="w-full h-full object-contain"
//             />
//           </div>

//           {/* Welcome Text */}
//           <div className="w-full flex flex-col justify-start items-center gap-1 px-2">
//             <div className="self-stretch text-center text-neutral-900 text-xl sm:text-2xl font-bold font-['Feather']">
//               Welcome Back
//             </div>
//             <div className="text-center text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito']">
//               Sign in to access your dashboard
//             </div>
//           </div>

//           {/* Form Fields */}
//           <div className="w-full flex flex-col justify-start items-center gap-5">
//             {/* Email Input */}
//             <div className="self-stretch flex flex-col justify-start items-start gap-2">
//               <div className="self-stretch justify-start text-gray-700 text-xs sm:text-sm font-normal font-['Poppins']">
//                 Email Address
//               </div>
//               <div className="self-stretch pl-3 pr-3 py-2.5 sm:py-3 rounded border border-rose-500 inline-flex justify-start items-center gap-2">
//                 <svg
//                   className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <rect
//                     x="3.75"
//                     y="5.25"
//                     width="16.5"
//                     height="13.5"
//                     rx="1.5"
//                     stroke="#F43F5E"
//                     strokeWidth="1.5"
//                   />
//                   <path
//                     d="M3.75 8.25L12 13.5L20.25 8.25"
//                     stroke="#F43F5E"
//                     strokeWidth="1.5"
//                   />
//                 </svg>
//                 <input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   {...register("email", { required: "Email is required" })}
//                   className="flex-1 min-w-0 bg-transparent text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito'] placeholder-rose-400 focus:outline-none"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-600 text-xs">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password Input */}
//             <div className="self-stretch flex flex-col justify-start items-start gap-2">
//               <div className="self-stretch justify-start text-gray-700 text-xs sm:text-sm font-normal font-['Poppins']">
//                 Password
//               </div>
//               <div className="self-stretch pl-3 pr-3 py-2.5 sm:py-3 rounded border border-rose-500 inline-flex justify-start items-center gap-2">
//                 <svg
//                   className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <rect
//                     x="3.75"
//                     y="8.25"
//                     width="16.5"
//                     height="12.75"
//                     rx="1.5"
//                     stroke="#F43F5E"
//                     strokeWidth="1.5"
//                   />
//                   <circle
//                     cx="12"
//                     cy="14.25"
//                     r="0.75"
//                     fill="#F43F5E"
//                     stroke="#F43F5E"
//                     strokeWidth="1.5"
//                   />
//                   <path
//                     d="M12 15.75V18"
//                     stroke="#F43F5E"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                   />
//                   <path
//                     d="M8.625 8.25V4.875C8.625 3.0125 10.1375 1.5 12 1.5C13.8625 1.5 15.375 3.0125 15.375 4.875V8.25"
//                     stroke="#F43F5E"
//                     strokeWidth="1.5"
//                   />
//                 </svg>
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   {...register("password", {
//                     required: "Password is required",
//                   })}
//                   className="flex-1 min-w-0 bg-transparent text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito'] placeholder-rose-400 focus:outline-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-rose-500 hover:text-rose-600 flex-shrink-0"
//                 >
//                   {showPassword ? (
//                     <IoEyeOutline size={18} className="sm:w-5 sm:h-5" />
//                   ) : (
//                     <IoEyeOffOutline size={18} className="sm:w-5 sm:h-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-600 text-xs">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="self-stretch px-5 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-indigo-800 rounded inline-flex justify-center items-center gap-1 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
//             >
//               <div className="justify-start text-white text-sm sm:text-base font-medium font-['Nunito']">
//                 {loading ? "Logging in..." : "Log In"}
//               </div>
//             </button>
//           </div>

//           {/* Forgot Password Link */}
//           <Link
//             to="/forgot-password"
//             className="self-stretch text-center justify-start text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito'] hover:text-red-600 transition-colors"
//           >
//             Forgot password?
//           </Link>

//           {/* Demo Credentials */}
//           <div className="w-full mt-2 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <p className="text-blue-900 text-xs sm:text-sm font-semibold font-['Poppins'] mb-2">
//               🔐 Demo Login Credentials:
//             </p>
//             <div className="space-y-1 text-xs sm:text-sm font-['Nunito']">
//               <p className="text-blue-800">
//                 <span className="font-semibold">Email:</span> demo@test.com
//               </p>
//               <p className="text-blue-800">
//                 <span className="font-semibold">Password:</span> demo123
//               </p>
//             </div>
//             <button
//               type="button"
//               onClick={() => {
//                 document.getElementById("email").value = "demo@test.com";
//                 document.getElementById("password").value = "demo123";
//               }}
//               className="mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-semibold underline font-['Nunito']"
//             >
//               Click to auto-fill demo credentials
//             </button>
//           </div>

//           {/* Hidden Google Login for functionality */}
//           <div className="hidden">
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={handleGoogleError}
//             />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import api from "../../api/ApiService";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      
      // OAuth2 requires form data, not JSON
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);
      formData.append('grant_type', 'password');
      
      const response = await api.post(
        '/auth/login',
        formData,
        { 
          showToast: false,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );

      if (response.success) {
        
        const userData = {
          token: response.data.access_token || response.data.token,
          user: response.data.user || response.data,
        };

        // Save user data
        const userName = userData.user?.username || userData.user?.name || userData.user?.email || 'User';
        localStorage.setItem('userName', userName);
        
        toast.success('Login successful! Welcome back!');
        login(userData);
        navigate('/');
      } else {
        toast.error(response.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
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

          {/* Welcome Text */}
          <div className="w-full flex flex-col justify-start items-center gap-1 px-2">
            <div className="self-stretch text-center text-neutral-900 text-xl sm:text-2xl font-bold font-['Feather']">
              Welcome Back
            </div>
            <div className="text-center text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito']">
              Sign in to access your dashboard
            </div>
          </div>

          {/* Form Fields */}
          <div className="w-full flex flex-col justify-start items-center gap-5">
            {/* Email */}
            <div className="self-stretch flex flex-col gap-2">
              <div className="text-gray-700 text-xs sm:text-sm font-normal">
                Email Address
              </div>

              <div className="pl-3 pr-3 py-2.5 sm:py-3 rounded border border-rose-500 flex items-center gap-2">
               
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

            {/* Password */}
            <div className="self-stretch flex flex-col gap-2">
              <div className="text-gray-700 text-xs sm:text-sm font-normal">
                Password
              </div>

              <div className="pl-3 pr-3 py-2.5 sm:py-3 rounded border border-rose-500 flex items-center gap-2">
        

                 <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="flex-1 min-w-0 bg-transparent text-neutral-900 text-xs sm:text-sm font-normal font-['Nunito'] placeholder-rose-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-rose-500"
                >
                  {showPassword ? (
                    <IoEyeOutline size={18} />
                  ) : (
                    <IoEyeOffOutline size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-600 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 bg-gradient-to-r from-red-600 to-indigo-800 rounded text-white text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>

          {/* Forgot Password */}
          <Link
            to="/forgot-password"
            className="text-center text-xs sm:text-sm text-neutral-900 hover:text-red-600"
          >
            Forgot password?
          </Link>

          {/* Google Login Hidden */}
          {/* <div className="hidden">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
