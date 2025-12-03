import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Profile from "./pages/Profile";
import LoginForm from "./components/LoginForm";
import Menu from "./pages/Menu";
import BuyTicket from "./pages/BuyTicket";
import Payment from "./pages/Payment";
import ReserveSeat from "./pages/ReserveSeat";
import Subscriptions from "./pages/Subscriptions";
import ModifyTicket from "./pages/ModifyTicket";
import SubscriptionCheckout from "./pages/SubscriptionCheckout";
import Register from "./pages/Register";
import MapPage from "./pages/MapPage";
import PaymentsDashboard from "./pages/PaymentsDashboard";
import Notifications from "./pages/Notifications";


// ======================================================
//  JWT HELPER FUNCTIONS (same as your working code)
// ======================================================
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
};

const getUserFromToken = () => {
  const token =
    getCookie("jwt") || getCookie("token") || getCookie("authToken");

  if (!token) {
    console.warn("No JWT token found in cookies");
    return null;
  }

  const payload = parseJwt(token);

  if (!payload) {
    console.warn("Could not parse JWT token");
    return null;
  }

  return {
    name: payload.name || payload.username || payload.sub || "User",
    email: payload.email || "no-email@example.com",
    userId: payload.userId || payload.id || payload.sub || null,
    memberSince: payload.iat
      ? new Date(payload.iat * 1000).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "Recently",
    avatar: null,
  };
};


// ======================================================
//  MAIN APP COMPONENT
// ======================================================
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadedUser = getUserFromToken();
    if (loadedUser) setUser(loadedUser);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {!user && (
          <>
            <Route path="/" element={<LoginForm onLogin={setUser} />} />
            <Route path="/register" element={<Register />} />
          </>
        )}

        {user && (
          <>
            <Route path="/" element={<Menu />} />
            <Route path="/buy-ticket" element={<BuyTicket />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/reserve-seat/:busId" element={<ReserveSeat />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tickets/:ticketId/modify" element={<ModifyTicket />} />
            <Route path="/checkout" element={<SubscriptionCheckout />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/payments" element={<PaymentsDashboard />} />
            <Route path="/notifications" element={<Notifications />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
