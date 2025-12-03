import React, { useState, useEffect } from 'react';
import { User, Ticket, CreditCard, Bus, ArrowRight, Trash2, RefreshCw, X, Calendar, MapPin, Clock, Mail, Edit, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import CryptoJS from "crypto-js";
import { useTrajet } from "../hooks/useTrajet"; // adjust the path
export const generateTicketPDF = (ticket) => {
  const doc = new jsPDF();

  // ====== Brand Colors ======
  const colors = {
    primary: [37, 99, 235], // Blue
    accent: [79, 70, 229], // Indigo
    text: [30, 41, 59], // Slate-800
    gray: [100, 116, 139], // Slate-500
    lightGray: [226, 232, 240], // Slate-200
    background: [248, 250, 252], // Slate-50
    white: [255, 255, 255],
  };

  const statusColor =
    ticket.status === "PAID"
      ? [22, 163, 74] // Green
      : ticket.status === "RESERVED"
      ? [234, 179, 8] // Yellow
      : [220, 38, 38]; // Red

  // ====== Background ======
  doc.setFillColor(...colors.background);
  doc.rect(0, 0, 210, 297, "F");

  // ====== Header ======
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, 210, 25, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...colors.white);
  doc.text("TransitGo - Ticket", 105, 17, { align: "center" });

  // ====== Ticket Status ======
  doc.setFillColor(...statusColor);
  doc.roundedRect(160, 30, 35, 10, 2, 2, "F");
  doc.setFontSize(10);
  doc.setTextColor(...colors.white);
  doc.text(ticket.status || "UNKNOWN", 177, 37, { align: "center" });

  // ====== Section: Ticket Info ======
  let y = 50;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.text);
  doc.setFontSize(14);
  doc.text("Ticket Information", 20, y);
  y += 6;
  doc.setDrawColor(...colors.lightGray);
  doc.line(20, y, 190, y);
  y += 10;

  const info = [
    ["Ticket ID", `#${ticket.id}`],
    ["Trip ID", `#${ticket.tripId}`],
    ["Seat Number", ticket.seatcode || "N/A"],
    ["Price", `${ticket.price} MAD`],
    ["Status", ticket.status || "N/A"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  info.forEach(([label, value]) => {
    doc.setTextColor(...colors.gray);
    doc.text(label, 25, y);
    doc.setTextColor(...colors.text);
    doc.text(value.toString(), 80, y);
    y += 8;
  });

  // ====== Section: Booking Details ======
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.text);
  doc.setFontSize(14);
  doc.text("Booking Details", 20, y);
  y += 6;
  doc.setDrawColor(...colors.lightGray);
  doc.line(20, y, 190, y);
  y += 10;

  const createdDate = new Date(ticket.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const createdTime = new Date(ticket.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const bookingDetails = [
    ["Booking Date", createdDate],
    ["Booking Time", createdTime],
  ];

  if (ticket.reservation_Time) {
    const reservedUntil = new Date(ticket.reservation_Time).toLocaleString();
    bookingDetails.push(["Reserved Until", reservedUntil]);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  bookingDetails.forEach(([label, value]) => {
    doc.setTextColor(...colors.gray);
    doc.text(label, 25, y);
    doc.setTextColor(...colors.text);
    doc.text(value.toString(), 80, y);
    y += 8;
  });

  // ====== Section: Trajet (if available) ======
  if (ticket.depart || ticket.arrivee) {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.text);
    doc.setFontSize(14);
    doc.text("Journey Details", 20, y);
    y += 6;
    doc.setDrawColor(...colors.lightGray);
    doc.line(20, y, 190, y);
    y += 10;

    const trajetInfo = [
      ["Departure", ticket.depart || "Unknown"],
      ["Arrival", ticket.arrivee || "Unknown"],
      ["Stops", (ticket.arrets || []).join(", ") || "None"],
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    trajetInfo.forEach(([label, value]) => {
      doc.setTextColor(...colors.gray);
      doc.text(label, 25, y);
      doc.setTextColor(...colors.text);
      doc.text(value.toString(), 80, y, { maxWidth: 110 });
      y += 8;
    });
  }

  // ====== Footer ======
  y = 275;
  doc.setDrawColor(...colors.lightGray);
  doc.line(20, y, 190, y);
  doc.setTextColor(...colors.gray);
  doc.setFontSize(10);
  doc.text("Thank you for traveling with TransitGo!", 105, y + 6, {
    align: "center",
  });
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    105,
    y + 12,
    { align: "center" }
  );
// ======= Generate a unique signature =======
const secret = "TransitGoSecretKey2025"; // keep same on backend if verifying
const dataString = `${ticket.id}-${ticket.tripId}-${ticket.userId || "?"}-${ticket.createdAt}-${ticket.price}`;
const hash = CryptoJS.HmacSHA256(dataString, secret).toString(CryptoJS.enc.Hex);
const signature = hash.substring(0, 16).toUpperCase(); // shorten for readability
//=====================
// ======= UNIQUE SIGNATURE =======
const yFooter = 260;
doc.setDrawColor(...colors.lightGray);
doc.line(20, yFooter, 190, yFooter);

doc.setFontSize(9);
doc.setTextColor(...colors.gray);
doc.text("Verification Signature:", 25, yFooter + 8);
doc.setFont("helvetica", "bold");
doc.setTextColor(...colors.primary);
doc.text(signature, 70, yFooter + 8);

doc.setFont("helvetica", "italic");
doc.setTextColor(...colors.gray);
doc.text(
  "Verify this code on TransitGo's website to confirm authenticity.",
  25,
  yFooter + 14
);

  // ====== Save PDF ======
  doc.save(`TransitGo_Ticket_${ticket.id}.pdf`);
};


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

// ============= API FUNCTION =============
const fetchUserTickets = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8081/api/tickets/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    const tickets = await response.json();
    return tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
};

// ============= MOCK DATA =============
const MOCK_SUBSCRIPTIONS = [
  {
    id: 1,
    type: "Monthly Pass",
    price: 120,
    status: "ACTIVE",
    renewsOn: "2025-12-01",
    gradient: "from-blue-500 to-indigo-600",
    perks: ["Unlimited rides", "Priority notifications", "Real-time tracking"]
  },
  {
    id: 2,
    type: "Student Pass",
    price: 80,
    status: "EXPIRED",
    renewsOn: "2025-09-01",
    gradient: "from-green-500 to-emerald-500",
    perks: ["Unlimited rides", "Student pricing", "Campus routes"]
  }
];

// ============= TICKET DETAILS MODAL =============
function TicketDetailsModal({ ticket, onClose, onModify, onRefund, onPay, onUnreserve }) {
  
  const [trajet, setTrajet] = React.useState(null);
  const [loadingTrajet, setLoadingTrajet] = React.useState(true);

// ✅ Fetch trajet details when the modal opens
    React.useEffect(() => {
      const fetchTrajet = async () => {
    if (!ticket?.tripId) return;
    try {
      const response = await fetch(`http://localhost:8083/api/trajets/${ticket.tripId}`);
      if (!response.ok) throw new Error("Failed to fetch trajet");
      const data = await response.json();
      setTrajet(data);
    } catch (err) {
      console.error("❌ Error fetching trajet:", err);
      setTrajet(null);
    } finally {
      setLoadingTrajet(false);
    }
  };

  fetchTrajet();
}, [ticket.tripId]);
if (!ticket) return null;
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full animate-slide-up">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl mb-4 shadow-lg">
            <Ticket className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Ticket Details</h3>
          <p className="text-blue-100 text-sm">ID: #{ticket.id}</p>
        </div>

        {/* Details */}
        <div className="space-y-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4">
<div className="flex items-start space-x-3 mb-3">
  <Bus className="w-5 h-5 text-blue-300 mt-1" />
  <div className="text-white">
    <div className="font-semibold text-lg">Trip #{ticket.tripId}</div>

    {/* ✅ Loading or error state */}
    {loadingTrajet ? (
      <div className="text-blue-200 text-xs mt-1">Loading trip details...</div>
    ) : trajet ? (
      <>
        {/* ✅ Trajet route */}
        <div className="text-blue-200 text-sm mt-1">
          {trajet.depart} → {trajet.arrivee}
        </div>

        {/* ✅ Stops (arrets) */}
        {trajet.arrets?.length > 0 && (
          <div className="mt-1 text-blue-100 text-xs">
            <span className="font-semibold text-blue-300">Stops:</span>{" "}
            {trajet.arrets.join(" • ")}
          </div>
        )}

        {/* ✅ Optional: Line code and distance */}
        <div className="text-blue-300 text-xs mt-1">
          {trajet.ligneCode && (
            <span className="mr-2">Line: {trajet.ligneCode}</span>
          )}
          {trajet.distanceKm && (
            <span>Distance: {trajet.distanceKm} km</span>
          )}
        </div>
      </>
    ) : (
      <div className="text-red-300 text-xs mt-1">Trip details unavailable</div>
    )}
  </div>
</div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-blue-200 text-sm">Seat</div>
                <div className="text-white font-semibold">{ticket.seatcode}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-blue-200 text-sm">Price</div>
                <div className="text-white font-bold text-lg">{ticket.price} MAD</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-blue-200 text-sm">Status</div>
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  ticket.status === 'PAID' 
                    ? 'bg-green-500/20 text-green-200' 
                    : ticket.status === 'RESERVED'
                    ? 'bg-blue-500/20 text-blue-200'
                    : 'bg-red-500/20 text-red-200'
                }`}>
                  {ticket.status}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-blue-200 text-sm">
              <Calendar className="w-4 h-4" />
              <div>
                <div className="text-xs text-blue-300">Booked on</div>
                <div className="text-white font-medium">{formatDate(ticket.createdAt)}</div>
              </div>
            </div>

            {ticket.reservation_Time && (
              <div className="flex items-center space-x-2 text-blue-200 text-sm pt-2 border-t border-white/10">
                <Clock className="w-4 h-4" />
                <div>
                  <div className="text-xs text-blue-300">Reserved on</div>
                  <div className="text-white font-medium">{formatDate(ticket.reservation_Time)}</div>
                </div>
              </div>
            )}

            {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
              <div className="flex items-center space-x-2 text-blue-200 text-sm pt-2 border-t border-white/10">
                <RefreshCw className="w-4 h-4" />
                <div>
                  <div className="text-xs text-blue-300">Last updated</div>
                  <div className="text-white font-medium">{formatDate(ticket.updatedAt)}</div>
                </div>
              </div>
            )}
          </div>

          {ticket.qr_code && (
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-blue-200 text-xs mb-2">QR Code</div>
              <div className="bg-white p-2 rounded-lg inline-block">
                <div className="text-xs text-gray-800 font-mono break-all">{ticket.qr_code}</div>
              </div>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3">

          {/* RESERVED ONLY EXTRA BUTTONS */}
          {ticket.status === "RESERVED" && (
            <>
              <button
                onClick={() => onPay(ticket)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Now</span>
              </button>

              <button
                onClick={() => onUnreserve(ticket)}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 font-semibold py-3 rounded-xl border border-yellow-400/30 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Unreserve Seat</span>
              </button>
            </>
          )}

          {/* Existing buttons */}
          {ticket.status !== "CANCELLED" && (
            <>
              <button
                onClick={() => onModify(ticket)}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl border border-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Modify Ticket</span>
              </button>

              <button
                onClick={() => onRefund(ticket)}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold py-3 rounded-xl border border-red-400/30 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Request Refund</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

// ============= TICKET CARD =============
function TicketCard({ ticket, onViewDetails, onRefund, onPay, onUnreserve }) {

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/20 text-green-200 border-green-400/30";
      case "RESERVED":
        return "bg-blue-500/20 text-blue-200 border-blue-400/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-200 border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-400/30";
    }
  };
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  const ticketId = ticket.id;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 hover:scale-[1.02] transition-all duration-300 group">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-white font-bold">Trip #{ticket.tripId}</div>
            <div className="text-blue-200 text-xs">Ticket #{ticket.id}</div>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 border ${getStatusColor(ticket.status)}`}>
          <span>{ticket.status}</span>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-100 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Seat: {ticket.seatcode}</span>
          </div>
          <div className="text-white font-bold text-lg">{ticket.price} MAD</div>
        </div>

        {ticket.createdAt && (
          <div className="flex items-center space-x-2 text-blue-200 text-xs">
            <Calendar className="w-3 h-3" />
            <span>Booked: {formatDate(ticket.createdAt)}</span>
          </div>
        )}

        {ticket.reservation_Time && ticket.status === "RESERVED" && (
          <div className="flex items-center space-x-2 text-yellow-200 text-xs">
            <Clock className="w-3 h-3" />
            <span>Reserved: {formatDate(ticket.reservation_Time)}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">

        <div className="flex space-x-2">

          {/* Details */}
          <button
            onClick={() => onViewDetails(ticket)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-all duration-300"
          >
            Details
          </button>

{/* Always show Download PDF */}
{ticket.status === "RESERVED" ? (
  <>
    <button
      onClick={() => navigate('/payment', { state: { ticketId } })}
      className="px-3 py-2 bg-blue-500/30 hover:bg-blue-500/50 text-white text-sm rounded-lg transition-all duration-300"
    >
      Pay
    </button>

    <button
      onClick={() => generateTicketPDF(ticket)}
      className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 text-sm rounded-lg transition-all duration-300"
    >
      Download PDF
    </button>
  </>
) : (
  // ✅ For PAID or other statuses, show only the Download PDF button
  <button
    onClick={() => generateTicketPDF(ticket)}
    className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 text-sm rounded-lg transition-all duration-300"
  >
    Download PDF
  </button>
)}


          {/* Refund */}
          {(ticket.status !== "CANCELLED" && ticket.status !== "RESERVED") && (
            <button
              onClick={() => onRefund(ticket)}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

// ============= TICKET LIST =============
function TicketList({ tickets, onViewDetails, onRefund, onPay, onUnreserve }) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <Ticket className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
        <p className="text-white text-lg font-semibold mb-2">No tickets yet</p>
        <p className="text-blue-100 text-sm">Your purchased tickets will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onViewDetails={onViewDetails}
          onRefund={onRefund}
          onPay={onPay}
          onUnreserve={onUnreserve}
        />
      ))}
    </div>
  );
}

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// ============= SUBSCRIPTION CARD =============
function SubscriptionCard({ subscription, onCancel }) {
  const isActive = subscription.status === "ACTIVE";

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 hover:scale-[1.02] transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${subscription.startDate} rounded-xl flex items-center justify-center shadow-lg`}>
            <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-white font-bold text-lg">{subscription.planType}</div>
            <div className="text-blue-200 text-xs">{subscription.price} MAD</div>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          isActive 
            ? 'bg-green-500/20 text-green-200 border-green-400/30' 
            : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
        }`}>
          {subscription.status}
        </div>
      </div>

      {/* Perks */}
      <div className="mb-4 space-y-2">
        {(subscription.perks || []).map((perk, index) => (
          <div key={index} className="flex items-center space-x-2 text-blue-100 text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>{perk}</span>
          </div>
        ))}
      </div>

      {/* Renewal Date */}
      <div className="mb-4 bg-white/5 rounded-lg p-3 flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-blue-300" />
        <div className="text-sm">
          <span className="text-blue-200">
            {isActive ? 'Renews on' : 'Expired on'}:
          </span>
          <span className="text-white font-semibold ml-2">{formatDate(subscription.endDate)}</span>
          
        </div>
      </div>

      {/* Actions */}
      {isActive && (
        <button
          onClick={() => onCancel(subscription)}
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-red-400/30"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel Subscription</span>
        </button>
      )}
    </div>
  );
}

