import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  CreditCard,
  Crown,
  Stars,
  XCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SubscriptionCheckout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const subscription = state?.subscription;

  // If somehow the user comes without a subscription
  useEffect(() => {
    if (!subscription) navigate("/subscriptions");
  }, [subscription, navigate]);

  // Payment Inputs
  const [cardOwner, setCardOwner] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/29");
  const [cvc, setCvc] = useState("123");

  // Logic
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Dates
  const today = new Date();
  const formattedToday = today.toLocaleDateString("en-GB");

  const renewal = new Date();
  const daysToAdd = subscription?.durationDays || 30; // Weekly 7, Monthly 30, etc
  renewal.setDate(today.getDate() + daysToAdd);
  const formattedRenewal = renewal.toLocaleDateString("en-GB");

  // Handle Payment
  const handleConfirm = async () => {
    setProcessing(true);

    // Simulate API
    await new Promise((res) => setTimeout(res, 1500));

    // TODO:
    // - integrate with Stripe
    // - call backend payment service
    // - produce Kafka event: subscription.activated

    setShowSuccess(true);
    setProcessing(false);
  };

  if (!subscription) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden flex items-center justify-center p-6">

      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20 top-20 left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 bottom-20 right-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 max-w-2xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 animate-fade-in">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-xl mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Activate Your Subscription</h1>
          <p className="text-blue-100 mt-2">
            You're one step away from unlimited travel.
          </p>
        </div>

        {/* Subscription Summary */}
        <div className={`p-6 rounded-2xl bg-white/10 border border-white/20 mb-8`}>
          <h2 className="text-2xl font-bold text-white mb-1">{subscription.type}</h2>
          <p className="text-blue-100 text-sm mb-4">{subscription.durationLabel}</p>

          <div className="text-4xl font-extrabold text-white mb-4">
            {subscription.price} <span className="text-blue-200 text-2xl">MAD</span>
          </div>

          <div className="space-y-2">
            {subscription.perks.map((perk, i) => (
              <div key={i} className="flex items-center space-x-2 text-blue-100">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Inputs */}
        <div className="space-y-4">
          {/* Owner */}
          <div>
            <label className="text-blue-100 text-sm">Card Owner</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" />
              <input
                value={cardOwner}
                onChange={(e) => setCardOwner(e.target.value)}
                placeholder="Your Name"
                className="w-full mt-1 pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Card Number */}
          <div>
            <label className="text-blue-100 text-sm">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" />
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full mt-1 pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-blue-100 text-sm">Expiry</label>
              <input
                value={exp}
                onChange={(e) => setExp(e.target.value)}
                placeholder="12/29"
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-blue-100 text-sm">CVC</label>
              <input
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-6 text-white">
          <div className="flex justify-between mb-2">
            <span className="text-blue-200">Start Date</span>
            <span>{formattedToday}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-blue-200">Renews On</span>
            <span>{formattedRenewal}</span>
          </div>

          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total</span>
            <span>{subscription.price} MAD</span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={processing}
          className="mt-8 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.97] transition-all flex items-center justify-center"
        >
          {processing ? "Processing..." : "Confirm & Activate Subscription"}
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-300" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
            <p className="text-blue-100 mb-6">
              Your {subscription.type} is now active.
            </p>

            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center"
            >
              Go to My Profile
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in .4s ease-out; }
        .animate-slide-up { animation: slide-up .4s ease-out; }
      `}</style>
    </div>
  );
}
