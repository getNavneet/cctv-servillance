import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../api";

export default function AdminMap() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={10}
      style={{ height: "90vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {users.map((u) => (
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
