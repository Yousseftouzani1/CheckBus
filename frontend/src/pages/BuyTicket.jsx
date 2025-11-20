import React, { useState } from 'react';
import { Bus, MapPin, Clock, ArrowRight, Calendar, Info, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// ============= MOCK DATA =============
const STATIONS = [
  "Rabat Ville",
  "Agdal",
  "Temara",
  "Kenitra",
  "Sale",
  "Hay Riad",
  "Souissi",
  "Casa Voyageurs",
  "Mohammedia",
  "Ain Sebaa"
];

const MOCK_BUSES = [
  {
    id: 1,
    number: "B12",
    departure: "08:30",
    arrival: "09:15",
    status: "On Time",
    delay: 0,
    price: "25 MAD",
    from: "Rabat Ville",
    to: "Kenitra"
  },
  {
    id: 2,
    number: "B34",
    departure: "09:00",
    arrival: "09:50",
    status: "On Time",
    delay: 0,
    price: "25 MAD",
    from: "Rabat Ville",
    to: "Kenitra"
  },
  {
    id: 3,
    number: "B56",
    departure: "10:15",
    arrival: "11:05",
    status: "Delayed",
    delay: 10,
    price: "25 MAD",
    from: "Rabat Ville",
    to: "Kenitra"
  },
  {
    id: 4,
    number: "A21",
    departure: "07:45",
    arrival: "08:20",
    status: "On Time",
    delay: 0,
    price: "20 MAD",
    from: "Agdal",
    to: "Temara"
  },
  {
    id: 5,
    number: "C15",
    departure: "11:30",
    arrival: "12:15",
    status: "On Time",
    delay: 0,
    price: "30 MAD",
    from: "Rabat Ville",
    to: "Casa Voyageurs"
  }
];

// ============= AUTOCOMPLETE INPUT COMPONENT =============
function AutocompleteInput({ label, value, onChange, icon: Icon, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStations, setFilteredStations] = useState(STATIONS);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    const filtered = STATIONS.filter(station =>
      station.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredStations(filtered);
    setIsOpen(true);
  };

  const handleSelectStation = (station) => {
    onChange(station);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-white text-sm font-semibold mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-blue-200" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <ChevronDown className={`h-5 w-5 text-blue-200 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && value && filteredStations.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {filteredStations.map((station, index) => (
              <button
                key={index}
                onClick={() => handleSelectStation(station)}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/20 transition-colors duration-200 flex items-center space-x-3 border-b border-white/10 last:border-b-0"
              >
                <MapPin className="h-4 w-4 text-blue-300" />
                <span>{station}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============= STATION SEARCH COMPONENT =============
function StationSearch({ onSearch }) {
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');

  const handleSearch = () => {
    if (startStation && endStation) {
      onSearch(startStation, endStation);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg">
          <Bus className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Search Your Journey</h2>
          <p className="text-blue-100 text-sm">Find the perfect bus for your trip</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <AutocompleteInput
          label="Starting Station"
          value={startStation}
          onChange={setStartStation}
          icon={MapPin}
          placeholder="Select starting point"
        />
        <AutocompleteInput
          label="Destination Station"
          value={endStation}
          onChange={setEndStation}
          icon={MapPin}
          placeholder="Select destination"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={!startStation || !endStation}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span>Search Buses</span>
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

// ============= BUS CARD COMPONENT =============
function BusCard({ bus, onBuyTicket ,onReserveSeat  }) {
  const isDelayed = bus.status === "Delayed";

  return (
    <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg">
            <Bus className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bus {bus.number}</h3>
            <p className="text-blue-100 text-sm">{bus.from} → {bus.to}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${
          isDelayed 
            ? 'bg-red-500/20 text-red-200 border border-red-400/30' 
            : 'bg-green-500/20 text-green-200 border border-green-400/30'
        }`}>
          {isDelayed ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <CheckCircle className="w-3 h-3" />
          )}
          <span>{bus.status}</span>
        </div>
      </div>

      {/* Time Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center space-x-2 text-blue-200 text-xs mb-1">
            <Clock className="w-3 h-3" />
            <span>Departure</span>
          </div>
          <div className="text-white font-bold text-lg">{bus.departure}</div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center space-x-2 text-blue-200 text-xs mb-1">
            <Clock className="w-3 h-3" />
            <span>Arrival</span>
          </div>
          <div className="text-white font-bold text-lg">{bus.arrival}</div>
        </div>
      </div>

      {/* Delay Warning */}
      {isDelayed && (
        <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-400/20 rounded-lg flex items-center space-x-2">
          <Info className="w-4 h-4 text-red-300" />
          <span className="text-red-200 text-sm">Delayed by {bus.delay} minutes</span>
        </div>
      )}

      {/* Footer */}
{/* Footer */}
<div className="flex items-center justify-between pt-4 border-t border-white/10">
  <div>
    <div className="text-blue-200 text-xs">Price</div>
    <div className="text-white font-bold text-xl">{bus.price}</div>
  </div>

  <div className="flex space-x-3">

    {/* BUY TICKET */}
    <button
      onClick={() => onBuyTicket(bus)}
      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg flex items-center space-x-2"
    >
      <span>Buy</span>
      <ArrowRight className="w-4 h-4" />
    </button>

    {/* RESERVE SEAT */}
    <button
      onClick={() => onReserveSeat(bus)}
      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold px-4 py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg flex items-center space-x-2"
    >
      <span>Reserve</span>
    </button>

  </div>
</div>

    </div>
  );
}

// ============= BUS RESULTS COMPONENT =============
function BusResults({ buses, onBuyTicket ,onReserveSeat }) {
  if (buses.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-200" />
        <h3 className="text-2xl font-bold text-white">
          Available Buses ({buses.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map((bus) => (
          <BusCard 
  key={bus.id} 
  bus={bus} 
  onBuyTicket={onBuyTicket}
  onReserveSeat={onReserveSeat}
/>

        ))}
      </div>
    </div>
  );
}

// ============= MAIN BUY TICKET PAGE =============
export default function BuyTicket() {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

const handleSearch = async (startStation, endStation) => {
  setHasSearched(true);

  try {
    const response = await fetch(
      `http://localhost:8083/api/trajets/search?depart=${encodeURIComponent(startStation)}&arrivee=${encodeURIComponent(endStation)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trajets");
    }

    const trajets = await response.json();

    const mapped = trajets.map(t => ({
      id: t.id,
      number: t.ligneCode,
      from: t.depart,
      to: t.arrivee,
      departure: t.depart,
      arrival: t.arrivee,
      delay: 0,
      status: t.active ? "On Time" : "Inactive",
      price: (t.distanceKm * 0.6).toFixed(2) + " MAD"
    }));

    setSearchResults(mapped);
  } catch (err) {
    console.error("API error, falling back to mock data:", err);

    const filtered = MOCK_BUSES.filter(
      bus => bus.from === startStation && bus.to === endStation
    );

    setSearchResults(filtered);
  }
};


  const handleBuyTicket = (bus) => {
    console.log('Buying ticket for bus:', bus);
    // Navigate to payment or seat selection page
    // navigate(`/seat-selection/${bus.id}`)
    navigate("/payment");
  };
  const handleReserveSeat = (bus) => {
  console.log("Reserving seat for bus:", bus);
  navigate(`/reserve-seat/${bus.id}`, { state: { bus } });
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating bus route lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,150 Q300,100 600,150 T1200,150" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="100" dur="20s" repeatCount="indefinite" />
        </path>
                <path d="M0,150 Q300,100 600,200 T1200,150" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="20" to="100" dur="20s" repeatCount="indefinite" />
        </path>
        <path d="M0,350 Q300,400 600,350 T1200,350" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="15s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Buy Your Ticket 
            </h1>
            <p className="text-blue-100 text-lg">
              Choose your journey and travel with confidence
            </p>
          </div>

          {/* Search Section */}
          <StationSearch onSearch={handleSearch} />

          {/* Results Section */}
          {hasSearched && (
            <>
              {searchResults.length > 0 ? (
                <BusResults 
  buses={searchResults} 
  onBuyTicket={handleBuyTicket}
  onReserveSeat={handleReserveSeat}
/>

              ) : (
                <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mx-auto mb-4">
                    <Info className="w-8 h-8 text-yellow-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No buses found</h3>
                  <p className="text-blue-100">
                    We couldn't find any buses for this route. Try different stations or check back later.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Info Card */}
          {!hasSearched && (
            <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-xl flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Quick Tips</h4>
                  <ul className="text-blue-100 text-sm space-y-1">
                    <li>• Book early for better seat availability</li>
                    <li>• Check bus status before departure</li>
                    <li>• Arrive 10 minutes before departure time</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}