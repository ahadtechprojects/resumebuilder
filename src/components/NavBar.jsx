// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import { Menu, X } from "lucide-react"; // hamburger & close icons

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/"); 
    }, 1500);
  };

  return (
    <>
      <header className="no-print sticky top-0 bg-blue-500 shadow z-20 w-full">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-3">
          {/* Brand */}
          <Link to="/" className="font-bold uppercase text-white text-2xl">
            Resume Builder
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-4 items-center">
            {user && (
              <Link
                to="/dashboard"
                className="border p-2 rounded-lg bg-white text-black hover:bg-gray-100 transition"
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admindashboard"
                className="border p-2 rounded-lg bg-white text-black hover:bg-gray-100 transition"
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Login / Sign Up
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav menu */}
        {mobileOpen && (
          <div className="md:hidden bg-blue-500 px-6 pb-4 flex flex-col gap-2">
            {user && (
              <Link
                to="/dashboard"
                className="border p-2 rounded-lg bg-white text-black hover:bg-gray-100 transition"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admindashboard"
                className="border p-2 rounded-lg bg-white text-black hover:bg-gray-100 transition"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setMobileOpen(false)}
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity">
          Logged out successfully!
        </div>
      )}
    </>
  );
}
