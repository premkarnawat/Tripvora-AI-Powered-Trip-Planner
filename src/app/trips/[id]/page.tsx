"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Sparkles, Calendar, Users, Wallet, Plane, Bed, 
  MapPin, CloudSun, PhoneCall, DollarSign, Compass, Star, 
  ChevronRight, ArrowLeft, Download, Share2, Edit2, RotateCw, 
  MessageSquare, Shield, Clock, HelpCircle, AlertCircle, Map,
  Eye, Navigation, ArrowUpRight, CheckCircle2, AlertTriangle, Plus, Check, ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function TripItineraryPage() {
  const params = useParams();
  const id = params.id as string;

  // Local state for interactive features
  const [activeDay, setActiveDay] = useState(1);
  const [groupType, setGroupType] = useState("Group"); // Family, Group, Corporate
  const [selectedTransport, setSelectedTransport] = useState("Auto");
  const [activityImpactAdded, setActivityImpactAdded] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotActionText, setCopilotActionText] = useState("");

  // Budget details
  const [totalBudget, setTotalBudget] = useState(50000);
  const [usedBudget, setUsedBudget] = useState(21500);

  const handleToggleActivityImpact = () => {
    if (activityImpactAdded) {
      setUsedBudget(prev => prev - 3500);
      setActivityImpactAdded(false);
    } else {
      setUsedBudget(prev => prev + 3500);
      setActivityImpactAdded(true);
    }
  };

  const handleCopilotCommand = (cmd: string) => {
    setCopilotActionText(`AI Command: ${cmd} initiated...`);
    setTimeout(() => setCopilotActionText(""), 4000);
  };

  return (
    <div className="traveler-theme min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-6 pb-20 font-sans relative">
      
      {/* Floating AI Copilot Panel */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className="w-12 h-12 rounded-full bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
          title="AI Copilot Assistant"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
        </button>

        <AnimatePresence>
          {isCopilotOpen && (
            <div className="absolute bottom-14 right-0 w-80 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xl space-y-3 animate-in slide-in-from-bottom-5 duration-200">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#14B8A6]" />
                  <span>AI Copilot Assistant</span>
                </h4>
                <button onClick={() => setIsCopilotOpen(false)} className="text-[#94A3B8] hover:text-[#0F172A] text-xs font-bold">Close</button>
              </div>

              {copilotActionText && (
                <div className="p-2 bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 rounded-lg text-[10px] font-bold">
                  {copilotActionText}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button onClick={() => handleCopilotCommand("Reduce Budget")} className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-left">Reduce Budget</button>
                <button onClick={() => handleCopilotCommand("Upgrade Hotel")} className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-left">Upgrade Hotel</button>
                <button onClick={() => handleCopilotCommand("Replace Restaurant")} className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-left">Replace Restaurant</button>
                <button onClick={() => handleCopilotCommand("Optimize Route")} className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-left">Optimize Route</button>
                <button onClick={() => handleCopilotCommand("Find Nearby ATM")} className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-left">Find Nearby ATM</button>
                <button onClick={() => handleCopilotCommand("Contact Travel Expert")} className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-left">Contact Expert</button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-6">
        
        {/* Back Link */}
        <div>
          <Link href="/dashboard" className="flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#14B8A6] transition-colors w-max">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* TOP SECTION: Destination Hero exactly like reference Image 4 */}
        <div className="bg-white border border-[#E5E7EB] rounded-[32px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row justify-between items-stretch">
          <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="px-2 py-0.5 bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 text-[9px] font-bold rounded">
                  AI RECOMMENDATION
                </span>
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[#0F172A] text-[9px] font-bold rounded">
                  COUPLE TRIP
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black font-sora text-[#0F172A]">Goa Sunset & Beach Escape</h1>
              <p className="text-xs font-semibold text-[#64748B] mt-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#14B8A6]" /> North & South Goa, India
              </p>
            </div>

            {/* Travel Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">
              <div className="border-l-2 border-[#14B8A6] pl-3">
                <span className="text-[8px] text-[#94A3B8] block">Duration</span>
                <span className="text-[#0F172A] font-extrabold">7 Days (Goa)</span>
              </div>
              <div className="border-l-2 border-[#14B8A6] pl-3">
                <span className="text-[8px] text-[#94A3B8] block">Weather</span>
                <span className="text-[#0F172A] font-extrabold">30°C / Humid</span>
              </div>
              <div className="border-l-2 border-[#14B8A6] pl-3">
                <span className="text-[8px] text-[#94A3B8] block">Trip Status</span>
                <span className="text-[#16A34A] font-extrabold">Confirmed</span>
              </div>
              <div className="border-l-2 border-[#14B8A6] pl-3">
                <span className="text-[8px] text-[#94A3B8] block">AI Score</span>
                <span className="text-[#14B8A6] font-extrabold">95% Uptime</span>
              </div>
            </div>
          </div>

          {/* Large Hero Image */}
          <div className="w-full lg:w-[480px] h-48 lg:h-auto bg-slate-100 relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600&auto=format&fit=crop" 
              alt="Goa beach"
              className="w-full h-full object-cover"
            />
            {/* Quick Actions overlay */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button className="p-2 bg-white/95 backdrop-blur hover:bg-white text-[#0F172A] rounded-xl shadow-md text-xs font-bold flex items-center gap-1 transition-all" title="Download PDF">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="p-2 bg-white/95 backdrop-blur hover:bg-white text-[#0F172A] rounded-xl shadow-md text-xs font-bold flex items-center gap-1 transition-all" title="Share Link">
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-2 bg-white/95 backdrop-blur hover:bg-white text-[#0F172A] rounded-xl shadow-md text-xs font-bold flex items-center gap-1 transition-all" title="Regenerate Itinerary">
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Days Tab Selection */}
        <div className="bg-white border border-[#E5E7EB] p-3 rounded-2xl flex gap-2 overflow-x-auto">
          {[1, 2, 3].map(d => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeDay === d 
                  ? "bg-[#0F172A] text-white" 
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              }`}
            >
              Day {d} Summary
            </button>
          ))}
        </div>

        {/* Triple Panel Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Journey Timeline */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 space-y-6 shadow-sm">
              <h3 className="text-sm font-bold font-sora text-[#0F172A] border-b border-slate-100 pb-3">Journey Timeline</h3>
              
              <div className="border-l border-slate-100 ml-3 pl-6 space-y-6">
                
                {/* 06:00 AM */}
                <TimelineStep time="06:00 AM" title="Reach Pune Railway Station" desc="Arrive at Platform 1 for the Goa Express." />

                {/* 06:30 AM */}
                <TimelineStep time="06:30 AM" title="Board Train">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] font-semibold text-[#64748B] space-y-1 mt-1">
                    <p className="text-[#0F172A] font-bold">Goa Express (Train No: 12780)</p>
                    <p>Coach B2 • Seats 24, 26 • Platform 1</p>
                    <a href="https://www.irctc.co.in" className="text-[#14B8A6] hover:underline flex items-center gap-0.5 mt-1">
                      <span>View Ticket PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </TimelineStep>

                {/* 12:00 PM */}
                <TimelineStep time="12:00 PM" title="Reach Goa" desc="Arrive at Madgaon Junction (MAO) station." />

                {/* 12:20 PM */}
                <TimelineStep time="12:20 PM" title="Take Auto to Hotel">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] font-semibold text-[#64748B] space-y-1 mt-1">
                    <p className="text-[#0F172A] font-bold">Prepaid Auto Counter</p>
                    <p>Cost: ₹120 per person • Duration: 10 mins</p>
                    <span className="px-2 py-0.5 bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 text-[9px] font-bold rounded">
                      AI RECOMMENDED
                    </span>
                  </div>
                </TimelineStep>

                {/* 12:45 PM */}
                <TimelineStep time="12:45 PM" title="Hotel Check-In">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] font-semibold text-[#64748B] space-y-1 mt-1">
                    <p className="text-[#0F172A] font-bold">The Leela Goa</p>
                    <p>Luxury Garden Suite • Booking ID: #XP-9021</p>
                    <a href="https://www.booking.com" className="text-[#14B8A6] hover:underline flex items-center gap-0.5 mt-1">
                      <span>View Booking.com Voucher</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </TimelineStep>

              </div>
            </div>

            {/* Group Travel Module */}
            <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Group Travel Module</h4>
                <div className="flex bg-[#F1F5F9] rounded-lg p-0.5">
                  {["Family", "Group", "Corp"].map(t => (
                    <button
                      key={t}
                      onClick={() => setGroupType(t)}
                      className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                        groupType === t ? "bg-white shadow text-[#0F172A]" : "text-[#64748B]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {groupType === "Family" && (
                <div className="space-y-3 text-xs font-semibold text-[#64748B]">
                  <p className="text-[#0F172A] font-bold">Family Configuration: 2 Adults, 1 Child</p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[9px] font-bold text-[#14B8A6] block uppercase">Kids Activity Suggestion</span>
                    <p className="text-[#0F172A]">Dolphin Spotting Tour at Miramar Beach</p>
                  </div>
                </div>
              )}

              {groupType === "Group" && (
                <div className="space-y-3 text-xs font-semibold text-[#64748B]">
                  <p className="text-[#0F172A] font-bold">Group Expense Split (4 travelers)</p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Total Dinner Bill:</span>
                      <span className="text-[#0F172A] font-bold">₹4,800</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200/60 pt-1.5">
                      <span>Split Per Person:</span>
                      <span className="text-[#14B8A6] font-bold">₹1,200</span>
                    </div>
                  </div>
                </div>
              )}

              {groupType === "Corp" && (
                <div className="space-y-3 text-xs font-semibold text-[#64748B]">
                  <p className="text-[#0F172A] font-bold">Corporate Logistics: 12 Employees</p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[9px] font-bold text-blue-600 block uppercase">Conference Hall Room</span>
                    <p className="text-[#0F172A]">Leela Ballroom Reserved: 09:00 AM - 01:00 PM</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* CENTER PANEL: Interactive Route Map exactly like Image 3 */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Map Container */}
            <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-4 shadow-sm flex flex-col justify-between h-[450px]">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                <div>
                  <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Interactive Route Map</span>
                  </h3>
                  <p className="text-[9px] text-[#94A3B8]">Day 1 driving routing details (Madgaon -&gt; The Leela)</p>
                </div>
                <span className="text-[10px] font-bold text-[#14B8A6]">Distance: 32 km</span>
              </div>

              {/* Visual simulated map graphic exactly like Image 3 */}
              <div className="flex-1 rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200">
                
                {/* Simulated map route nodes */}
                <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-tr from-slate-100 to-sky-100">
                  <div className="w-full h-full relative">
                    
                    {/* SVG Route Line */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                      <path d="M40 160 Q 80 80, 160 40" fill="none" stroke="#14B8A6" strokeWidth="2.5" strokeDasharray="4 3" />
                    </svg>

                    {/* Node 1: Madgaon Station */}
                    <div className="absolute bottom-8 left-8 text-center space-y-1">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] shadow-md flex items-center justify-center text-xs font-bold text-[#0F172A]">
                        MAO
                      </div>
                      <span className="text-[9px] font-bold bg-[#0F172A] text-white px-2 py-0.5 rounded shadow">Madgaon Station</span>
                    </div>

                    {/* Node 2: The Leela Goa */}
                    <div className="absolute top-8 right-8 text-center space-y-1">
                      <div className="w-8 h-8 rounded-full bg-[#14B8A6] text-white shadow-md flex items-center justify-center text-xs font-bold">
                        <Bed className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold bg-white border border-slate-200 text-[#0F172A] px-2 py-0.5 rounded shadow">The Leela Goa</span>
                    </div>

                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute right-3 top-3 bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-1 shadow flex flex-col gap-1.5">
                  <button className="w-7 h-7 hover:bg-slate-50 rounded flex items-center justify-center font-bold text-sm">+</button>
                  <button className="w-7 h-7 hover:bg-slate-50 rounded flex items-center justify-center font-bold text-sm">-</button>
                </div>
              </div>
            </div>

            {/* Food Module suggestions */}
            <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold font-sora text-[#0F172A] border-b border-slate-100 pb-2">AI Food Recommendations</h3>
              
              <div className="space-y-3">
                {[
                  { name: "Fisherman's Wharf", tag: "BEST SEAFOOD", cost: "₹1,200 avg", rating: 4.8, distance: "2 km away" },
                  { name: "Martin's Corner", tag: "BEST LOCAL GOAN", cost: "₹950 avg", rating: 4.7, distance: "4 km away" },
                  { name: "Navtara Veg Restaurant", tag: "BEST VEGETARIAN", cost: "₹350 avg", rating: 4.4, distance: "5 km away" }
                ].map((food, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-[#0F172A]">{food.name}</p>
                        <span className="text-[8px] font-bold text-[#14B8A6] tracking-wider bg-[#14B8A6]/10 px-1 rounded">{food.tag}</span>
                      </div>
                      <p className="text-[9px] text-[#94A3B8] mt-0.5">{food.distance} • {food.cost}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#0F172A] flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {food.rating}
                      </span>
                      <button className="px-2 py-0.5 bg-[#0F172A] text-white text-[9px] font-bold rounded">Book Table</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: AI Travel Intelligence */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Live Intelligence cards */}
            <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest flex items-center justify-between">
                <span>AI Travel Intelligence</span>
                <Sparkles className="w-4.5 h-4.5 text-[#14B8A6]" />
              </h4>

              <div className="space-y-3 text-xs font-semibold text-[#64748B]">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Crowd Prediction</span>
                  <span className="text-amber-600 font-bold">Moderate (54%)</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Best Visiting Hours</span>
                  <span className="text-[#0EA5A4]">04:00 PM - 06:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Sunset Timing</span>
                  <span className="text-[#0F172A]">06:14 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Safety Index</span>
                  <span className="text-[#16A34A] font-bold">High (9.2 / 10)</span>
                </div>
              </div>
            </div>

            {/* Budget impact simulator exactly like image 1 */}
            <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Itinerary Budget Tracker</h3>
              
              <div className="space-y-2 text-xs font-semibold text-[#64748B]">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Total Budget:</span>
                  <span className="text-[#0F172A] font-bold">₹{totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Used Spends:</span>
                  <span className="text-[#0F172A]">₹{usedBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="text-[#16A34A] font-bold">₹{(totalBudget - usedBudget).toLocaleString()}</span>
                </div>
              </div>

              {/* Interactive Add Activity simulator */}
              <div className="p-3 bg-[#14B8A6]/5 border border-dashed border-[#14B8A6]/30 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-[#14B8A6]">ADD ACTIVITY SIMULATOR</span>
                  <span className="text-[9px] font-bold text-[#16A34A]">+₹3,500</span>
                </div>
                <p className="text-[9px] text-[#64748B] font-semibold leading-tight">Simulate the budget impact of adding a Scuba Diving activity tomorrow.</p>
                <button 
                  onClick={handleToggleActivityImpact}
                  className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                    activityImpactAdded 
                      ? "bg-[#16A34A] text-white" 
                      : "bg-[#14B8A6]/10 text-[#14B8A6] hover:bg-[#14B8A6]/20"
                  }`}
                >
                  {activityImpactAdded ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{activityImpactAdded ? "Added to budget" : "Simulate Add Activity"}</span>
                </button>
              </div>
            </div>

            {/* Affiliate matrix options */}
            <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Compare Stay Prices</h3>
              
              <div className="space-y-2.5">
                {[
                  { provider: "Booking.com", price: "₹18,500", tag: "BEST RATED", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  { provider: "Agoda", price: "₹18,200", tag: "LOWEST PRICE", color: "bg-[#0EA5A4]/10 text-[#0EA5A4] border-[#0EA5A4]/20" },
                  { provider: "Direct Website", price: "₹19,000", tag: "BEST DEAL", color: "bg-sky-50 text-sky-700 border-sky-200" }
                ].map((aff, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl text-xs font-semibold">
                    <div>
                      <p className="text-[#0F172A] font-bold">{aff.provider}</p>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border mt-1 inline-block ${aff.color}`}>{aff.tag}</span>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0F172A]">{aff.price}</p>
                      <span className="text-[9px] text-[#94A3B8] hover:underline cursor-pointer">Redirect link</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Helplines Section */}
            <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-[#DC2626] uppercase tracking-widest flex items-center justify-between">
                <span>Emergency contacts</span>
                <PhoneCall className="w-4.5 h-4.5 text-[#DC2626]" />
              </h4>

              <div className="space-y-2 text-xs font-semibold text-[#64748B]">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Ambulance / Medical</span>
                  <span className="text-[#DC2626]">Dial 108</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Police helpline</span>
                  <span className="text-[#DC2626]">Dial 112</span>
                </div>
                <div className="flex justify-between">
                  <span>Tourist Support</span>
                  <span className="text-[#0F172A] font-bold">+91 99999 77777</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Day Summary Card footer */}
        <div className="bg-white border border-[#E5E7EB] rounded-[32px] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest">End of Day 1 Summary</span>
            <h4 className="text-base font-bold font-sora text-[#0F172A] mt-1">Excellent travel performance score</h4>
            <p className="text-xs text-[#64748B] mt-0.5">Budget spent is well within target allocations. Transportation average speed: 32 km/h.</p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center text-xs font-bold text-[#64748B] uppercase shrink-0">
            <div>
              <span className="text-[8px] text-[#94A3B8] block">Dist Covered</span>
              <span className="text-[#0F172A] font-extrabold mt-0.5 block">36 km</span>
            </div>
            <div>
              <span className="text-[8px] text-[#94A3B8] block">Food Expenses</span>
              <span className="text-[#0F172A] font-extrabold mt-0.5 block">₹4,200</span>
            </div>
            <div>
              <span className="text-[8px] text-[#94A3B8] block">Overall Rating</span>
              <span className="text-[#14B8A6] font-extrabold mt-0.5 block">4.9 / 5.0</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

function TimelineStep({ time, title, desc, children }: { time: string, title: string, desc?: string, children?: React.ReactNode }) {
  return (
    <div className="relative text-xs font-semibold text-[#64748B]">
      {/* Icon node dot */}
      <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-[#14B8A6] border-2 border-white shadow-sm" />
      
      <span className="text-[9px] font-bold text-[#94A3B8] block">{time}</span>
      <h4 className="text-sm font-bold text-[#0F172A] mt-0.5">{title}</h4>
      {desc && <p className="text-[#64748B] mt-1 leading-snug font-medium">{desc}</p>}
      {children}
    </div>
  );
}

// AnimatePresence helper simulation
function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
