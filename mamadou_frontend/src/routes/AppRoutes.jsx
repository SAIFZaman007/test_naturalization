import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layout and Guard
import MainLayout from "../components/common/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPasswordOtp from "../pages/auth/ResetPasswordOtp";
import CreateNewPassword from "../pages/auth/CreateNewPassword";
import DashboardOverView from "../pages/dashboard/dashboardOverview/DashboardOverView";
import UserView from "./../pages/dashboard/user/UserView";
import AnalyticsView from "../pages/dashboard/analytics/AnalyticsView";
import SystemView from "./../pages/dashboard/system/SystemView";
import Reflections from "../pages/dashboard/Reflections";
import ProfileView from "../pages/dashboard/profile/ProfileView";
import EditProfile from "../pages/dashboard/edit_profile/EditProfile";
import Content from "../pages/dashboard/content/Content";
import Lesson from "../pages/dashboard/content/components/Lesson/Lesson";

const AppRouter = () => {
  const { user } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          element: <MainLayout />,
          children: [
            { index: true, element: <DashboardOverView /> },
            { path: "user", element: <UserView /> },
            {
              path: "content/*",
              element: <Content />,
              children: [{ path: "lesson", element: <Lesson /> }],
            },
            { path: "analytics", element: <AnalyticsView /> },
            { path: "lesson", element: <Reflections /> },
            { path: "system", element: <SystemView /> },
            { path: "profile", element: <ProfileView /> },
            { path: "edit-profile", element: <EditProfile /> },
          ],
        },
      ],
    },

    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/signup",
      element: user ? <Navigate to="/" /> : <Signup />,
    },
    {
      path: "/verify-otp",
      element: user ? <Navigate to="/" /> : <VerifyOtp />,
    },
    {
      path: "/forgot-password",
      element: user ? <Navigate to="/" /> : <ForgotPassword />,
    },
    {
      path: "/reset-password-otp",
      element: user ? <Navigate to="/" /> : <ResetPasswordOtp />,
    },
    {
      path: "/create-new-password",
      element: user ? <Navigate to="/" /> : <CreateNewPassword />,
    },

    {
      path: "*",
      element: <div>404 - Page Not Found</div>,
    },
  ]);

  return <RouterProvider router={router} />;
};

export const AppRoutes = () => {
  return <AppRouter />;
};
