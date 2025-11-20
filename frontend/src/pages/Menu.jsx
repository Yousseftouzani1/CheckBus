import React from 'react';
import { Ticket, Calendar, MapPin, CreditCard, User, Bus, LogOut ,BadgeCheck } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// MenuCard Component
function MenuCard({ icon: Icon, title, description, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50"
    >
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
      
      <div className="relative mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-lg group-hover:shadow-blue-400/50 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
        <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      </div>

      <div className="relative">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors">
          {title}
        </h3>
        <p className="text-blue-100 text-sm group-hover:text-white transition-colors">
          {description}
        </p>
      </div>

      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}

// Main Menu Component
export default function Menu() {

  // ✅ Real navigation hook
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: Ticket,
      title: 'Buy Ticket',
      description: 'Purchase your bus tickets instantly',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      path: '/buy-ticket'
    },
{
  icon: CreditCard,
  title: 'Payments',
  description: 'View and manage your payments',
  gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600',
  path: '/payments'
},

    {
      icon: MapPin,
      title: 'Live Bus Map',
      description: 'Track buses in real-time',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      path: '/map'
    },
    {
      icon: BadgeCheck ,
      title: 'Subscriptions',
      description: 'Manage your travel passes',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      path: '/subscriptions'
    },
    {
      icon: User,
      title: 'Profile',
      description: 'View and edit your account',
      gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
      path: '/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Floating lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,150 Q300,100 600,150 T1200,150" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="100" dur="20s" repeatCount="indefinite" />
        </path>
        <path d="M0,350 Q300,400 600,350 T1200,350" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="15s" repeatCount="indefinite" />
        </path>
        <path d="M0,550 Q300,500 600,550 T1200,550" stroke="white" strokeWidth="2" fill="none" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="100" dur="25s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-lg">
                <Bus className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">TransitGo</h1>
                <p className="text-blue-100 text-sm">Your journey, simplified</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </header>

        {/* Menu List */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome aboard !!
              </h2>
              <p className="text-blue-100 text-lg">
                Choose a service to get started
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {menuItems.map((item, index) => (
                <MenuCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  gradient={item.gradient}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-12 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">245+</div>
                  <div className="text-blue-100 text-sm">Active Routes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">50K+</div>
                  <div className="text-blue-100 text-sm">Happy Travelers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-blue-100 text-sm">Support Available</div>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center text-blue-100">
          © 2024 TransitGo. Connecting cities, one ride at a time.
        </footer>

      </div>
    </div>
  );
}