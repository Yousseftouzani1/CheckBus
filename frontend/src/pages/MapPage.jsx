import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Generate bus icon
const createBusIcon = (color) =>
  new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">🚍</div>`,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

// Bus stop icon
const busStopIcon = new L.DivIcon({
  html: `<div style="background-color: white; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #4F86F7; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 2px 8px rgba(79, 134, 247, 0.4);">🚏</div>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// Original stops (used as route endpoints)
const RAW_ROUTES = [
  {
    id: 1,
    name: "Route 1 - Agdal ↔ Hassan",
    color: "#FF6B6B",
    stops: [
      [33.9715, -6.8498],
      [33.9760, -6.8465],
      [33.9840, -6.8420],
      [33.9940, -6.8360],
      [34.0060, -6.8332],
      [34.0150, -6.8326],
    ],
  },
  {
    id: 2,
    name: "Route 2 - Hassan ↔ Yacoub El Mansour",
    color: "#4ECDC4",
    stops: [
      [34.0150, -6.8326],
      [34.0174, -6.8334],
      [34.0198, -6.8346],
      [34.0209, -6.8350],
    ],
  },
  {
    id: 3,
    name: "Route 3 - Centre-Ville ↔ Hay Riad",
    color: "#95E1D3",
    stops: [
      [34.0209, -6.8350],
      [34.0120, -6.8440],
      [34.0030, -6.8530],
      [33.9940, -6.8605],
      [33.9850, -6.8645],
      [33.9760, -6.8668],
      [33.9670, -6.8676],
      [33.9580, -6.8676],
      [33.9490, -6.8676],
      [33.9425, -6.8676],
    ],
  },
  {
    id: 4,
    name: "Route 4 - Hay Riad ↔ Agdal",
    color: "#FFD93D",
    stops: [
      [33.9425, -6.8676],
      [33.9510, -6.8635],
      [33.9580, -6.8565],
      [33.9640, -6.8508],
      [33.9700, -6.8492],
      [33.9715, -6.8498],
    ],
  },
  {
    id: 5,
    name: "Route 5 - Ocean ↔ Souissi",
    color: "#A78BFA",
    stops: [
      [34.0250, -6.8370],
      [34.0205, -6.8430],
      [34.0160, -6.8490],
      [34.0115, -6.8545],
      [34.0070, -6.8585],
      [34.0025, -6.8615],
      [33.9980, -6.8638],
      [33.9935, -6.8645],
      [33.9900, -6.8640],
    ],
  },
];

// Request real road paths from OSRM (free)
async function getRoadPath(stops) {
  const coordString = stops.map(([lat, lon]) => `${lon},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
  } catch (error) {
    console.error("Error fetching route:", error);
    return stops; // Fallback to stops if API fails
  }
}

// Map auto-follower
const MapFollower = ({ followBusId, buses }) => {
  const map = useMap();

  useEffect(() => {
    if (followBusId && buses[followBusId]) {
      const { lat, lon } = buses[followBusId];
      map.setView([lat, lon], 16, { animate: true });
    }
  }, [followBusId, buses, map]);

  return null;
};

