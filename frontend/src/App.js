import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import Menu from "./pages/Menu";
import BuyTicket from "./pages/BuyTicket";
import Payment from "./pages/Payment";
import ReserveSeat from "./pages/ReserveSeat";
import Subscriptions from "./pages/Subscriptions";
function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {!user && (
          <Route path="/" element={<LoginForm onLogin={setUser} />} />
        )}

        {user && (
          <>
            <Route path="/" element={<Menu />} />
            <Route path="/buy-ticket" element={<BuyTicket />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/reserve-seat/:busId" element={<ReserveSeat />} />
            <Route path="/subscriptions" element={<Subscriptions />} />

          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
