import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import AdminMap from "./pages/Admin";
import Home from "./pages/Home";
// import AdminMap from "./pages/AdminRajOnly";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10 }}>
        <Link to="/">Register</Link> |{" "}
        <Link to="/admin">Admin Map</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminMap />} />
      </Routes>
    </BrowserRouter>
  );
}
