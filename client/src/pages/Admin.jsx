import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Search, MapPin, Navigation, Filter, X } from "lucide-react";
import L from "leaflet";
import api from "../api";
import markerIcon from "../assets/marker1.png";

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Highlight icon for search results
const highlightIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
  className: "highlight-marker"
});

// Component to update map view
function MapController({ center, zoom, searchRadius }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);

  return searchRadius ? (
    <Circle
      center={center}
      radius={searchRadius * 1000}
      pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
    />
  ) : null;
}

export default function AdminMap() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search states
  const [searchType, setSearchType] = useState("address"); // address, pincode, nearby
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRadius, setSearchRadius] = useState(5); // km
  const [mapCenter, setMapCenter] = useState([27.0238, 74.2179]);
  const [mapZoom, setMapZoom] = useState(7);
  const [highlightedCamera, setHighlightedCamera] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    filtered: 0,
    avgPerArea: 0
  });

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
      calculateStats(res.data, res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allUsers, filtered) => {
    setStats({
      total: allUsers.length,
      filtered: filtered.length,
      avgPerArea: allUsers.length > 0 ? (filtered.length / allUsers.length * 100).toFixed(1) : 0
    });
  };

  // Search by address using Nominatim (OpenStreetMap geocoding)
  const searchByAddress = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter an address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ", Rajasthan, India"
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const searchLat = parseFloat(lat);
        const searchLng = parseFloat(lon);

        setMapCenter([searchLat, searchLng]);
        setMapZoom(13);

        // Find cameras within radius
        const nearby = findNearbyCameras(searchLat, searchLng, searchRadius);
        setFilteredUsers(nearby);
        calculateStats(users, nearby);
      } else {
        alert("Address not found. Try a different search term.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to search address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search by pincode
  const searchByPincode = async () => {
    if (!searchQuery.trim() || !/^\d{6}$/.test(searchQuery)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&postalcode=${searchQuery}&country=India`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const searchLat = parseFloat(lat);
        const searchLng = parseFloat(lon);

        setMapCenter([searchLat, searchLng]);
        setMapZoom(13);

        const nearby = findNearbyCameras(searchLat, searchLng, searchRadius);
        setFilteredUsers(nearby);
        calculateStats(users, nearby);
      } else {
        alert("Pincode not found");
      }
    } catch (error) {
      console.error("Pincode search error:", error);
      alert("Failed to search pincode. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Find cameras near me using geolocation
  const findCamerasNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setMapZoom(14);

        const nearby = findNearbyCameras(latitude, longitude, searchRadius);
        setFilteredUsers(nearby);
        calculateStats(users, nearby);
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your location. Please enable location access.");
        setLoading(false);
      }
    );
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find cameras within radius
  const findNearbyCameras = (lat, lng, radiusKm) => {
    return users.filter((user) => {
      const distance = calculateDistance(
        lat,
        lng,
        user.location.coordinates[1],
        user.location.coordinates[0]
      );
      return distance <= radiusKm;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilteredUsers(users);
    setSearchQuery("");
    setMapCenter([27.0238, 74.2179]);
    setMapZoom(7);
    setHighlightedCamera(null);
    calculateStats(users, users);
  };

  // Handle search based on type
  const handleSearch = () => {
    if (searchType === "address") {
      searchByAddress();
    } else if (searchType === "pincode") {
      searchByPincode();
    } else if (searchType === "nearby") {
      findCamerasNearMe();
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Search Panel */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg p-4 w-96 max-w-[calc(100vw-2rem)]">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-indigo-50 rounded-lg p-2 text-center">
            <p className="text-xs text-indigo-600 font-medium">Total</p>
            <p className="text-lg font-bold text-indigo-700">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-xs text-green-600 font-medium">Showing</p>
            <p className="text-lg font-bold text-green-700">{stats.filtered}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <p className="text-xs text-purple-600 font-medium">Coverage</p>
            <p className="text-lg font-bold text-purple-700">{stats.avgPerArea}%</p>
          </div>
        </div>

        {/* Search Type Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setSearchType("address")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
              searchType === "address"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Search className="w-4 h-4 inline mr-1" />
            Address
          </button>
          <button
            onClick={() => setSearchType("pincode")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
              searchType === "pincode"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Pincode
          </button>
          <button
            onClick={() => setSearchType("nearby")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
              searchType === "nearby"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Navigation className="w-4 h-4 inline mr-1" />
            Near Me
          </button>
        </div>

        {/* Search Input */}
        {searchType !== "nearby" && (
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder={
                searchType === "address"
                  ? "Enter address (e.g., Jaipur, Civil Lines)"
                  : "Enter 6-digit pincode"
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        )}

        {/* Radius Slider */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Radius: {searchRadius} km
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={searchRadius}
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Searching...
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                Search
              </>
            )}
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        minZoom={6}
        maxZoom={19}
        maxBounds={[
          [23.3, 69.3],
          [30.2, 78.3]
        ]}
        maxBoundsViscosity={1}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
          noWrap
        />
        
        <MapController 
          center={mapCenter} 
          zoom={mapZoom} 
          searchRadius={searchType !== "nearby" && filteredUsers.length < users.length ? searchRadius : null}
        />

        {filteredUsers.map((user) => (
          <Marker
            key={user._id}
            position={[user.location.coordinates[1], user.location.coordinates[0]]}
            icon={highlightedCamera === user._id ? highlightIcon : customIcon}
            eventHandlers={{
              click: () => setHighlightedCamera(user._id),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <h3 className="font-bold text-gray-900 mb-2 text-base">{user.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">📧</span> {user.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">📱</span> {user.phone}
                  </p>
                  {user.cameraType && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">📷</span>{" "}
                      {user.cameraType.charAt(0).toUpperCase() + user.cameraType.slice(1)}
                    </p>
                  )}
                  {user.coverageArea && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">📍</span>{" "}
                      {user.coverageArea.replace(/-/g, " ")}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
                    Registered: {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
