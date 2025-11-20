import React, { useState } from 'react';
import { Ticket, Bus, MapPin, Clock, ArrowRight, AlertCircle, CheckCircle, Save, X } from 'lucide-react';

// ============= MAIN MODIFY TICKET PAGE =============
export default function ModifyTicket() {
  // ============= DATA FROM PROFILE PAGE =============
  // In real app with React Router, receive data like this:
  // const { state } = useLocation();
  // const navigate = useNavigate();
  // const ticket = state?.ticket;
  
  // Mock ticket data (will come from Profile page via React Router state)
  const ticket = {
    id: 101,
    userId: 1,
    busNumber: "B12",
    from: "Rabat Ville",
    to: "Agdal",
    seat: 14,
    currentDeparture: "08:30",
    currentArrival: "09:15",
    price: "25 MAD",
    status: "PAID"
  };

  // ============= AVAILABLE TIMES (Mock - fetch from backend) =============
  const availableTimes = [
    { departure: "07:00", arrival: "07:45" },
    { departure: "08:30", arrival: "09:15" },
    { departure: "10:00", arrival: "10:45" },
    { departure: "12:00", arrival: "12:45" },
    { departure: "14:30", arrival: "15:15" },
    { departure: "17:00", arrival: "17:45" }
  ];

  // ============= AVAILABLE SEATS (Mock - fetch from backend) =============
  const availableSeats = [5, 8, 12, 15, 18, 21, 24, 27, 30, 33];

  // ============= COMPONENT STATE =============
  const [selectedDeparture, setSelectedDeparture] = useState(ticket.currentDeparture);
  const [selectedSeat, setSelectedSeat] = useState(ticket.seat);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if changes were made
  const hasChanges = 
    selectedDeparture !== ticket.currentDeparture || 
    selectedSeat !== ticket.seat;

  // Check if can modify
  const canModify = ticket.status === 'PAID' || ticket.status === 'RESERVED';

  // ============= HANDLE SAVE =============
  const handleSave = async () => {
    setError('');

    if (!hasChanges) {
      setError('Please make at least one change before saving');
      return;
    }

    setIsLoading(true);

    try {
      // ============= BACKEND API CALL =============
      // Replace this simulation with your real API call:
      
      /*
      const response = await axios.put(`/api/tickets/${ticket.id}/modify`, {
        userId: ticket.userId,
        newDeparture: selectedDeparture,
        newSeat: selectedSeat
      });
      
      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => navigate('/profile'), 2000);
      }
      */

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate random error for demo (remove in production)
      if (Math.random() < 0.2) {
        throw new Error('Seat already occupied');
      }

      console.log('✅ Ticket modified:', {
        ticketId: ticket.id,
        userId: ticket.userId,
        newDeparture: selectedDeparture,
        newSeat: selectedSeat
      });

      setShowSuccess(true);
      
      // Auto redirect after 2 seconds
      // setTimeout(() => navigate('/profile'), 2000);

    } catch (err) {
      console.error('❌ Modification error:', err);
      setError(err.message || 'Failed to modify ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============= HANDLE CANCEL =============
  const handleCancel = () => {
    console.log('Returning to profile');
    // navigate('/profile');
  };

  // ============= RENDER =============
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Bus route lines */}
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Modify Your Ticket ✏️
            </h1>
            <p className="text-blue-100 text-lg">
              Change your departure time or seat number
            </p>
          </div>

          {/* Cannot Modify Alert */}
          {!canModify && (
            <div className="mb-6 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4">
              <div className="flex items-center space-x-3 text-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">This ticket cannot be modified (Status: {ticket.status})</span>
              </div>
            </div>
          )}

          {/* Horizontal Layout Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* ============= LEFT: CURRENT INFO ============= */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Ticket className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Current Ticket</h3>
                    <p className="text-blue-200 text-sm">ID #{ticket.id}</p>
                  </div>
                </div>

                {/* Current Details */}
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-blue-200 text-xs mb-1">
                      <Bus className="w-3 h-3" />
                      <span>Bus</span>
                    </div>
                    <div className="text-white font-bold">{ticket.busNumber}</div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-blue-200 text-xs mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>Route</span>
                    </div>
                    <div className="text-white text-sm font-semibold">{ticket.from} → {ticket.to}</div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-blue-200 text-xs mb-1">
                      <Clock className="w-3 h-3" />
                      <span>Current Time</span>
                    </div>
                    <div className="text-white font-bold">{ticket.currentDeparture}</div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-blue-200 text-xs mb-1">Current Seat</div>
                    <div className="text-white font-bold text-xl">{ticket.seat}</div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-blue-200 text-xs mb-1">Price</div>
                    <div className="text-white font-bold">{ticket.price}</div>
                  </div>
                </div>
              </div>

              {/* ============= CENTER: SEPARATOR ============= */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="h-full w-px bg-white/20"></div>
              </div>

              {/* ============= RIGHT: MODIFICATION OPTIONS ============= */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Select New Options</h3>

                {canModify ? (
                  <>
                    {/* Departure Time Selection */}
                    <div>
                      <label className="block text-white text-sm font-semibold mb-3">
                        New Departure Time
                      </label>
                      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                        {availableTimes.map((time, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedDeparture(time.departure)}
                            disabled={isLoading}
                            className={`w-full p-4 rounded-xl transition-all duration-300 ${
                              selectedDeparture === time.departure
                                ? 'bg-blue-500 border-2 border-blue-400 ring-2 ring-blue-400/50'
                                : 'bg-white/10 border-2 border-white/20 hover:bg-white/20 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Clock className="w-5 h-5 text-white" />
                                <div className="text-left">
                                  <div className="text-white font-bold">{time.departure}</div>
                                  <div className="text-blue-200 text-xs">Arrives {time.arrival}</div>
                                </div>
                              </div>
                              {selectedDeparture === time.departure && (
                                <CheckCircle className="w-5 h-5 text-white" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Seat Selection */}
                    <div>
                      <label className="block text-white text-sm font-semibold mb-3">
                        New Seat Number
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {availableSeats.map((seat) => (
                          <button
                            key={seat}
                            onClick={() => setSelectedSeat(seat)}
                            disabled={isLoading}
                            className={`aspect-square rounded-xl font-bold transition-all duration-300 ${
                              selectedSeat === seat
                                ? 'bg-blue-500 border-2 border-blue-400 text-white scale-110'
                                : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 hover:scale-105'
                            }`}
                          >
                            {seat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                          <div className="text-red-200 text-sm">{error}</div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isLoading || !hasChanges}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-xl border-2 border-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
                  >
                    <span>Return to Profile</span>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Info Card */}
          {canModify && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-2">Important</h4>
                  <ul className="text-blue-100 text-sm space-y-1">
                    <li>• Select a new departure time OR a new seat number</li>
                    <li>• Price remains the same for modifications</li>
                    <li>• Changes are applied immediately after confirmation</li>
                    <li>• Only available seats and times are shown</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-300" strokeWidth={2.5} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
              <p className="text-blue-100 mb-6">
                Your ticket has been modified successfully.
              </p>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-3 text-left">
                  <div className="text-blue-200 text-xs mb-1">New Departure</div>
                  <div className="text-white font-bold">{selectedDeparture}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-left">
                  <div className="text-blue-200 text-xs mb-1">New Seat</div>
                  <div className="text-white font-bold">{selectedSeat}</div>
                </div>
              </div>

              <button
                onClick={handleCancel}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center group"
              >
                <span>Return to Profile</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}