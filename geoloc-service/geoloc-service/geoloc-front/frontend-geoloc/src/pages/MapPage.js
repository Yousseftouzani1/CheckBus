import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { connect, disconnect } from "../services/websocket";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapPage() {
  const [busPositions, setBusPositions] = useState([]);
  const [busPaths, setBusPaths] = useState({});

  useEffect(() => {
    connect((busUpdate) => {
      // ✅ Log to confirm it’s working
      console.log("🛰️ Bus update received:", busUpdate);

      // Update position and path
      setBusPositions([{ id: busUpdate.busId, lat: busUpdate.latitude, lon: busUpdate.longitude }]);
      setBusPaths((prev) => {
        const updated = { ...prev };
        const id = busUpdate.busId;
        if (!updated[id]) updated[id] = [];
        updated[id] = [...updated[id], [busUpdate.latitude, busUpdate.longitude]];
        return updated;
      });
    });

    return () => disconnect();
  }, []);

  return (
    <MapContainer center={[33.9715, -6.8472]} zoom={12} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {busPositions.map((bus) => (
        <Marker key={bus.id} position={[bus.lat, bus.lon]}>
          <Popup>Bus #{bus.id}</Popup>
        </Marker>
      ))}

      {Object.keys(busPaths).map((id) => (
        <Polyline
          key={id}
          positions={busPaths[id]}
          color={["red", "blue", "green", "orange"][id % 4]}
          weight={4}
          opacity={0.7}
        />
      ))}
    </MapContainer>
  );
}

export default MapPage;
    