import React, { useState } from 'react';
import { CreditCard, Check, Zap, Shield, Star, Clock, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
// ============= SUBSCRIPTION DATA =============
const SUBSCRIPTIONS = [
  {
    id: 1,
    title: "Weekly Pass",
    price: 40,
    duration: "7 days",
    gradient: "from-orange-500 to-amber-500",
    icon: Clock,
    perks: [
      "Unlimited rides for 7 days",
      "Real-time bus tracking",
      "Priority boarding"
    ],
    popular: false
  },
  {
    id: 2,
    title: "Monthly Pass",
    price: 120,
    duration: "30 days",
    gradient: "from-blue-500 to-teal-500",
    icon: CreditCard,
    perks: [
      "Unlimited rides",
      "Priority notifications",
      "Real-time bus tracking",
      "Exclusive routes"
    ],
    popular: true
  },
  {
    id: 3,
    title: "Student Pass",
    price: 80,
    duration: "30 days",
    gradient: "from-green-500 to-emerald-500",
    icon: Users,
    perks: [
      "Unlimited rides",
      "Student validation required",
      "Discounted pricing",
      "Campus routes included"
    ],
    popular: false
  },
  {
    id: 4,
    title: "Annual Pass",
    price: 1200,
    duration: "365 days",
    gradient: "from-purple-500 to-indigo-600",
    icon: Star,
    perks: [
      "Unlimited rides all year",
      "Exclusive discounts",
      "VIP customer support",
      "Free seat reservations",
      "Transfer privileges"
    ],
    popular: false
  }
];

// ============= SUBSCRIPTION CARD COMPONENT =============
function SubscriptionCard({ subscription, onSubscribe }) {
  const Icon = subscription.icon;

  return (
    <div className="relative group">
      {/* Popular Badge */}
      {subscription.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1 rounded-full text-white text-xs font-bold flex items-center space-x-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
            <span>MOST POPULAR</span>
          </div>
        </div>
      )}

      {/* Card */}
      <div className={`relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-3xl ${
        subscription.popular ? 'ring-2 ring-yellow-400/50' : ''
      }`}>
        {/* Gradient Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${subscription.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>

        {/* Icon */}
        <div className="relative mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${subscription.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          
          {/* Glow Effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${subscription.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
        </div>

        {/* Title & Duration */}
        <div className="relative mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">{subscription.title}</h3>
          <p className="text-blue-100 text-sm flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{subscription.duration}</span>
          </p>
        </div>

        {/* Price */}
        <div className="relative mb-6">
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-bold text-white">{subscription.price}</span>
            <span className="text-blue-100 text-lg">MAD</span>
          </div>
          <p className="text-blue-200 text-sm mt-1">per {subscription.duration}</p>
        </div>

        {/* Perks */}
        <div className="relative mb-6 space-y-3">
          {subscription.perks.map((perk, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-green-300" strokeWidth={3} />
              </div>
              <span className="text-blue-100 text-sm">{perk}</span>
            </div>
          ))}
        </div>

        {/* Subscribe Button */}
        <button
          onClick={() => onSubscribe(subscription)}
          className={`relative w-full bg-gradient-to-r ${subscription.gradient} text-white font-semibold py-4 rounded-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group/btn overflow-hidden`}
        >
          <span className="relative z-10">Subscribe Now</span>
          <ArrowRight className="relative z-10 ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          
          {/* Button Shine Effect */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
}

// ============= BENEFITS SECTION COMPONENT =============
function BenefitsSection() {
  const benefits = [
    {
      icon: Zap,
      title: "Instant Activation",
      description: "Your pass activates immediately after purchase"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "Protected by industry-leading encryption"
    },
    {
      icon: Star,
      title: "Priority Access",
      description: "Skip the queue with digital passes"
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">Why Subscribe?</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3">
                <Icon className="w-6 h-6 text-blue-300" strokeWidth={2.5} />
              </div>
              <h4 className="text-white font-semibold mb-2">{benefit.title}</h4>
              <p className="text-blue-100 text-sm">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============= MAIN SUBSCRIPTIONS PAGE =============
export default function Subscriptions() {
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const navigate = useNavigate();
  const handleSubscribe = (subscription) => {
    setSelectedSubscription(subscription);
    console.log('Subscribing to:', subscription);
     const safeSubscription = JSON.parse(JSON.stringify(subscription));
navigate("/checkout", { state: { subscription: safeSubscription } });

    // TODO: Integration points:
    // 1. Navigate to payment page with subscription data
    // navigate("/payment", { state: { subscription } });
    
    // 2. Send event to PaymentService via Kafka
    // publishEvent('subscription.selected', { subscriptionId: subscription.id });
    
    // 3. Integrate with Stripe (test mode)
    // const stripe = await loadStripe(STRIPE_TEST_KEY);
    // const session = await createCheckoutSession(subscription);
    // stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Floating bus route lines */}
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
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              Choose Your Subscription 
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
              Save time and money with a TransitGo pass. Unlimited rides, exclusive perks, and priority access.
            </p>
          </div>

          {/* Subscription Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {SUBSCRIPTIONS.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>

          {/* Benefits Section */}
          <BenefitsSection />

          {/* Additional Info */}
          <div className="mt-12 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="text-center">
              <h3 className="text-white font-semibold mb-2">Need Help Choosing?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Our customer support team is available 24/7 to help you find the perfect plan
              </p>
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-semibold transition-all duration-300">
                Contact Support
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-12 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Compare Plans</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-4 text-white font-semibold">Feature</th>
                    {SUBSCRIPTIONS.map(sub => (
                      <th key={sub.id} className="pb-4 text-white font-semibold text-center">{sub.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-blue-100">
                  <tr className="border-b border-white/10">
                    <td className="py-3">Unlimited Rides</td>
                    {SUBSCRIPTIONS.map(sub => (
                      <td key={sub.id} className="py-3 text-center">
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Real-time Tracking</td>
                    {SUBSCRIPTIONS.map(sub => (
                      <td key={sub.id} className="py-3 text-center">
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Priority Support</td>
                    {SUBSCRIPTIONS.map((sub, idx) => (
                      <td key={sub.id} className="py-3 text-center">
                        {idx >= 1 ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <span className="text-gray-400">-</span>}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3">Free Seat Reservations</td>
                    {SUBSCRIPTIONS.map((sub, idx) => (
                      <td key={sub.id} className="py-3 text-center">
                        {idx === 3 ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <span className="text-gray-400">-</span>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3">Transfer Privileges</td>
                    {SUBSCRIPTIONS.map((sub, idx) => (
                      <td key={sub.id} className="py-3 text-center">
                        {idx === 3 ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <span className="text-gray-400">-</span>}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-12 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <details className="bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors">
                <summary className="text-white font-semibold">Can I cancel my subscription?</summary>
                <p className="text-blue-100 text-sm mt-2">Yes, you can cancel anytime from your account settings. No questions asked.</p>
              </details>
              
              <details className="bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors">
                <summary className="text-white font-semibold">Do subscriptions auto-renew?</summary>
                <p className="text-blue-100 text-sm mt-2">Yes, all subscriptions automatically renew unless you cancel before the renewal date.</p>
              </details>
              
              <details className="bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors">
                <summary className="text-white font-semibold">How do I verify my student status?</summary>
                <p className="text-blue-100 text-sm mt-2">Upload your valid student ID during checkout. Verification typically takes 24-48 hours.</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}