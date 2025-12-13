import { useState } from "react";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    locality: "",
    lat: null,
    lng: null,
  });

  const [status, setStatus] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported in this browser");
      return;
    }

    setLoadingLocation(true);
    setStatus("Getting location…");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setForm((prev) => ({ ...prev, lat, lng }));
        setStatus("Location captured. Fetching address…");

        try {
          // Backend should call some reverse‑geocoding API (e.g. Nominatim, Google, Mapbox)
          // and return { pincode, city, state, locality }
          const { data } = await api.get("/geo/reverse", {
            params: { lat, lng },
          });

          setForm((prev) => ({
            ...prev,
            pincode: data.pincode || prev.pincode || "",
            city: data.city || prev.city || "",
            state: data.state || prev.state || "",
            locality: data.locality || prev.locality || "",
          }));
          setStatus("Location & address auto-filled ✅ (you can edit if needed)");
        } catch (err) {
          console.error(err);
          setStatus("Location captured, but address lookup failed. Please fill manually.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        setLoadingLocation(false);
        setStatus("Location permission denied ❌. Please fill address manually.");
      }
    );
  };

  const submit = async () => {
    if (!form.lat || !form.lng) {
      setStatus("Please use 'Use my location' or manually allow location first.");
      // You can choose to allow submit without lat/lng; here we enforce it.
      return;
    }

    setSubmitting(true);
    setStatus("Submitting…");

    try {
      await api.post("/users/register", form);
      setStatus("User registered successfully 🎉");
      setForm({
        name: "",
        email: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
        locality: "",
        lat: null,
        lng: null,
      });
    } catch (err) {
      console.error(err);
      setStatus("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center">
          User Registration
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange("name")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange("phone")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Location & Address */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-800">
                Address Details
              </p>
              <button
                type="button"
                onClick={getLocation}
                disabled={loadingLocation}
                className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-60"
              >
                {loadingLocation ? "Getting location…" : "Use my location"}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              We’ll try to auto-fill pincode, city and state from your GPS
              location. You can always edit them if anything is incorrect.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. 302001"
                  value={form.pincode}
                  onChange={handleChange("pincode")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange("city")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange("state")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Locality / Landmark
              </label>
              <input
                type="text"
                placeholder="Area, street, or landmark"
                value={form.locality}
                onChange={handleChange("locality")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Hidden lat/lng debug (optional) */}
          {/* <pre className="text-xs text-slate-400">
            {JSON.stringify({ lat: form.lat, lng: form.lng }, null, 2)}
          </pre> */}

          {/* Submit button */}
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="w-full mt-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Register"}
          </button>

          {/* Status */}
          {status && (
            <p className="mt-2 text-xs text-slate-600 text-center">{status}</p>
          )}
        </div>
      </div>
    </div>
  );
}
