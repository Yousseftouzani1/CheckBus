import React, { useState, useEffect } from 'react';
import {
  CreditCard, CheckCircle, XCircle, AlertCircle, Wallet, TrendingUp,
  MapPin, ArrowRight, Calendar, DollarSign, Ticket, ShoppingBag
} from 'lucide-react';

// ===============================================================
//                    MOCK FALLBACK DATA
// ===============================================================
const MOCK_STATS = {
  totalReserved: 2,
  totalBought: 5,
  totalCancelled: 1,
  totalSpent: 240
};

const MOCK_FAVORITE_ROUTES = [
  { depart: "Rabat Ville", arrivee: "Agdal", count: 12 },
  { depart: "Hay Riad", arrivee: "Temara", count: 9 },
  { depart: "Sale", arrivee: "Rabat Ville", count: 7 },
];

const MOCK_RECENT_PAYMENTS = [
  {
    id: 1,
    date: "Dec 10, 2025",
    amount: 25,
    reference: "Ticket #221",
    status: "SUCCESS"
  },
  {
    id: 2,
    date: "Dec 08, 2025",
    amount: 25,
    reference: "Ticket #219",
    status: "SUCCESS"
  },
  {
    id: 3,
    date: "Dec 07, 2025",
    amount: 120,
    reference: "Subscription (Monthly)",
    status: "SUCCESS"
  }
];

// ===============================================================
//                    PAYMENTS DASHBOARD PAGE
// ===============================================================
export default function PaymentsDashboard({ userId = 35 }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(MOCK_STATS);
  const [favoriteRoutes, setFavoriteRoutes] = useState(MOCK_FAVORITE_ROUTES);
  const [recentPayments, setRecentPayments] = useState(MOCK_RECENT_PAYMENTS);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        // Attempt fetch
        const [ticketsResponse, paymentsResponse, trajetsResponse] = await Promise.all([
  fetch(`http://localhost:8081/api/tickets/user/${userId}`),   // Ticket-Service
  fetch(`http://localhost:8085/api/payments/successful`),      // Payment-Service
  fetch(`http://localhost:8083/api/trajets`)   
        ]);

        if (!ticketsResponse.ok || !paymentsResponse.ok || !trajetsResponse.ok) {
          throw new Error("API failed -> using mock data");
        }

        // Parse real data
        const tickets = await ticketsResponse.json();
        const payments = await paymentsResponse.json();
        const trajets = await trajetsResponse.json();

        // ============= CALCULATE REAL STATS =============

        const paymentsPromises = tickets.map(t =>
        fetch(`http://localhost:8085/api/payments/ticket/${t.id}`)
          .then(r => r.ok ? r.json() : [])
          .catch(() => [])
      );

      const allPaymentsNested = await Promise.all(paymentsPromises);
      const allPayments = allPaymentsNested.flat();
      
      // 3️⃣ Keep only successful payments
      const successfulPayments = allPayments.filter(p => p.status === "SUCCESS");

      // 4️⃣ Compute total spent
      const totalSpent = successfulPayments.reduce(
        (sum, p) => sum + (p.amount || p.price || 0),
        0
      );
      // Optional: compute other ticket stats
      const reserved = tickets.filter(t => t.status === "RESERVED").length;
      const bought = tickets.filter(t => t.status === "PAID").length;
      const cancelled = tickets.filter(t => t.status === "CANCELLED").length;
        setStats({
          totalReserved: reserved,
          totalBought: bought,
          totalCancelled: cancelled,
          totalSpent
        });

        // ============= CALCULATE FAVORITE ROUTES =============
        const routeCount = {};
        tickets.forEach(t => {
          const trajet = trajets.find(tr => tr.id === t.tripId);
          if (!trajet) return;
          const key = `${trajet.depart}-${trajet.arrivee}`;
          routeCount[key] = (routeCount[key] || 0) + 1;
        });

        const sortedRoutes = Object.entries(routeCount)
          .map(([key, count]) => {
            const [depart, arrivee] = key.split("-");
            return { depart, arrivee, count };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);

        setFavoriteRoutes(sortedRoutes);

        // ============= RECENT PAYMENTS =============
        const formattedPayments = successfulPayments
  // ✅ Only payments linked to tickets
  .filter(p => p.ticketId !== null && p.ticketId !== undefined)
  // ✅ Sort by newest first (assuming createdAt exists)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  // ✅ Keep only the 10 most recent
  .slice(0, 10)
  // ✅ Format for dashboard display
  .map(p => ({
    id: p.id,
    date: new Date(p.createdAt || Date.now()).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }),
    amount: p.amount || p.price || 0,
    reference: `Ticket #${p.ticketId}`,
    status: p.status || "SUCCESS"
  }));

setRecentPayments(formattedPayments);


      } catch (error) {
        console.warn("⚠ API FAILED — Using mocked dashboard data instead.");
        setStats(MOCK_STATS);
        setFavoriteRoutes(MOCK_FAVORITE_ROUTES);
        setRecentPayments(MOCK_RECENT_PAYMENTS);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [userId]);

  // ===============================================================
  //                      LOADING SCREEN
  // ===============================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ===============================================================
  //                      MAIN PAGE
  // ===============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">

      {/* ---------------- BACKGROUND DECOR ---------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Bus route lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <path d="M0,150 Q300,100 600,150 T1200,150"
          stroke="white" strokeWidth="2" fill="none" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="100" dur="20s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-12">

        <div className="max-w-7xl mx-auto">

          {/* ===============================================================
              HEADER
            =============================================================== */}
          <div className="text-center mb-12">
