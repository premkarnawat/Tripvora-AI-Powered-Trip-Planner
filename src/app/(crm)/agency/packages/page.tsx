"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, MapPin, Calendar, Users, DollarSign, Hotel, Map, Coffee, 
  FileText, Download, ArrowRight, Settings, ChevronDown, Check, 
  ArrowLeft, Info, Percent, ShieldCheck, FileCheck, RefreshCw, 
  Printer, Share2, Phone, Bot, CheckSquare, Compass, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Library of Signed Agency Vendor Contracts
const VENDOR_HOTELS = [
  { id: "v-h-1", name: "Grand Hyatt Bali (Nusa Dua)", stars: 5, costPerNight: 12000, marginBonus: 2000, desc: "Premium beachfront resort, exclusive B2B contract rates." },
  { id: "v-h-2", name: "W Bali Seminyak", stars: 5, costPerNight: 24000, marginBonus: 4500, desc: "Vibrant luxury, high demand. 15% override margin." },
  { id: "v-h-3", name: "Maya Ubud Resort & Spa", stars: 5, costPerNight: 15500, marginBonus: 2800, desc: "Overlooking Petanu River. Preferred wellness partner." },
  { id: "v-h-4", name: "Umana Bali (LXR Luxury Resorts)", stars: 5, costPerNight: 42000, marginBonus: 8000, desc: "Cliff-edge luxury villas with private pools." }
];

const VENDOR_ACTIVITIES = [
  { id: "v-a-1", name: "Private Uluwatu Sunset Tour & Kecak Dance", cost: 4500, marginBonus: 1000, desc: "Includes private guide and reserved VIP seats." },
  { id: "v-a-2", name: "Nusa Penida Snorkeling Speedboat Adventure", cost: 8000, marginBonus: 1800, desc: "Group tour with private premium transfers." },
  { id: "v-a-3", name: "Mount Batur Sunrise Jeep Trekking", cost: 6500, marginBonus: 1200, desc: "Private Jeep experience, breakfast included." },
  { id: "v-a-4", name: "Sacred Monkey Forest & Ubud Jungle Swing", cost: 3500, marginBonus: 800, desc: "Includes lunch overlooking river valley." }
];

const VENDOR_TRANSFERS = [
  { id: "v-t-1", name: "Private Toyota Alphard (VIP Fleet)", costPerDay: 6000, marginBonus: 1200 },
  { id: "v-t-2", name: "Private Toyota Avanza (Standard)", costPerDay: 2500, marginBonus: 500 }
];

