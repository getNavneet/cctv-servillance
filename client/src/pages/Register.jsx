import React, { useState } from "react";
import { MapPin, Loader2, CheckCircle2, User, Mail, Phone, Camera, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    lat: null,
    lng: null,
    cameraType: "",
    coverageArea: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // 📍 ONLY GET LAT/LNG — NO REVERSE GEOCODING
  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus({
        type: "error",
        message: "Geolocation not supported in this browser",
      });
      return;
    }

    setLoadingLocation(true);
    setStatus({ type: "info", message: "Getting your location..." });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setForm((prev) => ({
          ...prev,
          lat,
          lng,
        }));

        setLocationCaptured(true);
        setLoadingLocation(false);

        setStatus({
          type: "success",
          message: `Location captured successfully (Lat: ${lat.toFixed(
            5
          )}, Lng: ${lng.toFixed(5)})`,
        });
      },
      (err) => {
        console.error(err);
        setLoadingLocation(false);
        setStatus({
          type: "error",
          message:
            "Location permission denied. Please enable location access.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const submit = async () => {
  if (!form.name.trim()) {
    setStatus({ type: "error", message: "Please enter your name" });
    return;
  }
  if (!form.email.trim()) {
    setStatus({ type: "error", message: "Please enter your email" });
    return;
  }
  if (!form.phone.trim()) {
    setStatus({ type: "error", message: "Please enter your phone number" });
    return;
  }
  if (!form.lat || !form.lng) {
    setStatus({
      type: "error",
      message: "Please allow location access first",
    });
    return;
  }

  setSubmitting(true);
  setStatus({ type: "info", message: "Registering Your Camera..." });

  try {
    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    // ✅ FIX: Check if response is OK and has content
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // ✅ FIX: Check if response has JSON content before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server did not return JSON response");
    }

    const data = await response.json();

    if (data.success) {
      setStatus({
        type: "success",
        message: "Thank You ! Registration successful! 🎉",
      });

      navigate("/post-registration", { 
        state: { 
          userData: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email
          }
        } 
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        lat: null,
        lng: null,
        cameraType: "",
        coverageArea: "",
      });

      setLocationCaptured(false);
    } else {
      throw new Error(data.error || "Registration failed");
    }
  } catch (err) {
    console.error("Registration error:", err);
    setStatus({
      type: "error",
      message: err.message || "Registration failed. Please try again.",
    });
  } finally {
    setSubmitting(false);
  }
};


  const getStatusColor = () => {
    switch (status.type) {
      case "success":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Camera
          </h1>
          <p className="text-gray-600">Help make your area safer</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Navneet"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="navneet@gmail.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="10-digit mobile number"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Camera Type (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Camera Type <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={form.cameraType}
                onChange={handleChange("cameraType")}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none bg-white"
              >
                <option value="">Select camera type</option>
                <option value="dome">Dome Camera</option>
                <option value="bullet">Bullet Camera</option>
                <option value="ptz">PTZ Camera</option>
                <option value="ip">IP Camera</option>
                <option value="analog">Analog Camera</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Coverage Area (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Coverage Area <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={form.coverageArea}
                onChange={handleChange("coverageArea")}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none bg-white"
              >
                <option value="">Select coverage direction</option>
                <option value="front-gate">Front Gate/Entrance</option>
                <option value="back-gate">Back Gate/Exit</option>
                <option value="parking">Parking Area</option>
                <option value="street-facing">Street Facing</option>
                <option value="inside-premises">Inside Premises</option>
                <option value="corner-view">Corner/Side View</option>
                <option value="full-coverage">360° Full Coverage</option>
              </select>
            </div>
          </div>

          {/* Location Button */}
          <button
            type="button"
            onClick={getLocation}
            disabled={loadingLocation || locationCaptured}
            className={`w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition ${
              locationCaptured
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loadingLocation ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Getting Location...
              </>
            ) : locationCaptured ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Location Captured
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                Allow Location Access
              </>
            )}
          </button>

          {/* Status */}
          {status.message && (
            <div
              className={`rounded-xl px-4 py-3 border text-sm ${getStatusColor()}`}
            >
              {status.message}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={submitting || !locationCaptured}
            className="w-full py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Registering Camera..." : "Register Camera"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Fields marked with <span className="text-red-500">*</span> are required
          </p>
        </div>
      </div>
    </div>
  );
}
