import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../api";

const RAJASTHAN_CENTER = [27.0238, 74.2179];

const RAJASTHAN_BOUNDS = [
  [23.3, 69.3],   // South-West
  [30.2, 78.3]    // North-East
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
      maxZoom={14}
      maxBounds={RAJASTHAN_BOUNDS}
      maxBoundsViscosity={1.0}
      style={{ height: "90vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
      />

      {users.map(u => (
        <Marker
          key={u._id}
          position={[
            u.location.coordinates[1],
            u.location.coordinates[0]
          ]}
        >
          <Popup>
            <b>{u.name}</b><br />
            {u.locality}<br />
            {u.pincode}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
