"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Check, ArrowRight, Sparkles, Lock, Clock, Navigation, 
  Map, Wallet, Activity, PhoneCall, HelpCircle, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Features detail list (10 slides)
const rotateFeatures = [
  {
    id: "itinerary",
    title: "AI Itinerary Engine",
    desc: "Generate complete day-by-day roadmap in under 30 seconds.",
    bullets: [
      "Complete day-by-day roadmap",
      "Flights, trains, and buses routing",
      "UNESCO sights & local guidelines",
      "Weather-aware timing allocations",
      "Offline PDF itinerary export"
    ],
    icon: "🤖",
    includedIn: [0, 1, 2, 3] // starter, growth, pro, enterprise
  },
  {
    id: "copilot",
    title: "Trip Copilot AI",
    desc: "Your personal chat assistant for instant travel advice and adjustments.",
    bullets: [
      "24/7 AI chat support assistant",
      "Automated rescheduling advice",
      "Live budget optimization suggestions",
      "Instant weather alert warnings"
    ],
    icon: "💬",
    includedIn: [0, 1, 2, 3]
  },
  {
    id: "compare",
    title: "Price Comparison Engine",
    desc: "Compare hotel stays and flight rates across leading partners.",
    bullets: [
      "Real-time comparative rates checker",
      "Agoda vs Booking.com live lists",
      "Skyscanner direct flights tracking",
      "Best Deal system badges highlight"
    ],
    icon: "📊",
    includedIn: [1, 2, 3] // growth, pro, enterprise
  },
  {
    id: "booking",
    title: "Affiliate Travel Booking",
    desc: "Direct zero-commission booking via Skyscanner and Booking.com.",
    bullets: [
      "Skyscanner flights redirects integration",
      "Zero commission partner checkout links",
      "Ad-free premium interface browsing",
      "Direct Booking.com affiliate portals"
    ],
    icon: "✈️",
    includedIn: [1, 2, 3]
  },
  {
    id: "intel",
    title: "Destination Intelligence",
    desc: "Live local insights, weather alerts, and packing checklist guides.",
    bullets: [
      "Real-time weather forecast details",
      "Local cultural guidelines alerts",
      "Pre-departure packing checklist generator",
      "Local guidelines & rules lookup"
    ],
    icon: "🌍",
    includedIn: [1, 2, 3]
  },
  {
    id: "deals",
    title: "Marketplace Deals & Offers",
    desc: "Exclusive discounts and vouchers on partner resorts and tours.",
    bullets: [
      "Up to 30% off partner stay offers",
      "Activity discount booking vouchers",
      "Premium resort coupons unlocked",
      "Featured listings discount keys"
    ],
    icon: "🎁",
    includedIn: [2, 3] // pro, enterprise
  },
  {
    id: "wallet",
    title: "Trip Wallet & Budget Tracking",
    desc: "Track and log every travel expense in real-time with charts.",
    bullets: [
      "Interactive spend ledger tracker",
      "Budget limit warning alerts",
      "Group expense splitting logs",
      "Expense allocation graph layouts"
    ],
    icon: "💰",
    includedIn: [0, 1, 2, 3]
  },
  {
    id: "journal",
    title: "Travel Journal & Reviews",
    desc: "Record daily photo-rich logs and verified reviews of your trip.",
    bullets: [
      "Daily photo-rich journal logging",
      "Custom rating & reviews portals",
      "Public community posts generator",
      "Verified travel footprint history"
    ],
    icon: "📓",
    includedIn: [2, 3]
  },
  {
    id: "safety",
    title: "Emergency & Safety Toolkit",
    desc: "Immediate emergency helplines, hospital search, and ATM finders.",
    bullets: [
      "Direct dialable police & medical numbers",
      "Nearest emergency hospital finder",
      "Union pharmacies and ATMs locator",
      "Foreign embassy emergency helpline list"
    ],
    icon: "🚨",
    includedIn: [2, 3]
  },
  {
    id: "support",
    title: "Premium Support",
    desc: "Skip the queue with 24/7 dedicated customer assistance.",
    bullets: [
      "Response times under 2 minutes",
      "Dedicated human concierge manager",
      "Manual itinerary revisions assistance",
      "Priority API ticket processing"
    ],
    icon: "👑",
    includedIn: [2, 3]
  }
];

