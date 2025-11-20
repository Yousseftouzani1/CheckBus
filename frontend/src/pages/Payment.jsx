import React, { useState } from "react";
import { CreditCard, Lock, ArrowRight, CheckCircle, XCircle } from "lucide-react";

export default function Payment() {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242"); // auto-fill test card
  const [exp, setExp] = useState("12/29");
  const [cvc, setCvc] = useState("123");
  const[cardOwner,setCardOwner]=useState("The card Owner's Name")
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const response = await fetch("http://localhost:8080/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: 12,      // TODO: Replace with selected ticket ID
          amount: 20.00      // TODO: Replace with actual ticket amount
        })
      });

      const data = await response.json();
      setResult(data);

      if (data.status === "SUCCESS") {
  setShowSuccess(true);
}

    } catch (err) {
      setResult({ status: "FAILED", message: "Connection error" });
    }

    setProcessing(false);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">

    {/* Background shapes */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20 top-20 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 bottom-20 right-20 animate-pulse"></div>
    </div>

    {/* Payment Card */}
    <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl max-w-md w-full">

      <h1 className="text-3xl font-bold text-white mb-6 text-center">Payment</h1>
      <p className="text-blue-100 text-center mb-8">Secure test payment using Stripe</p>

      {/* Card Owner */}
      <label className="text-blue-100 text-sm mb-1">Card Owner</label>
      <div className="relative mb-4">
        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-200" />
        <input
          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
          value={cardOwner}
          onChange={(e) => setCardOwner(e.target.value)}
          placeholder="Your Name Please"
        />
      </div>

      {/* Card Number */}
      <label className="text-blue-100 text-sm mb-1">Card Number</label>
      <div className="relative mb-4">
        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
        <input
          className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="4242 4242 4242 4242"
        />
      </div>

      {/* Expiry & CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-blue-100 text-sm mb-1">Expiry</label>
          <input
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            value={exp}
            onChange={(e) => setExp(e.target.value)}
            placeholder="12/29"
          />
        </div>

        <div>
          <label className="text-blue-100 text-sm mb-1">CVC</label>
          <input
            className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder="123"
          />
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 rounded-xl mt-8 hover:from-blue-600 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-50"
      >
        {processing ? "Processing..." : "Pay Now"}
        <ArrowRight className="inline ml-2" />
      </button>

      {/* Result */}
      {result && (
        <div className="mt-8 text-center">
          {result.status === "SUCCESS" ? (
            <div className="text-green-400 flex flex-col items-center">
              <CheckCircle className="w-10 h-10" />
              <p className="text-xl font-bold mt-2">Payment Successful!</p>
            </div>
          ) : (
            <div className="text-red-400 flex flex-col items-center">
              <XCircle className="w-10 h-10" />
              <p className="text-xl font-bold mt-2">Payment Failed</p>
            </div>
          )}

          <p className="text-blue-100 mt-3">{result.message}</p>
        </div>
      )}
    </div>

    {/* SUCCESS MODAL */}
    {showSuccess && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full animate-slide-up">

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-300" strokeWidth={2.5} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-blue-100 mb-6">
              Your ticket has been purchased successfully.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center group"
            >
              <span>Close</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Modal animation */}
        <style>{`
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </div>
    )}

  </div>
);

}