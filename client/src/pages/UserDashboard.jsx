import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  MapPin,
  Edit2,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Settings,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cameraType: "",
    coverageArea: "",
  });

  const [sharingPreferences, setSharingPreferences] = useState({
    emergencyLive: false,
    incidentClips: false,
    autoApprove: false,
  });

  const [notification, setNotification] = useState({ type: "", message: "" });

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Replace with actual user ID from auth context
      const userId = localStorage.getItem("userId"); // or get from auth context
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          cameraType: data.user.cameraType || "",
          coverageArea: data.user.coverageArea || "",
        });
        setSharingPreferences({
          emergencyLive: data.user.preferences?.emergencyLive || false,
          incidentClips: data.user.preferences?.incidentClips || false,
          autoApprove: data.user.preferences?.autoApprove || false,
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      showNotification("error", "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePreferenceToggle = (field) => {
    setSharingPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 4000);
  };

  const handleUpdate = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          preferences: sharingPreferences,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setEditMode(false);
        showNotification("success", "Profile updated successfully!");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Update error:", error);
      showNotification("error", "Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation.toLowerCase() !== "delete") {
      showNotification("error", "Please type DELETE to confirm");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("userId");
        showNotification("success", "Account deleted successfully");
        setTimeout(() => navigate("/"), 2000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("error", "Failed to delete account");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your camera & preferences</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification.message && (
        <div className="max-w-6xl mx-auto px-5 pt-4">
          <div
            className={`rounded-xl px-4 py-3 border flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Camera Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sharing Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {sharingPreferences.emergencyLive || sharingPreferences.incidentClips
                    ? "Enabled"
                    : "Disabled"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Requests</p>
                <p className="text-lg font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                      cameraType: user.cameraType || "",
                      coverageArea: user.coverageArea || "",
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="p-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              {editMode ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-900">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-lg">{user?.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              {editMode ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-900">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-lg">{user?.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              {editMode ? (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-900">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-lg">{user?.phone}</span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Camera Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Camera Type
                </label>
                {editMode ? (
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.cameraType}
                      onChange={handleInputChange("cameraType")}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="">Select type</option>
                      <option value="dome">Dome Camera</option>
                      <option value="bullet">Bullet Camera</option>
                      <option value="ptz">PTZ Camera</option>
                      <option value="ip">IP Camera</option>
                      <option value="analog">Analog Camera</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-900">
                    <Camera className="w-5 h-5 text-gray-400" />
                    <span className="text-lg">
                      {user?.cameraType
                        ? user.cameraType.charAt(0).toUpperCase() + user.cameraType.slice(1)
                        : "Not specified"}
                    </span>
                  </div>
                )}
              </div>

              {/* Coverage Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coverage Area
                </label>
                {editMode ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.coverageArea}
                      onChange={handleInputChange("coverageArea")}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="">Select coverage</option>
                      <option value="front-gate">Front Gate/Entrance</option>
                      <option value="back-gate">Back Gate/Exit</option>
                      <option value="parking">Parking Area</option>
                      <option value="street-facing">Street Facing</option>
                      <option value="inside-premises">Inside Premises</option>
                      <option value="corner-view">Corner/Side View</option>
                      <option value="full-coverage">360° Full Coverage</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-900">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-lg">
                      {user?.coverageArea
                        ? user.coverageArea.replace(/-/g, " ")
                        : "Not specified"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Camera Location
              </label>
              <div className="flex items-center gap-3 text-gray-900">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Lat: {user?.location.coordinates[1].toFixed(5)}, Lng:{" "}
                  {user?.location.coordinates[0].toFixed(5)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sharing Preferences Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Sharing Preferences</h2>
            <p className="text-sm text-gray-600 mt-1">
              Control how and when your footage can be shared
            </p>
          </div>

          <div className="p-6 space-y-4">
            {/* Emergency Live */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Emergency Live Access</h4>
                <p className="text-sm text-gray-600">
                  Allow live feed during active emergencies
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={sharingPreferences.emergencyLive}
                  onChange={() => handlePreferenceToggle("emergencyLive")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Incident Clips */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Incident Clip Sharing</h4>
                <p className="text-sm text-gray-600">
                  Share recorded clips for investigations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={sharingPreferences.incidentClips}
                  onChange={() => handlePreferenceToggle("incidentClips")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Auto-Approve */}
            <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Auto-Approve Verified Cases</h4>
                <p className="text-sm text-gray-600">
                  Automatically approve high-priority cases
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={sharingPreferences.autoApprove}
                  onChange={() => handlePreferenceToggle("autoApprove")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {editMode && (
              <button
                onClick={handleUpdate}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Save Sharing Preferences
              </button>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm border border-red-200">
          <div className="p-6 border-b border-red-200">
            <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
            <p className="text-sm text-gray-600 mt-1">
              Irreversible actions - proceed with caution
            </p>
          </div>

          <div className="p-6">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              <Trash2 className="w-5 h-5" />
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Delete Account?</h3>
            </div>

            <p className="text-gray-600 mb-4">
              This action cannot be undone. All your camera data, preferences, and history
              will be permanently deleted.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800 font-medium mb-2">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteConfirmation.toLowerCase() !== "delete"}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Delete Permanently
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
