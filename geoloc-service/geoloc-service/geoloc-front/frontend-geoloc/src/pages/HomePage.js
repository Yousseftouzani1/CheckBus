import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>🚍 Geolocation Dashboard</h1>
      <p>Track all buses in real time.</p>
      <Link to="/map">Go to Live Map</Link>
    </div>
  );
}

export default HomePage;
