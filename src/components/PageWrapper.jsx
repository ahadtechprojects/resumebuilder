// src/components/PageWrapper.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function PageWrapper({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show spinner whenever location (route) changes
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000); // ⏳ 2s delay
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