<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl mb-6 shadow-2xl animate-bounce-slow">
  <Wallet className="w-10 h-10 text-white" />
</div>


            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              My Payments Dashboard 
            </h1>
            <p className="text-blue-100 text-lg">Track your spending and ticket activity</p>
          </div>

          {/* ===============================================================
              OVERVIEW CARDS
            =============================================================== */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-yellow-300" />
              <h2 className="text-2xl font-bold text-white">Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Bought */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:scale-105 transition-all">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-300" />
                  </div>
                  <div className="text-green-300">Bought</div>
                </div>
                <div className="text-4xl text-white font-bold">{stats.totalBought}</div>
                <p className="text-blue-200 text-sm">Tickets purchased</p>
              </div>

              {/* Reserved */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:scale-105 transition-all">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="text-blue-300">Reserved</div>
                </div>
                <div className="text-4xl text-white font-bold">{stats.totalReserved}</div>
                <p className="text-blue-200 text-sm">Pending tickets</p>
              </div>

              {/* Cancelled */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:scale-105 transition-all">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-300" />
                  </div>
                  <div className="text-red-300">Cancelled</div>
                </div>
                <div className="text-4xl text-white font-bold">{stats.totalCancelled}</div>
                <p className="text-blue-200 text-sm">Refunded tickets</p>
              </div>

              {/* Total Spent */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30 hover:scale-105 transition-all shadow-lg">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div className="text-yellow-300">Total Spent</div>
                </div>
                <div className="text-4xl text-white font-bold">{stats.totalSpent}</div>
                <p className="text-yellow-200 text-sm">MAD spent</p>
              </div>

            </div>
          </div>

          {/* ===============================================================
              FAVORITE ROUTES
            =============================================================== */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-blue-300" />
              <h2 className="text-2xl text-white font-bold">Most Used Routes</h2>
            </div>

            {favoriteRoutes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {favoriteRoutes.map((route, index) => (
                  <div key={index}
                    className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:scale-105 transition-all">

                    <div className="flex justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-blue-300" />
                        </div>
                        <span className="text-blue-200 text-sm font-semibold">
                          Route #{index + 1}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                        <span className="text-blue-200 text-xs font-bold">{route.count}x</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-white">
                      <span className="font-semibold">{route.depart}</span>
                      <ArrowRight className="w-4 h-4 text-blue-300" />
                      <span className="font-semibold">{route.arrivee}</span>
                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <div className="text-center py-8 text-blue-200">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No routes yet. Start traveling!</p>
              </div>
            )}

          </div>

          {/* ===============================================================
              RECENT PAYMENTS
            =============================================================== */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">

            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="w-6 h-6 text-green-300" />
              <h2 className="text-2xl text-white font-bold">Recent Payments</h2>
            </div>

            {recentPayments.length > 0 ? (
              <div className="space-y-4">
                {recentPayments.map((payment, index) => (
                  <div key={payment.id}
                    className="relative bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">

                    {/* Timeline line */}
                    {index !== recentPayments.length - 1 && (
                      <div className="absolute left-8 top-[60px] w-0.5 h-12 bg-white/20"></div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">

                        {/* Icon */}
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-300" />
                        </div>

                        {/* Details */}
                        <div>
                          <div className="flex space-x-3 mb-1">
                            <span className="text-white font-bold text-lg">{payment.amount} MAD</span>
                            <span className="px-2 py-0.5 bg-green-500/20 border border-green-400/30 text-green-200 text-xs rounded-full">
                              {payment.status}
                            </span>
                          </div>

                          <div className="flex space-x-3 text-blue-200 text-sm">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{payment.date}</span>
                            </div>
                            <span className="text-blue-300">•</span>
                            <div className="flex items-center space-x-1">
                              <Ticket className="w-3 h-3" />
                              <span>{payment.reference}</span>
                            </div>
                          </div>

                        </div>
                      </div>

                      <ArrowRight className="w-5 h-5 text-blue-300 opacity-0 group-hover:opacity-100 transition-transform" />

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-blue-200">
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No payments yet</p>
              </div>
            )}

          </div>

          {/* ===============================================================
              CTA BUTTONS
            =============================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<button className="bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold py-6 rounded-2xl shadow-2xl hover:from-purple-600 hover:to-violet-700 hover:scale-105 transition-all flex items-center justify-center">
  <ShoppingBag className="w-6 h-6 mr-3" />
  Buy New Ticket
  <ArrowRight className="w-6 h-6 ml-3" />
</button>


            <button className="bg-white/10 border-2 border-white/20 text-white font-bold py-6 rounded-2xl hover:scale-105 transition-all flex items-center justify-center backdrop-blur-sm">
              <Ticket className="w-6 h-6 mr-3" />
              View My Tickets
              <ArrowRight className="w-6 h-6 ml-3" />
            </button>

          </div>

        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>

    </div>
  );
}
