import React, { useState,useEffect  } from 'react';
import { Bus, User, Check, ArrowRight, Info, Circle } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// ============= JWT HELPER FUNCTIONS =============
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

const getUserFromToken = () => {
  const token = getCookie('jwt') || getCookie('token') || getCookie('authToken');
  
  if (!token) {
    console.warn('No JWT token found in cookies');
    return null;
  }

  const payload = parseJwt(token);
  
  if (!payload) {
    console.warn('Could not parse JWT token');
    return null;
  }

  // Extract user info from common JWT claim names
  return {
    name: payload.name || payload.username || payload.sub || 'User',
    email: payload.email || payload.mail || 'user@example.com',
    userId: payload.userId || payload.id || payload.sub || 35,
    memberSince: payload.iat 
      ? new Date(payload.iat * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Recently',
    avatar: null
  };
};
// ============= MOCK SEAT DATA =============
// Converts seatcode ("A3") → seat number (1–40)
function seatCodeToNumber(code) {
  if (!code) return null;
  const seatNumber = parseInt(code, 10);
  return isNaN(seatNumber) ? null : seatNumber;
}



// ============= SEAT COMPONENT =============
function Seat({ seat, isSelected, onSelect }) {
  const getStatusStyle = () => {
    if (seat.reserved) {
      return 'bg-red-500/60 cursor-not-allowed border-red-400/40';
    }
    if (isSelected) {
      return 'bg-blue-500 border-blue-400 ring-2 ring-blue-400/50 scale-110';
    }
    return 'bg-green-500/70 hover:bg-green-400 border-green-400/40 hover:scale-105 cursor-pointer';
  };

  const handleClick = () => {
    if (!seat.reserved) {
      onSelect(seat.number);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={seat.reserved}
      className={`relative w-14 h-14 rounded-xl transition-all duration-300 flex items-center justify-center border-2 ${getStatusStyle()} group`}
    >
      {/* Seat Icon - Custom SVG */}
      <svg 
        className={`w-7 h-7 ${
          seat.reserved ? 'text-red-200' : isSelected ? 'text-white' : 'text-green-200'
        } transition-colors`}
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M7 11v8h10v-8h2v10H5V11h2zm0-8h10v6H7V3zm-3 8h16v2H4v-2z"/>
      </svg>
      
      {/* Seat Number */}
      <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap ${
        seat.reserved ? 'text-red-300' : isSelected ? 'text-blue-300' : 'text-green-300'
      }`}>
        {seat.number}
      </div>

      {/* Selected Check Mark */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-3 h-3 text-blue-600" strokeWidth={3} />
        </div>
      )}

      {/* Hover Glow */}
      {!seat.reserved && !isSelected && (
        <div className="absolute inset-0 rounded-xl bg-green-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
      )}
    </button>
  );
}

// ============= SEAT GRID COMPONENT =============
function SeatGrid({ seats, selectedSeat, onSeatSelect }) {
  const seatsPerRow = 4;
  const rows = [];

  for (let i = 0; i < seats.length; i += seatsPerRow) {
    rows.push(seats.slice(i, i + seatsPerRow));
  }

  return (
    <div className="space-y-6">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center justify-center gap-4">
          {/* Left Seats */}
          <div className="flex gap-3">
            <Seat
              seat={row[0]}
              isSelected={selectedSeat === row[0].number}
              onSelect={onSeatSelect}
            />
            <Seat
              seat={row[1]}
              isSelected={selectedSeat === row[1].number}
              onSelect={onSeatSelect}
            />
          </div>

          {/* Aisle */}
          <div className="w-12 flex items-center justify-center">
            <div className="h-12 w-1 bg-white/10 rounded-full"></div>
          </div>

          {/* Right Seats */}
          <div className="flex gap-3">
            <Seat
              seat={row[2]}
              isSelected={selectedSeat === row[2].number}
              onSelect={onSeatSelect}
            />
            <Seat
              seat={row[3]}
              isSelected={selectedSeat === row[3].number}
              onSelect={onSeatSelect}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============= BUS LAYOUT COMPONENT =============
function BusLayout({ bus, seats, selectedSeat, onSeatSelect }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
      {/* Bus Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg">
            <Bus className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">Bus {bus.number}</h2>
            <p className="text-blue-100 text-sm">{bus.direction}</p>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Choose Your Seat</h3>
        <p className="text-blue-100 text-sm">Select an available seat for your journey</p>
      </div>

      {/* Driver Cabin */}
      <div className="mb-8 flex justify-center">
        <div className="bg-white/5 border-2 border-white/20 rounded-2xl px-8 py-4 flex items-center space-x-3">
          <Circle className="w-8 h-8 text-blue-300 fill-blue-300/20" />
          <span className="text-white font-semibold text-sm">Driver</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="mb-8">
        <SeatGrid
          seats={seats}
          selectedSeat={selectedSeat}
          onSeatSelect={onSeatSelect}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-500/70 rounded-lg border-2 border-green-400/40"></div>
          <span className="text-white text-sm">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-lg border-2 border-blue-400"></div>
          <span className="text-white text-sm">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-500/60 rounded-lg border-2 border-red-400/40"></div>
          <span className="text-white text-sm">Reserved</span>
        </div>
      </div>
    </div>
  );
}

// ============= MAIN RESERVE SEAT PAGE =============
export default function ReserveSeat() {

  
  // Mock bus data for demo
const navigate = useNavigate();
const location = useLocation();
const bus = location.state?.bus;
const busNumber = location.state?.busNumber;
const tripId = location.state?.tripId;
const user = getUserFromToken();
const [seats, setSeats] = useState([]);
const [loadingSeats, setLoadingSeats] = useState(true);
const [selectedSeat, setSelectedSeat] = useState(null);
const handleSeatSelect = (seatNumber) => { setSelectedSeat(seatNumber) ;  };
// Get the seats from backend 
useEffect(() => {
  async function loadSeats() {
    try {
      const response = await fetch(`http://localhost:8081/api/tickets/trip/${bus.tripId || bus.id}`);

      let ticketList = [];
      if (response.ok) {
        ticketList = await response.json();
      }

      // 1. Build the full seat map (40 seats)
      const seatMap = [];
      for (let i = 1; i <= 40; i++) {
        seatMap.push({
          number: i,
          reserved: false
        });
      }

      // 2. Mark booked seats from backend
      ticketList.forEach(ticket => {
        if (["RESERVED", "PAID", "VALIDATED"].includes(ticket.status)) {
          const seatNumber = seatCodeToNumber(ticket.seatcode);
          const index = seatMap.findIndex(s => s.number === seatNumber);
          if (index !== -1) {
            seatMap[index].reserved = true;
          }
        }
      });

      setSeats(seatMap);
    } catch (err) {
      console.error("Seat loading failed. Using fallback seats.");
      
      // fallback = all seats free
      const fallback = [];
      for (let i = 1; i <= 40; i++) {
        fallback.push({ number: i, reserved: false });
      }
      setSeats(fallback);
    } finally {
      setLoadingSeats(false);
    }
  }

  if (bus) {
    loadSeats();
  }
}, [bus]);
//////////////////////// RESERVE TICKET ///////////////////
 