// ============= SUBSCRIPTION LIST =============
function SubscriptionList({ subscriptions, onCancel }) {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <CreditCard className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
        <p className="text-white text-lg font-semibold mb-2">No subscriptions</p>
        <p className="text-blue-100 text-sm">Subscribe to a plan to see it here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {subscriptions.map(subscription => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}

// ============= USER HEADER =============
function UserHeader({ user }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
      <div className="flex items-center space-x-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
            <User className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-blue-100">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Member since {user.memberSince}</span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 flex items-center space-x-2">
          <Edit className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}

// ============= MAIN PROFILE PAGE =============
export default function Profile() {
  const navigate = useNavigate();
  
  // Get user from JWT token
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
// ✅ Subscriptions state
const [subscriptions, setSubscriptions] = useState([]);
const [loadingSubs, setLoadingSubs] = useState(true);
const [selectedTicket, setSelectedTicket] = useState(null);
  useEffect(() => {
    const userData = getUserFromToken();
    
    if (!userData) {
      // No valid token found, redirect to login
      console.warn('No valid authentication found, redirecting to login');
      navigate('/');
      return;
    }
    
    setUser(userData);
    console.log('User loaded from JWT:', userData);

// ✅ Fetch subscriptions for the logged-in user
const loadSubscriptions = async () => {
  try {
    setLoadingSubs(true);
    const response = await fetch(`http://localhost:8087/api/subscriptions/user/${userData.userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch subscriptions: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Subscriptions loaded:", data);
    setSubscriptions(data);
  } catch (error) {
    console.error("❌ Error fetching subscriptions:", error);
    setSubscriptions([]);
  } finally {
    setLoadingSubs(false);
  }
};

// Call it right after defining
loadSubscriptions();

    // Fetch user tickets
    const loadTickets = async () => {
      setLoadingTickets(true);
      const userTickets = await fetchUserTickets(userData.userId);
      setTickets(userTickets);
      setLoadingTickets(false);
    };

    loadTickets();
  }, [navigate]);

  // Action handlers
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

const handleRefundTicket = async (ticket) => {
  console.log('Requesting refund for ticket:', ticket);

  try {
    const response = await fetch(`http://localhost:8081/api/tickets/${ticket.id}/cancel`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l’annulation du ticket');
    }

    const data = await response.json();
    alert(`Le ticket #${ticket.id} a été annulé avec succès !`);

    console.log('Cancel response:', data);

  } catch (error) {
    console.error(error);
    alert("Impossible d'annuler ce ticket.");
  }
};


const handleModifyTicket = (ticket) => {
    console.log('Modifying ticket:', ticket);
    // TODO: Navigate to ticket modification page
    // navigate(`/tickets/${ticket.id}/modify`);
    alert(`Modify ticket #${ticket.id}`);
    navigate(`/tickets/${ticket.id}/modify`, { state: { ticket } });
  };

const handleCancelSubscription = async (subscription) => {
  console.log("Cancelling subscription:", subscription);

  // 🧭 Step 1. Ask for confirmation (modern alert)
  const userConfirmed = window.confirm(
    `Are you sure you want to cancel your ${subscription.planType || subscription.type} subscription?`
  );

  if (!userConfirmed) return;

  try {
    // 📨 Step 2. Send POST request to backend
    const response = await fetch("http://localhost:8087/api/subscriptions/cancel-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription.id), // backend expects just the ID
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel subscription (${response.status})`);
    }

    const updatedSubscription = await response.json();

    // ✅ Step 3. Update local state immediately
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === updatedSubscription.id ? updatedSubscription : s))
    );

    // ✅ Step 4. Feedback to the user
    alert(`${subscription.planType || subscription.type} subscription cancelled successfully.`);
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    alert("Failed to cancel subscription. Please try again later.");
  }
};


  // Show loading state while checking authentication
  if (!user || loadingTickets) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-2">Loading...</div>
          {loadingTickets && <div className="text-blue-200 text-sm">Fetching your tickets...</div>}
        </div>
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
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My Profile 
            </h1>
            <p className="text-blue-100 text-lg">
              Manage your account, tickets, and subscriptions
            </p>
          </div>

          {/* User Header */}
          <UserHeader user={user} />

          {/* Tickets Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Ticket className="w-6 h-6 text-blue-200" />
              <h3 className="text-2xl font-bold text-white">My Tickets</h3>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-semibold">
                {tickets.length}
              </span>
            </div>
            <TicketList
              tickets={tickets}
              onViewDetails={handleViewTicket}
              onRefund={handleRefundTicket}
            />
          </div>

        {/* Subscriptions Section */}
  <div>
  <div className="flex items-center space-x-3 mb-6">
    <CreditCard className="w-6 h-6 text-blue-200" />
    <h3 className="text-2xl font-bold text-white">My Subscriptions</h3>
    <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm font-semibold">
      {subscriptions.filter(s => s.status === "ACTIVE").length} Active
    </span>
  </div>

  {loadingSubs ? (
    <div className="text-center text-blue-200">Loading your subscriptions...</div>
  ) : (
    <SubscriptionList
      subscriptions={subscriptions}
      onCancel={handleCancelSubscription}
    />
  )}
  </div>

        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={handleCloseModal}
          onModify={handleModifyTicket}
          onRefund={handleRefundTicket}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}