const MapPage = () => {
  const [routes, setRoutes] = useState(null);
  const [buses, setBuses] = useState({});
  const [busPaths, setBusPaths] = useState({});
  const [followBusId, setFollowBusId] = useState(null);
  const intervalRefs = useRef([]);

  // STEP 1 → Load real road paths
  useEffect(() => {
    async function loadRoadRoutes() {
      const processed = [];

      for (const r of RAW_ROUTES) {
        const roadPath = await getRoadPath(r.stops);
        processed.push({ ...r, path: roadPath });
      }

      setRoutes(processed);
    }

    loadRoadRoutes();
  }, []);

  // STEP 2 → Start bus simulation once roads are loaded
  useEffect(() => {
    if (!routes) return;

    routes.forEach((route) => {
      let currentStep = 0;
      const stepsPerSegment = 40;
      const totalSteps = (route.path.length - 1) * stepsPerSegment;
      let direction = 1;
      let waitCounter = 0;
      const stopWaitTime = 30;

      const moveBus = () => {
        if (waitCounter > 0) {
          waitCounter--;
          return;
        }

        const segmentIndex = Math.floor(currentStep / stepsPerSegment);
        const segProg = (currentStep % stepsPerSegment) / stepsPerSegment;

        const realIndex = direction === 1 ? segmentIndex : route.path.length - 2 - segmentIndex;

        if (realIndex < 0 || realIndex >= route.path.length - 1) return;

        const start = route.path[realIndex];
        const end = route.path[realIndex + 1];

        const t = direction === 1 ? segProg : 1 - segProg;

        const lat = start[0] + (end[0] - start[0]) * t;
        const lon = start[1] + (end[1] - start[1]) * t;

        setBuses((prev) => ({
          ...prev,
          [route.id]: {
            id: route.id,
            name: route.name,
            lat,
            lon,
            color: route.color,
            timestamp: Date.now(),
          },
        }));

        setBusPaths((prev) => {
          const path = prev[route.id] || [];
          return { ...prev, [route.id]: [...path, [lat, lon]].slice(-200) };
        });

        currentStep++;
        if (currentStep >= totalSteps) {
          currentStep = 0;
          direction *= -1;
          waitCounter = stopWaitTime * 2;
        }
      };

      const interval = setInterval(moveBus, 300);
      intervalRefs.current.push(interval);
    });

    return () => intervalRefs.current.forEach(clearInterval);
  }, [routes]);

  const busArray = Object.values(buses);

  if (!routes)
    return (
      <div style={{ 
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        fontSize: "24px",
        fontWeight: "600"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🗺️</div>
          ⏳ Loading real road routes…
        </div>
      </div>
    );

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <MapContainer center={[33.9715, -6.8472]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapFollower followBusId={followBusId} buses={buses} />

        {routes.map((route) =>
          route.stops.map(([lat, lon], i) => (
            <Marker key={route.id + "-" + i} position={[lat, lon]} icon={busStopIcon}>
              <Popup>
                <div style={{ textAlign: "center", minWidth: "120px" }}>
                  <div style={{ fontSize: "20px", marginBottom: "5px" }}>🚏</div>
                  <strong style={{ color: "#1e40af" }}>Bus Stop</strong><br />
                  <small style={{ color: "#64748b" }}>Route {route.id}</small>
                </div>
              </Popup>
            </Marker>
          ))
        )}

        {Object.entries(busPaths).map(([id, path]) =>
          path.length > 1 ? (
            <Polyline key={id} positions={path} color="#10b981" weight={4} opacity={0.7} />
          ) : null
        )}

        {busArray.map((bus) => (
          <Marker key={bus.id} position={[bus.lat, bus.lon]} icon={createBusIcon(bus.color)}>
            <Popup>
              <div style={{ minWidth: "180px" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  marginBottom: "8px"
                }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: bus.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    🚍
                  </div>
                  <strong style={{ color: bus.color, fontSize: "16px" }}>
                    Bus #{bus.id}
                  </strong>
                </div>
                <small style={{ color: "#64748b", display: "block", marginBottom: "8px" }}>
                  {bus.name}
                </small>
                <hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid #e2e8f0" }} />
                <div style={{ fontSize: "12px", color: "#475569" }}>
                  <strong>Position:</strong><br />
                  Lat: {bus.lat.toFixed(6)}<br />
                  Lon: {bus.lon.toFixed(6)}
                </div>
                <button
                  onClick={() => setFollowBusId(bus.id)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "10px",
                    backgroundColor: bus.color,
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = "0.8"}
                  onMouseLeave={(e) => e.target.style.opacity = "1"}
                >
                  📍 Follow This Bus
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Control Panel - Beautiful Blue Theme */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: "linear-gradient(135deg, rgba(79, 134, 247, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          padding: "20px",
          borderRadius: "16px",
          width: "300px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(79, 134, 247, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 999,
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          marginBottom: "20px",
          paddingBottom: "15px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px"
          }}>
            🚍
          </div>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: "18px", 
              fontWeight: "700",
              color: "white"
            }}>
              Live Bus Tracker
            </h3>
            <p style={{ 
              margin: "2px 0 0 0", 
              fontSize: "12px", 
              color: "rgba(255, 255, 255, 0.8)"
            }}>
              Track buses in real-time
            </p>
          </div>
        </div>

        <div style={{ 
          background: "rgba(255, 255, 255, 0.15)",
          padding: "12px",
          borderRadius: "10px",
          marginBottom: "16px",
          textAlign: "center"
        }}>
          <div style={{ 
            fontSize: "28px", 
            fontWeight: "700",
            color: "white",
            marginBottom: "4px"
          }}>
            {busArray.length}
          </div>
          <div style={{ 
            fontSize: "12px", 
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: "500"
          }}>
            Active Buses
          </div>
        </div>

        <button
          onClick={() => setFollowBusId(null)}
          style={{
            width: "100%",
            padding: "12px",
            background: followBusId === null 
              ? "rgba(255, 255, 255, 0.95)" 
              : "rgba(255, 255, 255, 0.1)",
            color: followBusId === null ? "#4F86F7" : "white",
            border: followBusId === null ? "none" : "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "12px",
            transition: "all 0.3s",
            boxShadow: followBusId === null ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none"
          }}
          onMouseEnter={(e) => {
            if (followBusId === null) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
            } else {
              e.target.style.background = "rgba(255, 255, 255, 0.15)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = followBusId === null ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none";
            if (followBusId !== null) {
              e.target.style.background = "rgba(255, 255, 255, 0.1)";
            }
          }}
        >
          📍 View All Buses
        </button>

        <div style={{ 
          fontSize: "11px", 
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "10px",
          textTransform: "uppercase",
          fontWeight: "600",
          letterSpacing: "0.5px"
        }}>
          Select Bus to Follow
        </div>

        {busArray.map((bus) => (
          <button
            key={bus.id}
            onClick={() => setFollowBusId(bus.id)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: followBusId === bus.id 
                ? "rgba(255, 255, 255, 0.95)" 
                : "rgba(255, 255, 255, 0.1)",
              color: followBusId === bus.id ? "#1e293b" : "white",
              marginBottom: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.3s",
              boxShadow: followBusId === bus.id ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none"
            }}
            onMouseEnter={(e) => {
              if (followBusId !== bus.id) {
                e.target.style.background = "rgba(255, 255, 255, 0.15)";
              } else {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              if (followBusId !== bus.id) {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              } else {
                e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              }
            }}
          >
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: bus.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
            }}>
              <span style={{ fontSize: "16px" }}>🚍</span>
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ 
                fontWeight: "700", 
                fontSize: "14px",
                marginBottom: "2px"
              }}>
                Bus #{bus.id}
              </div>
              <div style={{ 
                fontSize: "11px", 
                opacity: followBusId === bus.id ? 0.7 : 0.8,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {bus.name}
              </div>
            </div>
            {followBusId === bus.id && (
              <div style={{ fontSize: "18px", flexShrink: 0 }}>📍</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapPage;