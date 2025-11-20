import React, { useState } from "react";
import { User, Mail, Lock, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  
  // New states for email verification
  const [showVerification, setShowVerification] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

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
          username: fullName,
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Registration failed");
      }

      // Show verification modal instead of success
      setShowVerification(true);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyToken = async () => {
    setVerificationError("");
    
    if (!verificationToken.trim()) {
      setVerificationError("Please enter the verification code.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("http://localhost:8084/api/auth/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: verificationToken
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Token verification failed");
      }

      // Token verified, now create user
      await createUser();

    } catch (err) {
      setVerificationError(err.message);
      setIsVerifying(false);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: fullName,
          email: email
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "User creation failed");
      }

      // All done - show success modal
      setShowVerification(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setVerificationError(err.message);
      setIsVerifying(false);
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

        {/* Email Verification Modal */}
        {showVerification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full animate-slide-up">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-4">
                  <Mail className="w-10 h-10 text-blue-300" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Verify Your Email</h3>
                <p className="text-blue-100 mb-6">
                  We've sent a verification code to <strong>{email}</strong>. Please enter it below.
                </p>

                {/* Verification Token Input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-center text-lg tracking-widest"
                    placeholder="Enter verification code"
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value)}
                    disabled={isVerifying}
                  />
                </div>

                {/* Verification Error */}
                {verificationError && (
                  <div className="flex items-center gap-2 text-red-300 text-sm mb-4 bg-red-500/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}

                {/* Verify Button */}
                <button
                  onClick={handleVerifyToken}
                  disabled={isVerifying}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isVerifying ? "Verifying..." : "Verify Email"}</span>
                  {!isVerifying && (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  onClick={() => {
                    setShowVerification(false);
                    setVerificationToken("");
                    setVerificationError("");
                  }}
                  disabled={isVerifying}
                  className="w-full mt-3 text-blue-200 hover:text-white transition-colors py-2 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full animate-slide-up">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-green-300" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Account Created!</h3>
                <p className="text-blue-100 mb-6">
                  Your account has been successfully created and verified.
                </p>
                <p className="text-blue-200 text-sm">
                  Redirecting to login...
                </p>
              </div>
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
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}