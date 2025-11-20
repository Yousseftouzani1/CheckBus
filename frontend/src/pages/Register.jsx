import React, { useState } from "react";
import { User, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!fullName || !email || !password || !confirm) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8084/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: fullName,   // backend expects username
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Registration failed");
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl max-w-lg w-full animate-fade-in">

        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Create Account
        </h1>
        <p className="text-blue-100 text-center mb-10">
          Join our bus platform and travel smarter.
        </p>

        {/* Full Name */}
        <label className="text-blue-100 text-sm mb-1">Full Name</label>
        <div className="relative mb-4">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
          <input
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Your Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email */}
        <label className="text-blue-100 text-sm mb-1">Email</label>
        <div className="relative mb-4">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
          <input
            type="email"
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <label className="text-blue-100 text-sm mb-1">Password</label>
        <div className="relative mb-4">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
          <input
            type="password"
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <label className="text-blue-100 text-sm mb-1">Confirm Password</label>
        <div className="relative mb-6">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200" />
          <input
            type="password"
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-300 text-center mb-4">{error}</p>
        )}

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97]"
        >
          Create Account
          <ArrowRight className="inline ml-2" />
        </button>

        {/* Success Modal */}
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/10 p-8 border border-white/20 backdrop-blur-xl rounded-3xl text-center max-w-sm w-full animate-fade-in">
              <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-300" />
              </div>

              <h3 className="text-white text-2xl font-bold">Account Created!</h3>
              <p className="text-blue-100 mt-2">
                Redirecting to login...
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}
