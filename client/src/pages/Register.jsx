import { useState } from "react";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    pincode: "",
    locality: ""
  });

  const [status, setStatus] = useState("");

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setStatus("Location captured ✅");
      },
      () => setStatus("Location permission denied ❌")
    );
  };

  const submit = async () => {
    if (!form.lat || !form.lng) {
      setStatus("Please allow location first");
      return;
    }

    await api.post("/users/register", form);
    setStatus("User registered successfully 🎉");

    setForm({ name: "", pincode: "", locality: "" });
  };

  return (
    <div className="container">
      <h2>User Registration</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Pincode"
        value={form.pincode}
        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
      />

      <input
        placeholder="Locality"
        value={form.locality}
        onChange={(e) => setForm({ ...form, locality: e.target.value })}
      />

      <button onClick={getLocation}>Allow Location</button>
      <button onClick={submit}>Submit</button>

      <p>{status}</p>
    </div>
  );
}
