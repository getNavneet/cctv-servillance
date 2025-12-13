import React,{ useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import api from "../api";

// IMPORT CUSTOM ICON
import markerIcon from "../assets/marker1.png";

// Create custom marker
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Rajasthan config
const RAJASTHAN_CENTER = [27.0238, 74.2179];
const RAJASTHAN_BOUNDS = [
  [23.3, 69.3],
  [30.2, 78.3]
];

export default function AdminMap() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data));
  }, []);

  return (
    <MapContainer
      center={RAJASTHAN_CENTER}
      zoom={7}
      minZoom={6}
      maxZoom={19}
      maxBounds={RAJASTHAN_BOUNDS}
      maxBoundsViscosity={1}
      style={{ height: "90vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        noWrap
      />

      {users.map(user => (
        <Marker
          key={user._id}
          position={[
            user.location.coordinates[1],
            user.location.coordinates[0]
          ]}
          icon={customIcon}
        >
          <Popup>
            <b>{user.name}</b><br />
            {user.phone}<br />
            {user.cameraType}
            {user.coverageArea}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
