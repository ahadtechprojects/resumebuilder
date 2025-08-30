// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage.jsx";
import MergedAuth from "./pages/MergedAuth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import PortfolioBuilder from "./pages/PortfolioBuilder.jsx";
import CVBuilder from "./pages/CVBuilder.jsx";
import PublicPortfolio from "./pages/PublicPortfolio.jsx";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageWrapper from "./components/PageWrapper.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLandingContent from "./pages/AdminLandingContent.jsx";

export default function App() {
  return (
    <div>
      <NavBar />

      <main className="container">
        <PageWrapper />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<MergedAuth />} />
          <Route path="/p/:slug" element={<PublicPortfolio />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builder/resume/:id"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builder/portfolio/:id"
            element={
              <ProtectedRoute>
                <PortfolioBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builder/cv/:id"
            element={
              <ProtectedRoute>
                <CVBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute>
                <AdminLandingContent />
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
        />
      </main>
    </div>
  );
}
