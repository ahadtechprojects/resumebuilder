import React from "react";
import { FileText } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
      <FileText className="w-16 h-16 text-indigo-600 animate-spin-slow" />
    </div>
  );
}
