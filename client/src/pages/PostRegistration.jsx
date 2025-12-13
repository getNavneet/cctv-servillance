import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostRegistration({ userData }) {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/VideoSharingPreferences");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
      <div className="text-center p-6 bg-white rounded-2xl shadow-md">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Thank You, {userData?.name}! 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your camera is registered successfully.
        </p>
        <button
          onClick={goToDashboard}
          className="bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Please setup the video sharing preferences
        </button>
      </div>
    </div>
  );
}