const plans = [
  {
    id: "starter",
    name: "Starter",
    desc: "Perfect for casual solo travelers.",
    monthlyPrice: 499,
    yearlyPrice: 399,
    ctaText: "Start Free Trial",
    features: "Includes AI Itinerary, Copilot Chat, Trip Wallet, and 5 active saved trips."
  },
  {
    id: "growth",
    name: "Growth",
    desc: "For frequent explorers & travel lovers.",
    monthlyPrice: 999,
    yearlyPrice: 799,
    ctaText: "Start Free Trial",
    features: "Includes Starter + Price Comparator, Skyscanner Flights, and Destination Intel."
  },
  {
    id: "professional",
    name: "Professional",
    desc: "Everything you need for bespoke trips.",
    monthlyPrice: 1999,
    yearlyPrice: 1599,
    popular: true,
    ctaText: "Start 7-Day Free Trial",
    features: "Includes Growth + Marketplace Vouchers, Travel Journal, Emergency Toolkit, & Premium Support."
  },
  {
    id: "enterprise",
    name: "Enterprise",
    desc: "For corporate travel & travel agencies.",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    ctaText: "Contact Sales",
    features: "Includes Pro + Multi-staff accounts, Custom AI concierge models, and White-label PDFs."
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<number>(2); // Default Professional
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-playing carousel effect
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveFeatureIndex((prev) => (prev + 1) % rotateFeatures.length);
      }, 4000);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying]);

  const handleFeatureClick = (index: number) => {
    setIsAutoPlaying(false); // Stop autoplay on interaction
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    setActiveFeatureIndex(index);
  };

  const currentFeature = rotateFeatures[activeFeatureIndex];
  const activePlanInfo = plans[selectedPlan];
  const isFeatureIncluded = currentFeature.includedIn.includes(selectedPlan);

  const getPriceDisplay = (plan: typeof plans[0]) => {
    if (typeof plan.monthlyPrice === "string" || typeof plan.yearlyPrice === "string") {
      return "Custom";
    }
    const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-[#050816] text-[#FAFBFD] pt-28 pb-32 font-sans relative overflow-x-hidden selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Background soft glowing ambient layers */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Premium Memberships
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-sora tracking-tight leading-none text-white">
            Choose the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#06B6D4]">Perfect Plan</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
            Unlock the ultimate Travel Planner OS. Generate intelligent itineraries, compare rates, track spends, and get 24/7 concierge assistance.
          </p>

          {/* Premium Billing Selector / Calculator */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <span className={`text-xs font-bold transition-all ${billingPeriod === "monthly" ? "text-white" : "text-slate-500"}`}>Monthly Billing</span>
            <button 
              onClick={() => setBillingPeriod((prev) => (prev === "monthly" ? "yearly" : "monthly"))}
              className="w-12 h-6 rounded-full bg-slate-800 border border-white/10 p-0.5 relative transition-all duration-300"
            >
              <div 
                className={`w-4.5 h-4.5 rounded-full bg-[#14B8A6] shadow transition-all duration-300 ${
                  billingPeriod === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold transition-all ${billingPeriod === "yearly" ? "text-[#14B8A6]" : "text-slate-500"}`}>Yearly Discount</span>
              <span className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </div>
        {/* ---------------------------------------------------- */}
        {/* UNIFIED SIDE-BY-SIDE LAYOUT (Mockup + Feature Details) */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-12 gap-3 sm:gap-8 items-stretch pt-6">
          
          {/* Left Side (Mockup Showcase) - Takes 5 cols on mobile, 5 cols on desktop */}
          <div className="col-span-5 flex items-center justify-center">
            <div className="relative group w-full max-w-[280px]">
              {/* Outer Glow behind mockup */}
              <div className="absolute -inset-2 sm:-inset-4 bg-teal-500/10 rounded-[20px] sm:rounded-[44px] blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Phone Mockup Frame */}
              <div className="w-full h-[320px] sm:h-[550px] border-4 sm:border-8 border-slate-900 bg-slate-950 rounded-[20px] sm:rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col p-2 sm:p-4 border-t-slate-800 border-b-slate-900">
                {/* Speaker Island */}
                <div className="absolute top-1.5 sm:top-2.5 left-1/2 -translate-x-1/2 w-16 sm:w-28 h-3 sm:h-5 bg-black rounded-full flex items-center justify-center z-30">
                  <div className="w-1 h-1 rounded-full bg-slate-800/80 mr-6 sm:mr-12" />
                  <div className="w-1 h-1 rounded-full bg-[#14B8A6]/40" />
                </div>
                
                {/* Mockup Screen Content */}
                <div className="flex-1 bg-[#090E1A] rounded-[14px] sm:rounded-[28px] overflow-hidden p-2 sm:p-3 relative flex flex-col justify-between pt-6 sm:pt-8 border border-white/5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeatureIndex}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.3 }}
                      className="flex-grow flex flex-col justify-between"
                    >
                      {activeFeatureIndex === 0 && (
                        <div className="space-y-1.5 sm:space-y-3">
                          <div className="flex justify-between items-center bg-[#14B8A6]/10 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-[#14B8A6]/20">
                            <span className="text-[6px] sm:text-[9px] text-[#14B8A6] font-bold">Goa Trip • 4 Days</span>
                            <span className="text-[5px] sm:text-[7px] bg-[#E2FF00] text-black px-1 sm:px-1.5 py-0.2 rounded font-black uppercase">AI Gen</span>
                          </div>
                          <div className="space-y-1.5 sm:space-y-2.5 text-[6px] sm:text-[8px] text-white/70">
                            <p className="text-[7px] sm:text-[9px] font-extrabold text-white">Timeline Road Map</p>
                            <div className="border-l border-slate-700 pl-2 sm:pl-3.5 ml-1 sm:ml-2 space-y-1.5 sm:space-y-3">
                              <div className="relative"><span className="absolute -left-[12px] sm:-left-[18px] top-0.5 sm:top-1 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_8px_#14B8A6]" />✈️ Flight BOM-GOI (Indigo)</div>
                              <div className="relative"><span className="absolute -left-[12px] sm:-left-[18px] top-0.5 sm:top-1 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_8px_#14B8A6]" />🏨 Hotel Hyatt Goa Check-in</div>
                              <div className="relative"><span className="absolute -left-[12px] sm:-left-[18px] top-0.5 sm:top-1 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_8px_#14B8A6]" />🌅 Vagator Sunset Point</div>
                            </div>
                          </div>
                          <div className="p-1.5 sm:p-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-[6px] sm:text-[8px] text-white/50">
                            💰 Estimated Budget: <strong>₹24,500</strong>
                          </div>
                        </div>
                      )}

                      {activeFeatureIndex === 1 && (
                        <div className="space-y-1.5 sm:space-y-3 flex flex-col h-full justify-between">
                          <div className="bg-[#14B8A6]/15 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-[6px] sm:text-[8px] text-[#14B8A6] font-bold flex items-center gap-1">
                            💬 Trip Copilot Active
                          </div>
                          <div className="space-y-1.5 flex-grow mt-2">
                            <div className="bg-teal-900/40 text-teal-400 text-[6px] sm:text-[8px] p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-teal-500/10 self-start max-w-[85%] leading-normal">
                              I found a way to save ₹2,400 on your Grand Hyatt booking. Should I switch stay?
                            </div>
                            <div className="bg-white/5 text-white/95 text-[6px] sm:text-[8px] p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl self-end text-right border border-white/5 mt-1 max-w-[85%] ml-auto">
                              Yes, switch it now.
                            </div>
                          </div>
                          <div className="bg-[#14B8A6] text-black font-extrabold py-1 sm:py-2 rounded-lg sm:rounded-xl text-[6px] sm:text-[8px] text-center shadow-lg uppercase tracking-wider">
                            Optimized: Saved ₹2,400
                          </div>
                        </div>
                      )}

                      {activeFeatureIndex === 2 && (
                        <div className="space-y-1.5 sm:space-y-2.5">
                          <span className="text-[6px] sm:text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">Stay Comparators</span>
                          <div className="bg-white/5 border border-white/10 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl flex justify-between items-center text-[6px] sm:text-[8px]">
                            <span className="text-white font-medium">Booking.com</span>
                            <span className="font-mono text-slate-400">₹6,800/N</span>
                          </div>
                          <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/20 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl flex justify-between items-center text-[6px] sm:text-[8px]">
                            <span className="text-[#14B8A6] font-black flex items-center gap-1">Agoda <span className="bg-teal-500 text-black text-[5px] sm:text-[6px] px-1 rounded font-bold">Best</span></span>
                            <span className="font-mono text-[#14B8A6] font-black">₹6,200/N</span>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl flex justify-between items-center text-[6px] sm:text-[8px]">
                            <span className="text-white font-medium">MakeMyTrip</span>
                            <span className="font-mono text-slate-400">₹6,900/N</span>
                          </div>
                        </div>
                      )}

                      {activeFeatureIndex === 3 && (
                        <div className="space-y-1.5 sm:space-y-3">
                          <span className="text-[6px] sm:text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">Skyscanner Rates</span>
                          <div className="bg-white/5 border border-white/10 p-1.5 sm:p-3 rounded-lg sm:rounded-xl space-y-0.5 sm:space-y-1">
                            <div className="flex justify-between items-center text-[6px] sm:text-[8px]">
                              <span className="text-white font-black">Indigo 6E-242</span>
                              <span className="font-mono text-teal-400">₹4,500</span>
                            </div>
                            <p className="text-[5px] sm:text-[7px] text-slate-400">BOM-GOI • Direct flight • 1h 15m</p>
                          </div>
                          <div className="p-1 sm:p-2 bg-[#006CFF] text-white rounded-lg sm:rounded-xl text-center text-[6px] sm:text-[8px] font-black shadow-md uppercase tracking-wider">
                            Book via Skyscanner ↗
                          </div>
                        </div>
                      )}

                      {activeFeatureIndex === 4 && (
                        <div className="space-y-1.5 sm:space-y-3">
                          <div className="bg-white/5 border border-white/10 p-1.5 sm:p-3 rounded-lg sm:rounded-xl space-y-1">
                            <p className="text-[6px] sm:text-[8px] text-[#38BDF8] font-bold uppercase tracking-wider">☀️ Weather Forecast</p>
                            <h4 className="text-sm sm:text-xl font-bold text-white font-mono leading-none">30°C</h4>
                            <p className="text-[5px] sm:text-[7px] text-slate-400">Goa, India • Clear skies • Low rain index</p>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-[6px] sm:text-[8px] text-white/60 leading-normal">
                            📌 UNESCO guidelines: Old Goa Basilica is open till 06:30 PM. Photography allowed.
                          </div>
                        </div>
                      )}

                      {activeFeatureIndex === 5 && (
                        <div className="space-y-1.5 sm:space-y-2">
                          <span className="text-[6px] sm:text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">Marketplace Vouchers</span>
                          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-left space-y-0.5">
                            <span className="text-[5px] sm:text-[7px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-black uppercase">Spa Deal</span>
                            <h5 className="text-[6px] sm:text-[8px] font-bold text-white">20% Off Spa at W Bali</h5>
                            <p className="text-[5px] sm:text-[7px] text-slate-400 font-mono">Promo Code: WBALISPA20</p>
                          </div>
                          <div className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-left space-y-0.5">
                            <span className="text-[5px] sm:text-[7px] bg-teal-500 text-black px-1.5 py-0.2 rounded font-black uppercase">Adventure</span>
                            <h5 className="text-[6px] sm:text-[8px] font-bold text-white">Free Snorkeling in Maldives</h5>
                            <p className="text-[5px] sm:text-[7px] text-slate-400 font-mono">Promo Code: MALDIVESFREE</p>
                          </div>
                        </div>
                      )}

                      {activeFeatureIndex === 6 && (
                        <div className="space-y-1.5 sm:space-y-3">
                          <div className="bg-white/5 border border-white/10 p-1.5 sm:p-3 rounded-lg sm:rounded-xl space-y-1.5 sm:space-y-2.5">
                            <p className="text-[6px] sm:text-[8px] text-slate-400 font-extrabold uppercase tracking-wider">Budget Tracker</p>
                            <div className="flex justify-between text-[7px] sm:text-[10px] font-bold text-white font-mono">
                              <span>Spent: ₹34,200</span>
                              <span className="text-teal-400">Limit: ₹50,000</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1 sm:h-1.5 rounded-full overflow-hidden">
                              <div className="bg-teal-500 h-full" style={{ width: "68.4%" }} />
                            </div>
                          </div>
                          <div className="p-1 sm:p-2 border border-slate-800 rounded-lg sm:rounded-xl bg-slate-900/40 text-[5px] sm:text-[7px] text-slate-400">
                            📝 Food: ₹6,200 | Stays: ₹20,000 | Transport: ₹8,000
                          </div>
                        </div>
                      )}

                      {activeFeatureIndex === 7 && (
                        <div className="space-y-1.5 sm:space-y-2">
                          <span className="text-[6px] sm:text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">Travel Logs</span>
                          <div className="bg-white/5 border border-white/10 p-1.5 sm:p-3 rounded-lg sm:rounded-xl text-[6px] sm:text-[8px] text-white/80 italic leading-normal">
                            “Day 2 in Assagao: Woke up early to catch the mist over the tea plantations. Absolute magic...”
                          </div>
                          <div className="bg-white/5 border border-white/10 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-[6px] sm:text-[8px] space-y-0.5">
                            <span className="text-teal-400 font-bold text-[5px] sm:text-[8px]">★ ★ ★ ★ ★ Rating</span>
                            <p className="text-white/60">Goa Sunset Escape verified footprint.</p>
                          </div>
                        </div>
                      )}

                      {activeFeatureIndex === 8 && (
                        <div className="space-y-1.5 sm:space-y-2">
                          <div className="bg-red-500/10 border border-red-500/20 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-left space-y-0.5">
                            <p className="text-[6px] sm:text-[9px] text-red-500 font-bold uppercase tracking-wider">🚨 Emergency Helplines</p>
                            <p className="text-[5px] sm:text-[8px] text-white/90">Police: 112 / +91-832-2428787</p>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-1 sm:p-2 rounded-lg sm:rounded-xl text-[5px] sm:text-[7px] text-slate-400 space-y-0.5">
                            <p className="text-white font-bold">🏥 Manipal Hospital</p>
                            <p className="text-white font-bold">🏦 SBI ATM (150m)</p>
                            <p className="text-white font-bold">💊 Union Pharmacy (300m)</p>
                          </div>
                        </div>
                      )}

                      {activeFeatureIndex === 9 && (
                        <div className="space-y-1.5 sm:space-y-3">
                          <div className="flex items-center gap-1 sm:gap-2 bg-[#14B8A6]/10 p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-[#14B8A6]/20">
                            <div className="w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-teal-50 flex items-center justify-center font-black text-[5px] sm:text-[8px] text-black">PT</div>
                            <div>
                              <p className="text-[5px] sm:text-[8px] text-white font-bold leading-none">Elite Support Desk</p>
                              <p className="text-[4px] sm:text-[7px] text-[#14B8A6] mt-0.5">Priya • Connected</p>
                            </div>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-[6px] sm:text-[8px] text-white/70 leading-normal">
                            Support response time is &lt; 2 minutes. A dedicated concierge manager is assigned to review your manual requests.
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Device Bottom Indicator Line */}
                  <div className="w-12 sm:w-20 h-0.5 sm:h-1 bg-slate-800 rounded-full mx-auto mt-1 sm:mt-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side (Feature Explanation Panel) - Takes 7 cols on mobile, 7 cols on desktop */}
          <div className="col-span-7 flex flex-col justify-between p-3 sm:p-6 bg-slate-900/40 border border-white/5 rounded-[16px] sm:rounded-[32px] backdrop-blur-md relative">
            <div className="space-y-3 sm:space-y-6">
              
              {/* Feature Category header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-1.5 sm:pb-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-sm sm:text-xl">{currentFeature.icon}</span>
                  <h3 className="text-xs sm:text-lg font-bold text-white font-sora">{currentFeature.title}</h3>
                </div>
                
                {isFeatureIncluded ? (
                  <span className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[6px] sm:text-[8px] font-black uppercase tracking-wider px-1 sm:px-2 py-0.2 sm:py-0.5 rounded">
                    Included
                  </span>
                ) : (
                  <span className="bg-slate-800 border border-white/5 text-slate-400 text-[6px] sm:text-[8px] font-bold uppercase tracking-wider px-1 sm:px-2 py-0.2 sm:py-0.5 rounded flex items-center gap-0.5">
                    <Lock className="w-2 sm:w-2.5 h-2 sm:h-2.5" /> Upgrade
                  </span>
                )}
              </div>

              {/* Feature Description & checklist */}
              <div className="space-y-2 sm:space-y-4">
                <p className="text-[10px] sm:text-sm text-slate-300 font-semibold leading-relaxed">
                  {currentFeature.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 pt-1">
                  {currentFeature.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-1 sm:gap-2.5 text-[9px] sm:text-xs text-slate-300">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                        <Check className="w-2 sm:w-2.5 h-2 sm:h-2.5" />
                      </div>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature selector list (CricHeroes PRO style list selectors) */}
            <div className="pt-4 sm:pt-8 border-t border-white/5 mt-4 sm:mt-8">
              <p className="text-[8px] sm:text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">Explore Product Features</p>
              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                {rotateFeatures.map((ft, idx) => {
                  const isActive = activeFeatureIndex === idx;
                  const isIncludedInCurrent = ft.includedIn.includes(selectedPlan);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleFeatureClick(idx)}
                      className={`flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border text-left text-[9px] sm:text-xs transition-all ${
                        isActive 
                          ? "bg-teal-500/10 border-[#14B8A6] text-white font-bold" 
                          : "bg-white/[0.01] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="text-[10px] sm:text-xs">{ft.icon}</span>
                      <span className="truncate flex-1">{ft.title}</span>
                      {!isIncludedInCurrent && <Lock className="w-2.5 h-2.5 text-slate-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
reIndex === idx ? "bg-[#14B8A6] w-4" : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* ---------------------------------------------------- */}
        {/* BOTTOM SECTION: Pricing Selector Cards */}
        {/* ---------------------------------------------------- */}
        <div className="space-y-6 pt-6">
          <div className="text-center">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Select Subscription Plan</p>
          </div>

          {/* Pricing cards grid (Horizontally on desktop, horizontally scrollable on mobile!) */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x lg:grid lg:grid-cols-4 lg:overflow-x-visible scrollbar-none px-2">
            {plans.map((plan, i) => {
              const isSelected = selectedPlan === i;
              const priceDisplay = getPriceDisplay(plan);
              
              return (
                <div 
                  key={i}
                  onClick={() => setSelectedPlan(i)}
                  className={`snap-start shrink-0 w-[270px] lg:w-auto rounded-3xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between h-[250px] relative ${
                    isSelected 
                      ? "bg-slate-900 border-[#14B8A6] shadow-[0_0_30px_rgba(20,184,166,0.2)] scale-[1.02] -translate-y-1" 
                      : "bg-[#090E1A]/40 border-white/5 hover:border-white/10 hover:bg-slate-900/30"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-6 bg-[#14B8A6] text-black text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
                      🔥 Most Popular
                    </span>
                  )}
                  
                  {isSelected && (
                    <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-teal-50 text-black flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">{plan.name}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-snug">{plan.desc}</p>
                    
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white font-sora">{priceDisplay}</span>
                      {plan.monthlyPrice !== "Custom" && (
                        <span className="text-slate-500 text-[10px] font-semibold">/month</span>
                      )}
                    </div>

                    {/* Billed info */}
                    {billingPeriod === "yearly" && typeof plan.yearlyPrice === "number" && (
                      <span className="text-[8px] font-bold text-teal-400 mt-1 block">
                        Billed ₹{(plan.yearlyPrice * 12).toLocaleString("en-IN")} yearly (Save 20%)
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 text-[9px] text-slate-400 font-semibold leading-normal">
                    {plan.features}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* STICKY BOTTOM CONVERSIONS CTA BAR */}
      {/* ---------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050816]/90 backdrop-blur-md border-t border-white/10 py-4 px-6 shadow-[0_-10px_35px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-extrabold text-[#14B8A6] uppercase tracking-widest leading-none mb-1">Active Plan Selection</p>
            <h4 className="text-sm font-black text-white">
              TripPilot {activePlanInfo.name} • <span className="font-mono text-teal-400">{getPriceDisplay(activePlanInfo)}</span>
              {billingPeriod === "yearly" && activePlanInfo.monthlyPrice !== "Custom" && (
                <span className="text-[9px] text-[#06B6D4] ml-2">Billed Annually</span>
              )}
            </h4>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => alert(`Subscribing to ${activePlanInfo.name} plan...`)}
              className="w-full sm:w-max h-12 px-8 rounded-full bg-gradient-to-r from-[#14B8A6] to-[#06B6D4] hover:from-[#14B8A6]/90 hover:to-[#06B6D4]/90 text-[#050816] font-extrabold text-sm shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border-none"
            >
              <span>{activePlanInfo.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
