import React from "react";
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Search, Send, Radio, Navigation } from "lucide-react";
import api from "../api";
import "leaflet/dist/leaflet.css";

// Component to update map view when search changes
function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function AdvAdminMap() {
  const [cameras, setCameras] = useState([]);
  const [searchCenter, setSearchCenter] = useState(null);
  const [radius, setRadius] = useState(500); // meters
  const [searchType, setSearchType] = useState(""); // "address", "pincode", "nearby"
  
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [messageMode, setMessageMode] = useState(null); // "single" | "radius"
  const [customMessage, setCustomMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Default map center (Rajasthan - Jaipur)
  const defaultCenter = [26.9124, 75.7873];
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(12);

  // Fetch all cameras on mount
  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const { data } = await api.get("/admin/cameras");
      setCameras(data.cameras);
    } catch (err) {
      console.error(err);
    }
  };

  // Search handlers
  const searchByAddress = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      // Backend geocodes address → returns { lat, lng }
      const { data } = await api.get("/geo/search", {
        params: { address: searchQuery }
      });
      const center = [data.lat, data.lng];
      setSearchCenter(center);
      setMapCenter(center);
      setMapZoom(14);
      setSearchType("address");
    } catch (err) {
      alert("Address not found");
    } finally {
      setLoading(false);
    }
  };

  const searchByPincode = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get("/geo/pincode", {
        params: { pincode: searchQuery }
      });
      const center = [data.lat, data.lng];
      setSearchCenter(center);
      setMapCenter(center);
      setMapZoom(14);
      setSearchType("pincode");
    } catch (err) {
      alert("Pincode not found");
    } finally {
      setLoading(false);
    }
  };

  const searchNearby = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = [pos.coords.latitude, pos.coords.longitude];
        setSearchCenter(center);
        setMapCenter(center);
        setMapZoom(15);
        setSearchType("nearby");
        setLoading(false);
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      }
    );
  };

  // Get cameras within radius
  const getCamerasInRadius = () => {
    if (!searchCenter) return [];
    return cameras.filter((cam) => {
      const distance = getDistanceFromLatLonInMeters(
        searchCenter[0],
        searchCenter[1],
        cam.lat,
        cam.lng
      );
      return distance <= radius;
    });
  };

  // Haversine distance formula
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  // Send message to single camera
  const sendMessageToCamera = async (cameraId) => {
    if (!customMessage.trim()) {
      alert("Please enter a message");
      return;
    }
    setSendingMessage(true);
    try {
      await api.post("/admin/message/single", {
        cameraId,
        message: customMessage
      });
      alert("Message sent to camera owner!");
      setCustomMessage("");
      setSelectedCamera(null);
      setMessageMode(null);
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Broadcast to all cameras in radius
  const broadcastToRadius = async () => {
    if (!customMessage.trim()) {
      alert("Please enter a message");
      return;
    }
    if (!searchCenter) {
      alert("Please search for a location first");
      return;
    }

    const camerasInRadius = getCamerasInRadius();
    if (camerasInRadius.length === 0) {
      alert("No cameras found in this radius");
      return;
    }

    setSendingMessage(true);
    try {
      await api.post("/admin/message/broadcast", {
        center: { lat: searchCenter[0], lng: searchCenter[1] },
        radius,
        message: customMessage,
        cameraIds: camerasInRadius.map((c) => c.id)
      });
      alert(`Message sent to ${camerasInRadius.length} camera owner(s)!`);
      setCustomMessage("");
      setMessageMode(null);
    } catch (err) {
      alert("Failed to broadcast message");
    } finally {
      setSendingMessage(false);
    }
  };

  const camerasInRadius = searchCenter ? getCamerasInRadius() : [];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left sidebar: Search & Controls */}
      <div className="w-80 border-r border-slate-200 bg-white p-4 space-y-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900">Camera Map Control</h2>

        {/* Search section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Search Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Address or Pincode"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={searchByAddress}
              disabled={loading}
              className="rounded-lg bg-teal-600 px-3 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={searchByPincode}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              By Pincode
            </button>
            <button
              onClick={searchNearby}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              Nearby
            </button>
          </div>
        </div>

        {/* Radius control */}
        {searchCenter && (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <label className="block text-sm font-medium text-slate-700">
              Search Radius: {radius}m
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-600">
              {camerasInRadius.length} camera(s) in radius
            </p>
          </div>
        )}

        {/* Messaging section */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-800">
            Send Message
          </p>

          {selectedCamera && messageMode === "single" && (
            <div className="rounded-lg bg-white border border-slate-200 p-2 text-xs">
              <p className="font-medium text-slate-900">
                To: {selectedCamera.name}
              </p>
              <p className="text-slate-600">{selectedCamera.location}</p>
            </div>
          )}

          {messageMode === "radius" && searchCenter && (
            <div className="rounded-lg bg-white border border-slate-200 p-2 text-xs">
              <p className="font-medium text-slate-900">
                Broadcast to {camerasInRadius.length} camera(s)
              </p>
              <p className="text-slate-600">Within {radius}m radius</p>
            </div>
          )}

          <textarea
            placeholder="Type your message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />

          <div className="flex gap-2">
            {messageMode === "single" && selectedCamera && (
              <button
                onClick={() => sendMessageToCamera(selectedCamera.id)}
                disabled={sendingMessage || !customMessage.trim()}
                className="flex-1 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <Send className="w-3 h-3" />
                Send
              </button>
            )}

            {searchCenter && (
              <button
                onClick={() => {
                  setMessageMode("radius");
                  setSelectedCamera(null);
                }}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold flex items-center justify-center gap-1 ${
                  messageMode === "radius"
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Radio className="w-3 h-3" />
                Broadcast
              </button>
            )}

            {messageMode === "radius" && (
              <button
                onClick={broadcastToRadius}
                disabled={sendingMessage || !customMessage.trim()}
                className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <Send className="w-3 h-3" />
                Send All
              </button>
            )}

            {messageMode && (
              <button
                onClick={() => {
                  setMessageMode(null);
                  setSelectedCamera(null);
                  setCustomMessage("");
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Camera list in radius */}
        {searchCenter && camerasInRadius.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">
              Cameras in Radius
            </p>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {camerasInRadius.map((cam) => (
                <div
                  key={cam.id}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-xs hover:border-teal-400 cursor-pointer"
                  onClick={() => {
                    setSelectedCamera(cam);
                    setMessageMode("single");
                  }}
                >
                  <p className="font-medium text-slate-900">{cam.name}</p>
                  <p className="text-slate-600">{cam.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <MapViewController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Search radius circle */}
          {searchCenter && (
            <Circle
              center={searchCenter}
              radius={radius}
              pathOptions={{
                color: "#0d9488",
                fillColor: "#0d9488",
                fillOpacity: 0.15,
                weight: 2
              }}
            />
          )}

          {/* Camera markers */}
          {cameras.map((cam) => {
            const isInRadius =
              searchCenter &&
              camerasInRadius.some((c) => c.id === cam.id);
            return (
              <Marker key={cam.id} position={[cam.lat, cam.lng]}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{cam.name}</p>
                    <p className="text-xs text-slate-600">{cam.location}</p>
                    <button
                      onClick={() => {
                        setSelectedCamera(cam);
                        setMessageMode("single");
                      }}
                      className="mt-2 w-full rounded bg-teal-600 px-2 py-1 text-xs text-white hover:bg-teal-700"
                    >
                      Send Message
                    </button>
                    {isInRadius && (
                      <span className="mt-1 inline-block text-xs text-teal-600">
                        ✓ In radius
                      </span>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