const handleConfirm = async () => {
  if (!selectedSeat) return;

  const requestBody = {
    userId: user?.userId,              // TODO: later extract from JWT
    tripId: tripId,
    seatcode: String(selectedSeat),
    price: parseFloat(bus.price),  // convert "25 MAD" → 25
    paymentMethod: "CARD"
  };

  console.log("Sending reserve ticket request:", requestBody);

  try {
    const response = await fetch("http://localhost:8081/api/tickets/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error("Reservation failed");
    }

    const data = await response.json();
    console.log("Reservation successful:", data);
    // 2️⃣ Check if user has an active subscription
    const subsResponse = await fetch(`http://localhost:8087/api/subscriptions/user/${user.userId}`);
    const subs = await subsResponse.json();

    const hasActiveSub = Array.isArray(subs) && subs.some(s => s.status === "ACTIVE");
    console.log("  Active subscription found:", hasActiveSub);
    // 3️⃣ If has active subscription → auto-buy ticket
    if (hasActiveSub) {
      console.log("🎟️ User has an active subscription — auto-processing payment...");

      const buyResponse = await fetch(`http://localhost:8081/api/tickets/${data.id}/buy?method=CARD`, {
        method: "POST",
      });

      if (!buyResponse.ok) throw new Error("Auto-payment failed");

      const paymentResult = await buyResponse.json();
      console.log("💳 Payment processed automatically:", paymentResult);

      alert("✅ Ticket purchased automatically using your active subscription!");
      navigate("/profile"); // or wherever you want
      return;
    }


    // 🚀 Redirect to payment with ticketId and seat info
    navigate("/payment", {
      state: {
        ticketId: data.id,
        seatNumber: selectedSeat,
        busNumber: busNumber,
        tripId: tripId
      }
    });

  } catch (error) {
    console.error("Reservation error:", error);
    alert("Could not reserve seat. It may already be taken.");
  }
};
////////////////////////////////////////////////////

  const availableSeats = seats.filter(s => !s.reserved).length;
  const reservedSeats = seats.filter(s => s.reserved).length;
  if (loadingSeats) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Loading seat layout...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating bus route lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,150 Q300,100 600,150 T1200,150" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="100" dur="20s" repeatCount="indefinite" />
        </path>
        <path d="M0,350 Q300,400 600,350 T1200,350" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="15s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Reserve Your Seat 💺
            </h1>
            <p className="text-blue-100 text-lg">
              Select the perfect seat for your journey
            </p>
          </div>

          {/* Journey Info Card */}
          <div className="mb-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-blue-200 text-sm mb-1">Departure</div>
                <div className="text-white font-bold text-lg">{bus.departure}</div>
              </div>
              <div>
                <div className="text-blue-200 text-sm mb-1">Arrival</div>
                <div className="text-white font-bold text-lg">{bus.arrival}</div>
              </div>
              <div>
                <div className="text-blue-200 text-sm mb-1">Price</div>
                <div className="text-white font-bold text-lg">{bus.price}</div>
              </div>
              <div>
                <div className="text-blue-200 text-sm mb-1">Available</div>
                <div className="text-green-300 font-bold text-lg">{availableSeats} seats</div>
              </div>
            </div>
          </div>

          {/* Bus Layout */}
          <BusLayout
            bus={bus}
            seats={seats}
            selectedSeat={selectedSeat}
            onSeatSelect={handleSeatSelect}
          />

          {/* Selection Summary & Confirm Button */}
          {selectedSeat ? (
            <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl border-2 border-blue-400/40">
                    <User className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">Seat {selectedSeat} Selected</div>
                    <div className="text-blue-100 text-sm">Ready to confirm your reservation</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-blue-200 text-sm">Total</div>
                  <div className="text-white font-bold text-2xl">{bus.price}</div>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <span>Confirm Reservation</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center space-x-3 text-blue-200">
                <Info className="w-5 h-5" />
                <span className="text-sm">Please select a seat to continue</span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{seats.length}</div>
                <div className="text-blue-100 text-xs">Total Seats</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-300">{availableSeats}</div>
                <div className="text-blue-100 text-xs">Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-300">{reservedSeats}</div>
                <div className="text-blue-100 text-xs">Reserved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}