export default function PackageBuilderPage() {
  // Step State: 1 = Client details & mode, 2 = AI Loader, 3 = Split-screen Builder
  const [step, setStep] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  // Client Details Form State
  const [clientName, setClientName] = useState("Priya Sharma");
  const [clientEmail, setClientEmail] = useState("priya@sharmavacations.in");
  const [clientPhone, setClientPhone] = useState("+91 98765 43210");
  const [destination, setDestination] = useState("Bali, Indonesia");
  const [startDate, setStartDate] = useState("2026-07-15");
  const [nights, setNights] = useState(5);
  const [members, setMembers] = useState(2);
  const [budget, setBudget] = useState("250000");
  const [travelStyle, setTravelStyle] = useState("Luxury & Leisure");
  const [planningSource, setPlanningSource] = useState("hybrid"); // 'ai' | 'vendor' | 'hybrid'
  const [marginPercent, setMarginPercent] = useState(20);

  // Active Selected Day in Step 3
  const [activeDay, setActiveDay] = useState(1);
  
  // Right matcher active filter tab
  const [matcherTab, setMatcherTab] = useState("hotels");
  
  // PDF Preview Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Current Itinerary State (Initialized with AI recommendation items)
  const [itinerary, setItinerary] = useState<any[]>([]);

  // Initializing Itinerary on load/step 2 trigger
  const generateBaseItinerary = () => {
    const daysData = [];
    for (let d = 1; d <= nights; d++) {
      daysData.push({
        day: d,
        title: d === 1 ? "Arrival & Uluwatu Sunset" : d === nights ? "Departure Transfer" : `Explore Bali Day ${d}`,
        hotel: {
          name: "AI Recommendation: Ayana Resort Bali",
          cost: 18000,
          isContract: false,
          vendorId: null
        },
        activity: {
          name: d === 1 
            ? "AI Recommendation: Jimbaran Bay Seafood Dinner" 
            : d === 2 
            ? "AI Recommendation: Ubud Art Villages" 
            : d === 3 
            ? "AI Recommendation: Tegenungan Waterfall Tour"
            : d === 4 
            ? "AI Recommendation: Seminyak Beach Club Lounge"
            : "AI Recommendation: Kuta Shopping & Spa",
          cost: d === 1 ? 3000 : d === 2 ? 4000 : 3500,
          isContract: false,
          vendorId: null
        },
        transfer: {
          name: "AI Recommendation: Private Airport Transfer",
          cost: 3000,
          isContract: false,
          vendorId: null
        }
      });
    }
    setItinerary(daysData);
  };

  // Step 2 Loader Effect
  useEffect(() => {
    if (step === 2) {
      generateBaseItinerary();
      let progress = 0;
      const texts = [
        "Initializing TripPilot AI Core Engine...",
        "Querying Google Places & Destination Database...",
        "Scanning Skyscanner Flights & Viator Activity Pools...",
        "Checking signed contracts in Elite Travels Vendor Library...",
        "Balancing margin parameters & final day-wise routing..."
      ];
      setLoadingText(texts[0]);
      
      const interval = setInterval(() => {
        progress += 20;
        setLoadingProgress(progress);
        const textIdx = Math.min(Math.floor(progress / 20), texts.length - 1);
        setLoadingText(texts[textIdx]);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep(3);
          }, 400);
        }
      }, 700);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Live Pricing Calculations
  const calculateCosts = () => {
    let hotelCost = 0;
    let activityCost = 0;
    let transferCost = 0;

    itinerary.forEach(d => {
      hotelCost += d.hotel?.cost || 0;
      activityCost += d.activity?.cost || 0;
      transferCost += d.transfer?.cost || 0;
    });

    const baseCost = hotelCost + activityCost + transferCost;
    const marginAmount = Math.round(baseCost * (marginPercent / 100));
    const gstAmount = Math.round(marginAmount * 0.18); // 18% GST on Margin
    const finalPrice = baseCost + marginAmount + gstAmount;

    return {
      baseCost,
      marginAmount,
      gstAmount,
      finalPrice
    };
  };

  const { baseCost, marginAmount, gstAmount, finalPrice } = calculateCosts();

  // Replace functions for Step 3
  const handleReplaceHotel = (vendorHotel: any) => {
    const updated = itinerary.map((d, index) => {
      // Typically hotels are replaced package-wide (all nights) for continuity
      return {
        ...d,
        hotel: {
          name: vendorHotel.name,
          cost: vendorHotel.costPerNight,
          isContract: true,
          vendorId: vendorHotel.id
        }
      };
    });
    setItinerary(updated);
  };

  const handleReplaceActivity = (dayNum: number, vendorAct: any) => {
    const updated = itinerary.map(d => {
      if (d.day === dayNum) {
        return {
          ...d,
          activity: {
            name: vendorAct.name,
            cost: vendorAct.cost,
            isContract: true,
            vendorId: vendorAct.id
          }
        };
      }
      return d;
    });
    setItinerary(updated);
  };

  const handleReplaceTransfer = (dayNum: number, vendorTrans: any) => {
    const updated = itinerary.map(d => {
      if (d.day === dayNum) {
        return {
          ...d,
          transfer: {
            name: vendorTrans.name,
            cost: vendorTrans.costPerDay,
            isContract: true,
            vendorId: vendorTrans.id
          }
        };
      }
      return d;
    });
    setItinerary(updated);
  };

  // AI Copilot Commands mock actions
  const applyCopilotAction = (action: string) => {
    if (action === "cheaper_hotel") {
      // Find hotel with minimum cost
      const cheapest = VENDOR_HOTELS.reduce((prev, curr) => prev.costPerNight < curr.costPerNight ? prev : curr);
      handleReplaceHotel(cheapest);
    } else if (action === "increase_margin") {
      setMarginPercent(prev => Math.min(prev + 5, 50));
    } else if (action === "upgrade_luxury") {
      const luxury = VENDOR_HOTELS.reduce((prev, curr) => prev.costPerNight > curr.costPerNight ? prev : curr);
      handleReplaceHotel(luxury);
    } else if (action === "corporate_variant") {
      setMarginPercent(12);
      handleReplaceHotel(VENDOR_HOTELS[0]); // Grand Hyatt (cheaper premium)
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-10">
      
      {/* STEP 1: PARAMETERS & SOURCE SELECTOR */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">AI Hybrid Package Engine</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Generate client itineraries with dynamic AI tools and pre-negotiated agency contracts.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Agency Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Parameters form */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-widest flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-teal-600" /> Package Parameters
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input 
                      type="text" 
                      value={destination} 
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Nights</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input 
                        type="number" 
                        value={nights} 
                        onChange={(e) => setNights(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input 
                        type="number" 
                        value={members} 
                        onChange={(e) => setMembers(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Client Target Budget (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input 
                      type="text" 
                      value={budget} 
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 pr-3 text-xs text-[#0F172A] font-mono focus:outline-none focus:border-teal-500 font-bold" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Travel Style</label>
                  <select 
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium"
                  >
                    <option>Luxury & Leisure</option>
                    <option>Adventure & Explorer</option>
                    <option>Honeymoon Special</option>
                    <option>Corporate Retreat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Client Details & Selection mode */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Client Info Sub-card */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#0F172A] mb-4">Client Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Client Name</label>
                    <input 
                      type="text" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Mobile (WhatsApp)</label>
                    <input 
                      type="text" 
                      value={clientPhone} 
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Email Address</label>
                    <input 
                      type="email" 
                      value={clientEmail} 
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                </div>
              </div>

              {/* Mode Selectors */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#0F172A]">Select Itinerary Planning Source Mode</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* AI Recommended */}
                  <div 
                    onClick={() => setPlanningSource("ai")}
                    className={`border rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between h-44 ${
                      planningSource === "ai" 
                        ? "border-sky-500 bg-sky-50/30 ring-1 ring-sky-500 shadow-sm" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                          <Compass className="w-4 h-4 text-sky-600" />
                        </div>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded">
                          AI First
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] mt-3">AI Recommended Mode</h4>
                      <p className="text-[10px] text-[#64748B] mt-1.5 leading-relaxed">
                        Pulls dynamically from Google Places, TripAdvisor reviews, and airline/hotel affiliate channels.
                      </p>
                    </div>
                    <span className="text-[10px] text-sky-600 font-bold flex items-center gap-1 mt-2">
                      Best for quick draft package →
                    </span>
                  </div>

                  {/* Vendor Only */}
                  <div 
                    onClick={() => setPlanningSource("vendor")}
                    className={`border rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between h-44 ${
                      planningSource === "vendor" 
                        ? "border-teal-600 bg-teal-50/20 ring-1 ring-teal-600 shadow-sm" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Hotel className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded">
                          Contracts
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] mt-3">Agency Vendor Mode</h4>
                      <p className="text-[10px] text-[#64748B] mt-1.5 leading-relaxed">
                        Matches stays and experiences 100% against your pre-signed corporate vendor contracts.
                      </p>
                    </div>
                    <span className="text-[10px] text-teal-600 font-bold flex items-center gap-1 mt-2">
                      Best for zero out-of-pocket costs →
                    </span>
                  </div>

                  {/* Hybrid Mode */}
                  <div 
                    onClick={() => setPlanningSource("hybrid")}
                    className={`border rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between h-44 relative overflow-hidden ${
                      planningSource === "hybrid" 
                        ? "border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600 shadow-sm" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white font-extrabold text-[8px] uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                      Recommended
                    </div>
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] mt-3">Hybrid Mode</h4>
                      <p className="text-[10px] text-[#64748B] mt-1.5 leading-relaxed">
                        Pulls base day-wise structure from AI suggestions, then matches and swaps in contract items for maximum margin.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
                      Best for maximum agency profit →
                    </span>
                  </div>

                </div>
              </div>

              {/* Generate CTA Button */}
              <Button 
                onClick={() => setStep(2)}
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-sm transition-all shadow-[0_4px_14px_rgba(13,148,136,0.3)] flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" /> Generate Package Base via Itinerary Engine
              </Button>

            </div>

          </div>
        </div>
      )}

      {/* STEP 2: AI ENGINE LOADING ANIMATION */}
      {step === 2 && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
          <div className="relative w-20 h-20">
            {/* Spinning gradient border */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-teal-600 animate-spin" />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
              <Bot className="w-8 h-8 text-teal-600 animate-pulse" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-[#0F172A]">AI Engine Optimizing</h3>
            <p className="text-xs text-[#64748B] font-medium animate-pulse">{loadingText}</p>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300 rounded-full" 
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">{loadingProgress}% Complete</span>
        </div>
      )}

      {/* STEP 3: SPLIT-SCREEN EDITOR & COSTING ENGINE */}
      {step === 3 && (
        <div className="space-y-6">
          
          {/* Main Top Header Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(1)} 
                className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#64748B]" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-[#0F172A]">{nights} Nights Luxury {destination} Retreat</h1>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                    {planningSource.toUpperCase()} MODE
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Client: <strong className="text-[#0F172A]">{clientName}</strong> • {members} Adults • Budget Target: <strong>₹{Number(budget).toLocaleString('en-IN')}</strong>
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsPdfModalOpen(true)}
                className="h-9 px-4 text-xs font-bold bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-200 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Branded PDF Preview
              </Button>
              <Button 
                onClick={() => alert(`Quotation Package sent successfully to WhatsApp channel: ${clientPhone}`)}
                className="h-9 px-4 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border-none shadow-sm flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Send to Client (WhatsApp)
              </Button>
            </div>
          </div>

          {/* Three Column Builder Split Screen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Days Selector (2 Cols) */}
            <div className="lg:col-span-2 space-y-2 bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
              <h4 className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider px-2 mb-2">Days Agenda</h4>
              <div className="space-y-1">
                {itinerary.map((d) => (
                  <button
                    key={d.day}
                    onClick={() => setActiveDay(d.day)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center justify-between text-xs font-bold ${
                      activeDay === d.day 
                        ? "bg-teal-50 text-teal-700 border-l-4 border-teal-600 shadow-sm" 
                        : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
                    }`}
                  >
                    <span>Day {d.day}</span>
                    <span className="text-[9px] font-medium text-slate-400">
                      {d.hotel?.isContract || d.activity?.isContract ? "Matched" : "AI Recommended"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CENTER COLUMN: Itinerary Timeline Details & Builder Cards (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-extrabold text-[#0F172A]">Day {activeDay} Itinerary</h3>
                  <span className="text-xs text-slate-400 font-medium">Configure items below</span>
                </div>

                <div className="space-y-4">
                  
                  {/* Hotel Stay Item Card */}
                  <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 hover:border-slate-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-full flex items-center gap-1">
                        <Hotel className="w-3 h-3" /> Accommodation Stay
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        itinerary[activeDay - 1]?.hotel?.isContract 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}>
                        {itinerary[activeDay - 1]?.hotel?.isContract ? "Vendor Contract" : "AI Suggested"}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{itinerary[activeDay - 1]?.hotel?.name}</h4>
                    <p className="text-[10px] font-mono text-[#64748B] mt-1">Cost per night: ₹{(itinerary[activeDay - 1]?.hotel?.cost || 0).toLocaleString('en-IN')}</p>
                    
                    {!itinerary[activeDay - 1]?.hotel?.isContract && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                          <Info className="w-3 h-3" /> Tap Hotel grid on right to replace
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Activity Item Card */}
                  <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 hover:border-slate-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full flex items-center gap-1">
                        <Compass className="w-3 h-3" /> Attraction Activity
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        itinerary[activeDay - 1]?.activity?.isContract 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}>
                        {itinerary[activeDay - 1]?.activity?.isContract ? "Vendor Contract" : "AI Suggested"}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{itinerary[activeDay - 1]?.activity?.name}</h4>
                    <p className="text-[10px] font-mono text-[#64748B] mt-1">Activity cost: ₹{(itinerary[activeDay - 1]?.activity?.cost || 0).toLocaleString('en-IN')}</p>
                    
                    {!itinerary[activeDay - 1]?.activity?.isContract && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                          <Info className="w-3 h-3" /> Tap Activities grid on right to replace
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Transport Item Card */}
                  <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 hover:border-slate-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full flex items-center gap-1">
                        <Compass className="w-3 h-3" /> Daily Transport
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        itinerary[activeDay - 1]?.transfer?.isContract 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}>
                        {itinerary[activeDay - 1]?.transfer?.isContract ? "Vendor Contract" : "AI Suggested"}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{itinerary[activeDay - 1]?.transfer?.name}</h4>
                    <p className="text-[10px] font-mono text-[#64748B] mt-1">Transport cost: ₹{(itinerary[activeDay - 1]?.transfer?.cost || 0).toLocaleString('en-IN')}</p>
                    
                    {!itinerary[activeDay - 1]?.transfer?.isContract && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                          <Info className="w-3 h-3" /> Tap Transport grid on right to replace
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Live Profit Engine Box */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1">
                    <Percent className="w-4 h-4 text-teal-600" /> Live Profit Engine
                  </h3>
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 animate-pulse">
                    Live Calculation
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider block mb-1">Base Vendor Cost</label>
                    <span className="text-base font-bold text-[#0F172A] font-mono">₹{baseCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[9px] font-extrabold text-[#64748B] uppercase tracking-wider block">Target Margin</label>
                      <span className="text-[10px] font-extrabold text-teal-600">{marginPercent}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="50" 
                      value={marginPercent} 
                      onChange={(e) => setMarginPercent(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-100 pt-3 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-[#64748B]">
                    <span>Markup Profit Margin Amount:</span>
                    <span className="font-mono text-[#0F172A] font-bold">₹{marginAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-[#64748B]">
                    <span>GST Tax (18% on Profit):</span>
                    <span className="font-mono text-[#0F172A] font-medium">₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#0F172A] pt-2 border-t border-slate-100">
                    <span>Final Package Selling Price:</span>
                    <span className="font-mono text-teal-600 text-lg">₹{finalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Vendor Library Matcher & Grids (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                
                {/* Search & Grid Filter Header */}
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-extrabold text-[#0F172A] mb-3">Elite Travels Vendor Contracts</h3>
                  
                  <div className="flex gap-1.5 overflow-x-auto">
                    <button
                      onClick={() => setMatcherTab("hotels")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                        matcherTab === "hotels" 
                          ? "bg-teal-600 text-white" 
                          : "bg-slate-50 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
                      }`}
                    >
                      <Hotel className="w-3.5 h-3.5" /> Hotels Stay
                    </button>
                    <button
                      onClick={() => setMatcherTab("activities")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                        matcherTab === "activities" 
                          ? "bg-teal-600 text-white" 
                          : "bg-slate-50 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" /> Activities
                    </button>
                    <button
                      onClick={() => setMatcherTab("transfers")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                        matcherTab === "transfers" 
                          ? "bg-teal-600 text-white" 
                          : "bg-slate-50 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" /> Transport
                    </button>
                  </div>
                </div>

                {/* Content Listings Grids */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  
                  {/* HOTELS GRID */}
                  {matcherTab === "hotels" && VENDOR_HOTELS.map((vh) => (
                    <div key={vh.id} className="border border-slate-200 hover:border-teal-500 rounded-lg p-3 bg-white transition-all flex flex-col justify-between gap-3 shadow-sm">
                      <div>
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-bold text-[#0F172A]">{vh.name}</h5>
                          <span className="text-[10px] font-bold text-[#F59E0B]">★ {vh.stars}</span>
                        </div>
                        <p className="text-[10px] text-[#64748B] mt-1 leading-snug">{vh.desc}</p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <div>
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase">Base Contract Cost</p>
                          <p className="text-xs font-bold text-[#0F172A] font-mono">₹{vh.costPerNight.toLocaleString('en-IN')}/Night</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                            +₹{vh.marginBonus.toLocaleString('en-IN')} Margin
                          </span>
                          <button
                            onClick={() => handleReplaceHotel(vh)}
                            className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all"
                          >
                            Replace All
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* ACTIVITIES GRID */}
                  {matcherTab === "activities" && VENDOR_ACTIVITIES.map((va) => (
                    <div key={va.id} className="border border-slate-200 hover:border-teal-500 rounded-lg p-3 bg-white transition-all flex flex-col justify-between gap-3 shadow-sm">
                      <div>
                        <h5 className="text-xs font-bold text-[#0F172A]">{va.name}</h5>
                        <p className="text-[10px] text-[#64748B] mt-1 leading-snug">{va.desc}</p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <div>
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase">Contract Price</p>
                          <p className="text-xs font-bold text-[#0F172A] font-mono">₹{va.cost.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                            +₹{va.marginBonus.toLocaleString('en-IN')} Margin
                          </span>
                          <button
                            onClick={() => handleReplaceActivity(activeDay, va)}
                            className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all"
                          >
                            Swap Day {activeDay}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* TRANSFERS GRID */}
                  {matcherTab === "transfers" && VENDOR_TRANSFERS.map((vt) => (
                    <div key={vt.id} className="border border-slate-200 hover:border-teal-500 rounded-lg p-3 bg-white transition-all flex flex-col justify-between gap-3 shadow-sm">
                      <div>
                        <h5 className="text-xs font-bold text-[#0F172A]">{vt.name}</h5>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <div>
                          <p className="text-[9px] text-slate-400 font-extrabold uppercase">Contract rate</p>
                          <p className="text-xs font-bold text-[#0F172A] font-mono">₹{vt.costPerDay.toLocaleString('en-IN')}/Day</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                            +₹{vt.marginBonus.toLocaleString('en-IN')} Margin
                          </span>
                          <button
                            onClick={() => handleReplaceTransfer(activeDay, vt)}
                            className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all"
                          >
                            Swap Day {activeDay}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* AI Copilot Widget Controls inside right pane */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-4 h-4 text-teal-600" /> AI Copilot Actions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => applyCopilotAction("cheaper_hotel")}
                    className="p-2 border border-slate-200 rounded text-[10px] font-bold text-left hover:bg-slate-50 transition-all flex items-center gap-1.5 text-[#0F172A]"
                  >
                    📉 Cheapest Hotel Contract
                  </button>
                  <button 
                    onClick={() => applyCopilotAction("upgrade_luxury")}
                    className="p-2 border border-slate-200 rounded text-[10px] font-bold text-left hover:bg-slate-50 transition-all flex items-center gap-1.5 text-[#0F172A]"
                  >
                    💎 Premium Luxury Hotel
                  </button>
                  <button 
                    onClick={() => applyCopilotAction("increase_margin")}
                    className="p-2 border border-slate-200 rounded text-[10px] font-bold text-left hover:bg-slate-50 transition-all flex items-center gap-1.5 text-[#0F172A]"
                  >
                    📈 Increase Margin (+5%)
                  </button>
                  <button 
                    onClick={() => applyCopilotAction("corporate_variant")}
                    className="p-2 border border-slate-200 rounded text-[10px] font-bold text-left hover:bg-slate-50 transition-all flex items-center gap-1.5 text-[#0F172A]"
                  >
                    💼 Corporate Discount Tier
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* BRANDED PDF PREVIEW MODAL */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white font-sans">
              <h3 className="text-sm font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-teal-400" /> Live Quotation PDF Preview</h3>
              <button 
                onClick={() => setIsPdfModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#FAFBFD] custom-scrollbar">
              
              {/* PDF Document Container */}
              <div className="bg-white border border-slate-200 rounded p-8 shadow-sm space-y-6 max-w-2xl mx-auto text-slate-800 font-sans">
                
                {/* Brand PDF Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 22L12 2L22 22H2Z" fill="#0D9488" />
                        <path d="M12 2L2 22H12V2Z" fill="#0EA5E9" />
                      </svg>
                      Elite Travels
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Premium Luxury Concierge</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 space-y-0.5">
                    <p className="font-bold text-slate-800">Elite Travels Pvt. Ltd.</p>
                    <p>WhatsApp: {clientPhone}</p>
                    <p>Email: packages@elitetravels.in</p>
                  </div>
                </div>

                {/* Quotation Details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">PREPARED FOR</p>
                    <p className="font-bold text-slate-900 mt-0.5">{clientName}</p>
                    <p className="text-slate-500">{clientEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">QUOTE DATE & DURATION</p>
                    <p className="font-bold text-slate-900 mt-0.5">{nights} Nights / {nights + 1} Days</p>
                    <p className="text-slate-500">Starting: {startDate}</p>
                  </div>
                </div>

                {/* Day-by-Day Agenda Summary */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest mb-2">Detailed Itinerary Timeline</h4>
                  
                  {itinerary.map(d => (
                    <div key={d.day} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-xs font-bold text-teal-800 shrink-0">
                        D{d.day}
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-900">{d.title}</h5>
                        <p className="text-[10px] text-slate-600"><strong>Stay:</strong> {d.hotel?.name}</p>
                        <p className="text-[10px] text-slate-600"><strong>Activity:</strong> {d.activity?.name}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Cost Pricing Quote */}
                <div className="bg-slate-50 border border-slate-200 rounded p-4 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">TOTAL PACKAGE PRICE</p>
                    <p className="text-[9px] text-slate-400 font-sans">All prices in Indian Rupees (Inclusive of dynamic taxes)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-teal-700 font-mono">₹{finalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Terms and tiny watermark */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[9px] text-slate-400 font-medium">
                  <span>Terms: 50% advance for flight confirmation.</span>
                  <span className="italic">Powered by TripPilot OS</span>
                </div>

              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-2">
              <Button 
                onClick={() => setIsPdfModalOpen(false)}
                className="h-8 text-xs bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-300"
              >
                Close
              </Button>
              <Button 
                onClick={() => window.print()}
                className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white border-none flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
