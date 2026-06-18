"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Calendar, Users, Wallet, Plane, Bed, MapPin, 
  CloudSun, Shield, Send, Utensils, CheckCircle, Navigation, Activity, ArrowRight, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommandCenterProps {
  data: any;
}

export function CommandCenter({ data }: CommandCenterProps) {
  // Budget & State Variables
  const [budgetLimit, setBudgetLimit] = useState<number>(Number(data.budgetAmount) || 50000);
  const [budgetSpent, setBudgetSpent] = useState<number>(45500);
  
  // Pilot AI Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string; action?: string; warning?: boolean }>>([
    { sender: "ai", text: `Welcome to your Command Center for ${data.destination || "Bali"}! I've monitored weather patterns and optimized your routing. I also booked a ${data.stayType || "Resort"} suitable for a ${data.travelType || "Couple"} trip. How can I further customize this?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Timeline State
  const [timeline, setTimeline] = useState<any[]>([
    {
      day: "Day 1",
      date: "Monday, Oct 14",
      title: "Arrival & Unwind",
      items: [
        {
          time: "09:00",
          type: "flight",
          title: "Arrival",
          location: "Ngurah Rai International (DPS)",
          details: "Driver: Putu • Black Sedan • Plate: DK 1234 XX",
          cost: 0
        },
        {
          time: "14:00",
          type: "hotel",
          title: "Alila Villas Uluwatu",
          rating: "4.9 (1,204 reviews)",
          safetyScore: 98,
          price: "₹32,500/night",
          image: "https://images.unsplash.com/photo-1522798514323-e3e1aa8fd1bd?q=80&w=600&auto=format&fit=crop",
          desc: "Premium Ocean View Suite • AI Pre-Checked",
          link: "https://booking.com",
          cost: 32500
        },
        {
          time: "18:00",
          type: "food",
          title: "AI Recommended Dinner",
          restaurants: [
            { name: "The Rock Bar", tags: "Sunset Views • Seafood", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=400&auto=format&fit=crop" },
            { name: "Sawa Terrace", tags: "Rice Field View • Balinese", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&auto=format&fit=crop" }
          ],
          cost: 5000
        }
      ]
    },
    {
      day: "Day 2",
      date: "Tuesday, Oct 15",
      title: "Cultural Exploration",
      items: [
        {
          time: "09:00",
          type: "activity",
          title: "Tegallalang Rice Terraces",
          rating: "4.8",
          duration: "2 Hours",
          distance: "12km away",
          routing: { mode: "Taxi", time: "45 mins", cost: 500 },
          image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
          aiRec: "Arrive early to beat the crowds and heat. Best photo spots are on the eastern slope.",
          cost: 500
        },
        {
          time: "13:00",
          type: "food",
          title: "Local Specialities Lunch",
          restaurants: [
            { name: "Warung Babi Guling", tags: "Non-Veg • Authentic", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop" },
            { name: "Clear Cafe", tags: "Veg • Organic", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop" }
          ],
          cost: 2000
        }
      ]
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = userText.toLowerCase();
      let aiResponse: any = { sender: "ai", text: "I've updated your preferences." };

      if (lower.includes("scuba") || lower.includes("diving")) {
        const cost = 2500;
        if (budgetSpent + cost > budgetLimit) {
          aiResponse = { 
            sender: "ai", 
            text: `Adding Scuba Diving (₹2,500) exceeds your budget of ₹${budgetLimit.toLocaleString()}.`,
            warning: true,
            action: "budget_warning"
          };
        } else {
          setBudgetSpent(prev => prev + cost);
          aiResponse = { sender: "ai", text: "I've added Scuba Diving to Day 2. Your budget has been updated." };
          // Inject activity
          setTimeline(prev => {
            const newTl = [...prev];
            newTl[1].items.push({
              time: "15:30", type: "activity", title: "Nusa Penida Scuba Diving",
              rating: "4.9", duration: "3 Hours", distance: "45km away",
              routing: { mode: "Speedboat", time: "1 hr", cost: 1200 },
              image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop",
              aiRec: "Currents are mild today. Great visibility for Manta Rays.",
              cost: 2500
            });
            return newTl;
          });
        }
      } else if (lower.includes("reduce budget") || lower.includes("cheaper")) {
        setBudgetLimit(prev => prev - 5000);
        aiResponse = { sender: "ai", text: "I've reduced your budget by ₹5,000. I'll flag any activities that breach this new limit." };
      } else if (lower.includes("veg") || lower.includes("vegetarian")) {
        aiResponse = { sender: "ai", text: "I've updated all food recommendations to prioritize pure vegetarian options." };
      }

      setChatMessages(prev => [...prev, aiResponse]);
    }, 1200);
  };

  const handleAIAction = (actionType: string) => {
    if (actionType === "accept_warning") {
      setBudgetLimit(prev => prev + 5000);
      setChatMessages(prev => [...prev, { sender: "ai", text: "Budget increased. Scuba Diving added to itinerary." }]);
    } else if (actionType === "find_alternative") {
      setChatMessages(prev => [...prev, { sender: "ai", text: "I found a cheaper Snorkeling trip for ₹800 instead. Added to Day 2." }]);
    }
  };

  const budgetHealth = Math.round(((budgetLimit - budgetSpent) / budgetLimit) * 100) || 0;

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 px-4 md:px-8 font-sans overflow-x-hidden relative">
      
      {/* Background glow canvas */}
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-teal-500/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0" />
      
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* ==================================================== */}
        {/* LEFT COLUMN: Trip Summary & Environment (3 cols)     */}
        {/* ==================================================== */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Destination Card */}
          <div className="bg-[#0A0F1D]/90 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden">
            <div className="h-40 bg-slate-800 relative">
              <img 
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop" 
                alt="Destination"
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {data.destination || "Bali, Indonesia"}
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold font-sora mb-1">Island Escape</h2>
              <p className="text-sm text-white/60 font-semibold mb-6">{data.travelType} • 7 Days</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-white/60">Remaining Budget</span>
                  <span className="text-teal-400">₹{(budgetLimit - budgetSpent).toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: `${100 - budgetHealth}%` }} />
                </div>
                <p className="text-xs text-teal-400/80 font-bold flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3" /> On track to save ₹1,200
                </p>
              </div>
            </div>
          </div>

          {/* Budget Split Breakdown */}
          <div className="bg-[#0A0F1D]/90 backdrop-blur-xl border border-white/10 p-6 rounded-[24px]">
            <h3 className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mb-4">Cost Distribution</h3>
            <div className="space-y-3">
              {[
                { label: "Flights/Train", val: 12000, color: "bg-blue-500" },
                { label: "Hotel", val: 18000, color: "bg-purple-500" },
                { label: "Food", val: 8000, color: "bg-orange-500" },
                { label: "Activities", val: 5500, color: "bg-pink-500" },
                { label: "Emergency Buffer", val: 2000, color: "bg-emerald-500" }
              ].map((item: any) => (
                <div key={item.label} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-white/70">{item.label}</span>
                  </div>
                  <span>₹{item.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Intelligence */}
          <div className="bg-[#0A0F1D]/90 backdrop-blur-xl border border-white/10 p-6 rounded-[24px]">
            <h3 className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><CloudSun className="w-3 h-3"/> OpenWeather Forecast</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-xs font-bold text-white">Day 1 (Uluwatu)</p>
                  <p className="text-[10px] text-white/50">28°C • 10% Rain Chance</p>
                </div>
                <CloudSun className="text-yellow-400 w-6 h-6" />
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-xs font-bold text-white">Day 2 (Ubud)</p>
                  <p className="text-[10px] text-white/50">26°C • 40% Rain Chance</p>
                </div>
                <CloudSun className="text-slate-400 w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10">
              New Trip
            </Button>
            <Button onClick={handlePrint} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold border-none flex items-center gap-2">
              <Download className="w-4 h-4" /> PDF
            </Button>
          </div>
          
        </div>

        {/* ==================================================== */}
        {/* CENTER COLUMN: Main Dashboard & Timeline (6 cols)    */}
        {/* ==================================================== */}
        <div className="lg:col-span-6 space-y-6 print:w-full print:block">
          
          {/* Command Center Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white font-sora tracking-tight mb-3">
              Your {data.destination || "Bali"} <span className="text-teal-400 italic">Command Center</span>
            </h1>
            <p className="text-white/60 font-medium text-sm max-w-lg leading-relaxed">
              Curated logistics, AI-powered weather adjustments, and live spending intelligence for your tropical getaway.
            </p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0A0F1D] border border-white/10 p-6 rounded-[24px] relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 text-teal-400/30 w-12 h-12" />
              <p className="text-xs font-bold text-white/50 mb-1">Budget Health Score</p>
              <h2 className="text-4xl font-black text-white font-sora mb-4">{budgetHealth}%</h2>
              <div className="flex gap-1 h-1.5 w-full">
                <div className="bg-teal-400 w-1/3 rounded-l-full" />
                <div className="bg-teal-400/50 w-1/3" />
                <div className="bg-teal-400/20 w-1/3 rounded-r-full" />
              </div>
            </div>
            <div className="bg-teal-500 border border-teal-400 p-6 rounded-[24px] flex flex-col justify-center">
              <Wallet className="text-teal-900 w-6 h-6 mb-3" />
              <p className="text-teal-900 font-bold text-sm">Next Charge</p>
              <h2 className="text-2xl font-black text-white font-sora">₹850</h2>
              <p className="text-teal-100 text-xs font-semibold">Airport Transfer</p>
            </div>
          </div>

          {/* Live Route Optimization Map Mock */}
          <div className="h-48 bg-slate-900 border border-white/10 rounded-[24px] overflow-hidden relative flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] opacity-30 mix-blend-luminosity bg-cover bg-center" />
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live: Approving Route Optimization</span>
            </div>
            {/* SVG stylized route line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path d="M50 150 Q 200 50, 400 120 T 700 80" stroke="#14B8A6" strokeWidth="3" fill="transparent" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
              <circle cx="50" cy="150" r="4" fill="#14B8A6" />
              <circle cx="400" cy="120" r="4" fill="#14B8A6" />
              <circle cx="700" cy="80" r="4" fill="#14B8A6" />
            </svg>
          </div>

          {/* Dynamic Day-by-Day Timeline */}
          <div className="space-y-12 pt-4 border-l border-white/10 ml-4 pl-8 relative">
            {timeline.map((day: any, idx: number) => (
              <div key={idx} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-[#030712] border-2 border-teal-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white font-sora mb-1">{day.day}: {day.title}</h3>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-6">{day.date}</p>

                <div className="space-y-6">
                  {day.items.map((item: any, iIdx: number) => (
                    <div key={iIdx} className="bg-[#0A0F1D]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-12 text-center shrink-0">
                          <span className="text-xs font-bold text-teal-400 block">{item.time}</span>
                        </div>
                        
                        <div className="flex-1">
                          {/* Flight View */}
                          {item.type === "flight" && (
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="flex items-center gap-2 mb-2">
                                <Plane className="w-4 h-4 text-white/50" />
                                <span className="text-sm font-bold text-white">{item.title}</span>
                              </div>
                              <p className="text-xs text-white/70 font-semibold">{item.location}</p>
                              <p className="text-[10px] text-white/40 mt-1">{item.details}</p>
                            </div>
                          )}

                          {/* Hotel View */}
                          {item.type === "hotel" && (
                            <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                              <div className="h-32 w-full relative">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-teal-500/90 backdrop-blur text-white text-[9px] font-black px-2 py-1 rounded">
                                  AI SAFETY SCORE: {item.safetyScore}
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                  <span className="text-xs font-bold text-white">{item.price}</span>
                                </div>
                                <p className="text-[10px] text-yellow-400 font-bold mb-2">★ {item.rating}</p>
                                <p className="text-[10px] text-white/50 mb-3">{item.desc}</p>
                                <Button className="w-full h-8 text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white">View Affiliate Details</Button>
                              </div>
                            </div>
                          )}

                          {/* Activity / Routing View */}
                          {item.type === "activity" && (
                            <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                              <div className="flex gap-4 mb-4">
                                <img src={item.image} alt={item.title} className="w-20 h-20 rounded-lg object-cover" />
                                <div>
                                  <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                                  <p className="text-[10px] text-white/50 mb-1">Google Places: ★ {item.rating} • {item.distance}</p>
                                  <div className="bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] p-2 rounded-lg mt-2">
                                    <Sparkles className="w-3 h-3 inline mr-1" />
                                    {item.aiRec}
                                  </div>
                                </div>
                              </div>
                              {/* Routing Intelligence */}
                              <div className="bg-[#030712] rounded-lg p-3 flex justify-between items-center text-[10px] font-bold border border-white/5">
                                <div className="flex items-center gap-2 text-white/70">
                                  <Navigation className="w-3 h-3 text-teal-400" />
                                  Google Maps Route: {item.routing?.mode}
                                </div>
                                <div className="text-white/50">
                                  {item.routing?.time} • <span className="text-white">₹{item.routing?.cost}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Food View */}
                          {item.type === "food" && (
                            <div>
                              <div className="flex items-center gap-2 mb-3 text-white/60">
                                <Utensils className="w-4 h-4" />
                                <span className="text-xs font-bold">{item.title}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {item.restaurants?.map((rest: any) => (
                                  <div key={rest.name} className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                                    <img src={rest.img} alt={rest.name} className="w-full h-20 object-cover" />
                                    <div className="p-3">
                                      <h5 className="text-[11px] font-bold text-white mb-0.5">{rest.name}</h5>
                                      <p className="text-[9px] text-white/40">{rest.tags}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: AI & Intelligence (3 cols)             */}
        {/* ==================================================== */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Pilot AI Chat Widget */}
          <div className="bg-[#0A0F1D]/90 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden flex flex-col h-[550px]">
            <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-500/20 flex items-center justify-center">
                  <Activity className="w-3 h-3 text-teal-400" />
                </div>
                <span className="text-sm font-bold text-white font-sora">Pilot AI</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#14B8A6]" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-semibold">
              {chatMessages.map((msg: any, i: number) => (
                <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] ${
                    msg.sender === "user" 
                      ? "bg-white/10 text-white" 
                      : msg.warning 
                        ? "bg-red-500/10 border border-red-500/20 text-red-200" 
                        : "bg-teal-500/10 border border-teal-500/20 text-teal-100"
                  }`}>
                    {msg.text}
                  </div>
                  
                  {/* Action Buttons for AI Warnings */}
                  {msg.action === "budget_warning" && (
                    <div className="flex gap-2 mt-2">
                      <Button onClick={() => handleAIAction("accept_warning")} className="h-7 text-[9px] font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30">
                        Accept & Increase
                      </Button>
                      <Button onClick={() => handleAIAction("find_alternative")} className="h-7 text-[9px] font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10">
                        Find Alternative
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start">
                  <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-100 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  placeholder="Ask Pilot anything... (e.g., 'Add Scuba')"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-teal-500"
                />
                <button type="submit" className="absolute right-1.5 top-1.5 w-7 h-7 rounded-full bg-white flex items-center justify-center text-black hover:bg-teal-400 transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>

          {/* Travel Safety Intelligence */}
          <div className="bg-[#0A0F1D]/90 backdrop-blur-xl border border-white/10 p-5 rounded-[24px]">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-teal-400" />
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Travel Safety Intelligence</h4>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed font-semibold">
              Local authorities in Uluwatu have reported increased swell activity. Beach clubs may have restricted water access today. Always follow flag warnings.
            </p>
          </div>

        </div>
        
      </div>
    </div>
  );
}
