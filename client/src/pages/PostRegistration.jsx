import React, { useState } from "react";
import { 
  Shield, 
  Clock, 
  Lock, 
  Users, 
  CheckCircle2, 
  Video, 
  FileVideo,
  AlertTriangle,
  ChevronRight,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostRegistration({ userData }) {
  const navigate = useNavigate();
  const [sharingPreferences, setSharingPreferences] = useState({
    emergencyLive: false,
    incidentClips: false,
    autoApprove: false
  });
  const [showModal, setShowModal] = useState(false);

  const handleToggle = (field) => {
    setSharingPreferences(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const savePreferences = async () => {
    try {
      // API call to update user preferences
      await fetch(`/api/users/${userData.id}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sharingPreferences)
      });
      
      setShowModal(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const skipForNow = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Camera Registered Successfully! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Thank you <strong>{userData?.name}</strong> for joining SmartSuraksha
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">
              Help Make Your Area Even Safer
            </h2>
            <p className="text-indigo-100 leading-relaxed">
              Your camera is registered. Now you can optionally enable smart sharing to help
              authorities respond faster during emergencies or incidents in your locality.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Why enable smart sharing?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Faster Response</h4>
                <p className="text-sm text-gray-600">
                  Help police get crucial evidence within minutes, not days. Critical for solving crimes.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Community Safety</h4>
                <p className="text-sm text-gray-600">
                  Your footage could help catch criminals, find missing persons, or prevent future incidents.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">You Stay in Control</h4>
                <p className="text-sm text-gray-600">
                  Every request needs your approval. You decide when and what to share. No surprises.
                </p>
              </div>
            </div>

            {/* Sharing Options */}
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Choose your sharing preferences
            </h3>

            <div className="space-y-4 mb-8">
              {/* Option 1: Emergency Live Access */}
              <div className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Video className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-gray-900">
                        Emergency Live Access
                      </h4>
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                        High Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Allow police to request live feed during active emergencies (robbery, accident, 
                      riots, missing person search) happening near your camera.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        You receive instant notification before access
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Time-limited access (max 30 minutes)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Full audit log of who accessed and when
                      </li>
                    </ul>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={sharingPreferences.emergencyLive}
                      onChange={() => handleToggle("emergencyLive")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Option 2: Incident Clips */}
              <div className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileVideo className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-gray-900">
                        Incident Clip Sharing
                      </h4>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Allow police to request recorded clips from specific time windows (e.g., 2-5 PM 
                      yesterday) for investigations.
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        You review each request with case details
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Approve or deny with one tap
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Only specific time range shared, not full archive
                      </li>
                    </ul>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={sharingPreferences.incidentClips}
                      onChange={() => handleToggle("incidentClips")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Option 3: Auto-Approve */}
              <div className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-bold text-gray-900">
                        Auto-Approve Verified Cases
                      </h4>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                        Optional
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Automatically approve requests for high-priority cases (murder, kidnapping, 
                      terrorism) to save time during critical investigations.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                      <div className="flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">
                          You'll still receive notification. Only for verified senior officials with case IDs.
                        </p>
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={sharingPreferences.autoApprove}
                      onChange={() => handleToggle("autoApprove")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy Assurance */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
              <div className="flex gap-3">
                <Lock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-indigo-900 mb-1">Your Privacy is Protected</h4>
                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li>• All data is encrypted end-to-end</li>
                    <li>• You can change these settings anytime from your dashboard</li>
                    <li>• No sharing happens without these permissions enabled</li>
                    <li>• You can revoke access instantly at any time</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={savePreferences}
                disabled={!sharingPreferences.emergencyLive && !sharingPreferences.incidentClips}
                className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-lg"
              >
                {sharingPreferences.emergencyLive || sharingPreferences.incidentClips ? (
                  <>
                    Save Preferences & Continue
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  "Enable at least one option to continue"
                )}
              </button>
              <button
                onClick={skipForNow}
                className="sm:w-auto bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Skip for now
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              You can enable these features later from Settings → Sharing Preferences
            </p>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">12,450+</p>
            <p className="text-xs text-gray-600">Cameras Registered</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-green-600">3,280+</p>
            <p className="text-xs text-gray-600">Active Sharers</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-purple-600">850+</p>
            <p className="text-xs text-gray-600">Cases Solved</p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Preferences Saved!
            </h3>
            <p className="text-gray-600 mb-4">
              Thank you for helping make your community safer. Redirecting to dashboard...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
