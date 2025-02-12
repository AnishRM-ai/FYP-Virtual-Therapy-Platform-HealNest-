import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Forgotpassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import VerifyEmail from "./pages/verifyEmail";
import RoleSelection from "./pages/RoleSelection";
import { colors, CssBaseline, GlobalStyles } from "@mui/material";
import ClientDashboardPage from "./pages/ClientDashboard.jsx";
import TherapistDashboardPage from "./pages/Therapistdashboard.jsx";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore.js";
import CircularProgress from '@mui/material/CircularProgress';
import OnboardingFlow from "./pages/onboardingtherapist";
import AppointmentBooking from "./pages/booking.jsx";

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  // Redirect based on role if authenticated and verified
  if (isAuthenticated) {
    if (user.isVerified) {
      switch (user.role) {
        case "client":
          return <Navigate to="/client-dashboard" replace />;
        case "therapist":
          return <Navigate to="/therapist-dashboard" replace />;
        case "admin":
          return <Navigate to="/admin-dashboard" replace />;
        default:
          return <Navigate to="/select-role" replace />; // Handle unexpected roles
      }
    } else {
      // Redirect to email verification if not verified
      return <Navigate to="/verify-email" replace />;
    }
  }

  // If not authenticated, render children
  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Router>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            background: "#6FE8B1",
          },
          "#root": {
            width: "100%",
            height: "100%",
          },
        }}
      />
      <Routes>
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signin"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/therapist/onboarding" element={<OnboardingFlow />} />
        <Route path="/booking" element={<AppointmentBooking />} />

        <Route
          path="/select-role"
          element={
            <RedirectAuthenticatedUser>
              <RoleSelection />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/client-dashboard"
          element={
            <RedirectAuthenticatedUser>
              <ClientDashboardPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/therapist-dashboard"
          element={
            <RedirectAuthenticatedUser>
              <TherapistDashboardPage />
            </RedirectAuthenticatedUser>
          }
        />
        {/* Fallback route for unknown paths */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;