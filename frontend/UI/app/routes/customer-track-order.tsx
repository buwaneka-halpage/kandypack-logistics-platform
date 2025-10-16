import React from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function CustomerTrackOrderPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#282F4E]">Track My Orders</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-600">Track Order page - Coming soon...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
