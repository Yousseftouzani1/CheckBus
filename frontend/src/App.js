import React, { useState } from "react";
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
function App() {
  const [user, setUser] = useState(null);
  
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
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;