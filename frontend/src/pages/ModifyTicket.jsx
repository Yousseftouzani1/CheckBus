import React, { useState, useEffect } from 'react';
import { Ticket, Bus, MapPin, AlertCircle, CheckCircle, Save, X } from 'lucide-react';

// ============= MAIN MODIFY TICKET PAGE =============
export default function ModifyTicket() {
  // ============= MOCK TICKET DATA =============
  // In real app, this comes from React Router: const { state } = useLocation();
  const ticket = {
    id: 101,
    userId: 1,
    tripId: 5, // Used to fetch seats for this trip
    busNumber: "B12",
    from: "Rabat Ville",
    to: "Agdal",
    seat: 14,
    seatcode: "S14",
    price: "25 MAD",
    status: "PAID"
  };

  // ============= COMPONENT STATE =============
  const [selectedSeat, setSelectedSeat] = useState(ticket.seat);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSeats, setIsFetchingSeats] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [seatMap, setSeatMap] = useState([]);

  // ============= HELPER FUNCTION =============
  const seatCodeToNumber = (seatCode) => {
    if (!seatCode) return null;
    const match = seatCode.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  };

  // ============= FETCH RESERVED SEATS =============
  useEffect(() => {
    loadSeats();
  }, []);

  async function loadSeats() {
    setIsFetchingSeats(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8081/api/tickets/trip/${ticket.tripId}`);

      let ticketList = [];
      if (response.ok) {
        ticketList = await response.json();
      } else {
        throw new Error('Failed to load seats');
      }

      // Build the full seat map (40 seats)
      const seats = [];
      for (let i = 1; i <= 40; i++) {
        seats.push({
          number: i,
          reserved: false
        });
      }

      // Mark booked seats from backend (except current user's seat)
      ticketList.forEach(t => {
        if (["RESERVED", "PAID", "VALIDATED"].includes(t.status) && t.id !== ticket.id) {
          const seatNumber = seatCodeToNumber(t.seatcode);
          const index = seats.findIndex(s => s.number === seatNumber);
          if (index !== -1) {
            seats[index].reserved = true;
          }
        }
      });

      setSeatMap(seats);
    } catch (err) {
      console.error('Failed to load seats:', err);
      setError('Failed to load available seats. Please refresh the page.');
    } finally {
      setIsFetchingSeats(false);
    }
  }

  // Check if changes were made
  const hasChanges = selectedSeat !== ticket.seat;

  // Check if can modify
  const canModify = ticket.status === 'PAID' || ticket.status === 'RESERVED';

  // ============= HANDLE SAVE =============
  const handleSave = async () => {
    setError('');

    if (!hasChanges) {
      setError('Please select a different seat before saving');
      return;
    }

    setIsLoading(true);

    try {
      // ============= BACKEND API CALL =============
      const response = await fetch(`http://localhost:8081/api/tickets/${ticket.id}/change`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newSeatCode: `S${selectedSeat}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to modify ticket');
      }

      const updatedTicket = await response.json();

      console.log('✅ Ticket modified:', updatedTicket);

      setShowSuccess(true);
      
      // Auto redirect after 2 seconds (uncomment in production)
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
              Modify Your Seat 💺
            </h1>
            <p className="text-blue-100 text-lg">
              Change your seat number for this trip
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
                    <div className="text-blue-200 text-xs mb-1">Current Seat</div>
                    <div className="text-white font-bold text-3xl">{ticket.seat}</div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-blue-200 text-xs mb-1">Price</div>
                    <div className="text-white font-bold">{ticket.price}</div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-blue-200 text-xs mb-1">Status</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      ticket.status === 'PAID' ? 'bg-green-500/20 text-green-300' :
                      ticket.status === 'RESERVED' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {ticket.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* ============= CENTER: SEPARATOR ============= */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="h-full w-px bg-white/20"></div>
              </div>

              {/* ============= RIGHT: SEAT SELECTION ============= */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Select New Seat</h3>

                {canModify ? (
                  <>
                    {/* Seat Selection */}
                    <div>
                      <label className="block text-white text-sm font-semibold mb-3">
                        Available Seats
                      </label>
                      
                      {isFetchingSeats ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                          <p className="text-blue-200">Loading available seats...</p>
                        </div>
                      ) : (
                        <div className="bg-white/5 rounded-2xl p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                          {/* Bus Layout */}
                          <div className="space-y-2">
                            {/* Driver Section */}
                            <div className="flex justify-end mb-4 pb-4 border-b border-white/10">
                              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs">🚗</span>
                              </div>
                            </div>
                            
                            {/* Seats Grid - 10 rows x 4 seats */}
                            {Array.from({ length: 10 }).map((_, rowIndex) => (
                              <div key={rowIndex} className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 4 }).map((_, colIndex) => {
                                  const seatNumber = rowIndex * 4 + colIndex + 1;
                                  const seat = seatMap.find(s => s.number === seatNumber);
                                  const isCurrentSeat = seatNumber === ticket.seat;
                                  const isReserved = seat?.reserved && !isCurrentSeat;
                                  const isSelected = selectedSeat === seatNumber;
                                  
                                  return (
                                    <button
                                      key={seatNumber}
                                      onClick={() => !isReserved && setSelectedSeat(seatNumber)}
                                      disabled={isLoading || isReserved}
                                      className={`aspect-square rounded-lg font-bold text-sm transition-all duration-300 relative ${
                                        isReserved
                                          ? 'bg-red-500/20 border-2 border-red-400/30 text-red-300 cursor-not-allowed'
                                          : isSelected
                                          ? 'bg-blue-500 border-2 border-blue-400 text-white scale-110 shadow-lg'
                                          : isCurrentSeat
                                          ? 'bg-yellow-500/30 border-2 border-yellow-400/50 text-yellow-200'
                                          : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 hover:scale-105'
                                      }`}
                                    >
                                      {seatNumber}
                                      {isCurrentSeat && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></span>
                                      )}
                                      {isReserved && (
                                        <X className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>

                          {/* Legend */}
                          <div className="mt-6 pt-4 border-t border-white/10">
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-white/10 border-2 border-white/20 rounded"></div>
                                <span className="text-blue-200">Available</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-red-500/20 border-2 border-red-400/30 rounded relative">
                                  <X className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-red-300" />
                                </div>
                                <span className="text-blue-200">Reserved</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-yellow-500/30 border-2 border-yellow-400/50 rounded relative">
                                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                                </div>
                                <span className="text-blue-200">Your Seat</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                        disabled={isLoading || !hasChanges || isFetchingSeats}
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
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 rounded-xl border-2 border-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
                  >
                    <span>Return to Profile</span>
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
                    <li>• Select a new seat from the available options</li>
                    <li>• Red seats with X are already reserved by other passengers</li>
                    <li>• Your current seat is marked with a yellow dot</li>
                    <li>• Price remains the same for seat modifications</li>
                    <li>• Changes are applied immediately after confirmation</li>
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
                Your seat has been changed successfully.
              </p>

              <div className="bg-white/5 rounded-xl p-4 text-left mb-6">
                <div className="text-blue-200 text-xs mb-1">New Seat</div>
                <div className="text-white font-bold text-3xl">{selectedSeat}</div>
              </div>

              <button
                onClick={handleCancel}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
              >
                <span>Return to Profile</span>
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