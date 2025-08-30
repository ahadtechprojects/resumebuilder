// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Globe,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const nav = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    cvs: 0,
    portfolios: 0,
    publicPortfolios: 0,
  });
  const [loading, setLoading] = useState(true);

  // Sidebar items
  const sidebarItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, route: "/admindashboard" },
    { label: "Manage Content", icon: <FileText size={20} />, route: "/admin/content" },
    { label: "Users", icon: <Users size={20} />, route: "/admin/users" },
    { label: "Settings", icon: <Globe size={20} />, route: "/admin/settings" },
  ];

  // Fetch stats from Firestore
  useEffect(() => {
    async function fetchStats() {
      try {
        // Users count
        const usersSnap = await getDocs(collection(db, "users"));
        const usersCount = usersSnap.size;

        // All CVs count
        const cvsSnap = await getDocs(collection(db, "cvs"));
        const cvsCount = cvsSnap.size;

        // Portfolios count (type = portfolio)
        const portfolioSnap = await getDocs(
          query(collection(db, "cvs"), where("type", "==", "portfolio"))
        );
        const portfolioCount = portfolioSnap.size;

        // Public portfolios
        const publicPortSnap = await getDocs(
          query(collection(db, "cvs"), where("type", "==", "portfolio"), where("public", "==", true))
        );
        const publicPortfolioCount = publicPortSnap.size;

        setStats({
          users: usersCount,
          cvs: cvsCount,
          portfolios: portfolioCount,
          publicPortfolios: publicPortfolioCount,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    nav("/auth");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-lg flex flex-col">
        <div className="p-6 font-bold text-xl text-primary-dark">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => nav(item.route)}
              className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 border-t hover:bg-gray-50 text-red-500"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Dashboard Overview
        </h1>

        {loading ? (
          <p>Loading stats...</p>
        ) : (
          <div className="grid sm:grid-col-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <Users className="text-blue-600 mb-2" />
              <h2 className="text-2xl font-bold">{stats.users}</h2>
              <p className="text-gray-500">Total Users</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <FileText className="text-green-600 mb-2" />
              <h2 className="text-2xl font-bold">{stats.cvs}</h2>
              <p className="text-gray-500">Total CVs</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <LayoutDashboard className="text-purple-600 mb-2" />
              <h2 className="text-2xl font-bold">{stats.portfolios}</h2>
              <p className="text-gray-500">Portfolios</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
              <Globe className="text-orange-600 mb-2" />
              <h2 className="text-2xl font-bold">{stats.publicPortfolios}</h2>
              <p className="text-gray-500">Public Portfolios</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
