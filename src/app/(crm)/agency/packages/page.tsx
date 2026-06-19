"use client";

import { useState } from "react";
import { Sparkles, MapPin, Calendar, Users, DollarSign, Hotel, Map, Coffee, FileText, Download, ArrowRight, Settings, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PackageBuilderPage() {
  const [activeTab, setActiveTab] = useState("Itinerary");
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10 flex gap-6">
      
      {/* Left Input Pane */}
      <div className="w-80 shrink-0 space-y-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Package Builder
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Generate complete travel packages using TripPilot AI.</p>
        </div>

        <div className="bg-[#0B1220] border border-white/5 rounded-md p-4 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" /> Parameters
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                <input type="text" defaultValue="Bali, Indonesia" className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Duration</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                  <input type="number" defaultValue={6} className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Members</label>
                <div className="relative">
                  <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                  <input type="number" defaultValue={2} className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Total Budget (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                <input type="text" defaultValue="2,50,000" className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white font-mono focus:outline-none focus:border-[#38BDF8]" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Travel Style</label>
              <button className="w-full flex items-center justify-between bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white">
                <span>Luxury & Leisure</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Target Margin (%)</label>
              <input type="number" defaultValue={18} className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white font-mono focus:outline-none focus:border-[#38BDF8]" />
            </div>
          </div>

          <Button 
            onClick={() => setIsGenerated(true)}
            className="w-full h-9 mt-4 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> {isGenerated ? 'Regenerate Package' : 'Generate Package'}
          </Button>
        </div>
      </div>

      {/* Right Generated Pane */}
      {isGenerated ? (
        <div className="flex-1 flex flex-col bg-[#0B1220] border border-white/5 rounded-md shadow-sm overflow-hidden h-[85vh]">
          {/* Header & Tabs */}
          <div className="border-b border-white/5 bg-white/[0.02]">
            <div className="p-4 flex justify-between items-center border-b border-white/5">
              <div>
                <h2 className="text-lg font-bold text-white">6 Days Luxury Bali Retreat</h2>
                <div className="flex gap-4 mt-1 text-xs font-medium text-[#94A3B8]">
                  <span>Total Cost: <strong className="text-white">₹1,95,000</strong></span>
                  <span>Selling Price: <strong className="text-[#14B8A6]">₹2,30,100</strong></span>
                  <span>Margin: <strong className="text-[#38BDF8]">18% (₹35,100)</strong></span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
                  <Download className="w-3.5 h-3.5 mr-1" /> PDF
                </Button>
                <Button className="h-8 text-xs font-bold bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] border-none">
                  Convert to Quotation <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="flex px-4 pt-2 gap-1 overflow-x-auto">
              {[
                { name: "Itinerary", icon: Map },
                { name: "Hotels", icon: Hotel },
                { name: "Activities", icon: Sparkles },
                { name: "Meals", icon: Coffee },
                { name: "Costing & Margin", icon: DollarSign },
              ].map(tab => (
                <button 
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-1.5 px-3 pb-2 text-xs font-bold border-b-2 transition-colors ${activeTab === tab.name ? 'border-[#14B8A6] text-[#14B8A6]' : 'border-transparent text-[#94A3B8] hover:text-white'}`}
                >
                  <tab.icon className="w-3.5 h-3.5" /> {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#020817]">
            {activeTab === "Itinerary" && (
              <div className="max-w-2xl mx-auto space-y-6">
                {[
                  { day: 1, title: "Arrival in Bali & Uluwatu Sunset", desc: "Private airport transfer to your luxury villa. Evening visit to Uluwatu Temple followed by a seafood dinner at Jimbaran Bay." },
                  { day: 2, title: "Ubud Cultural Tour", desc: "Full day private tour of Ubud. Visit the Sacred Monkey Forest, Tegalalang Rice Terraces, and the Royal Palace. Includes lunch overlooking the valleys." },
                  { day: 3, title: "Nusa Penida Island Hopping", desc: "Speedboat to Nusa Penida. Snorkeling with Manta Rays and visiting Kelingking Beach and Broken Beach." },
                  { day: 4, title: "Seminyak Leisure & Beach Club", desc: "Morning at leisure. Afternoon VIP bed reservation at Potato Head Beach Club with sunset cocktails." },
                ].map((day) => (
                  <div key={day.day} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 flex items-center justify-center text-xs font-bold text-[#14B8A6] shrink-0">
                        D{day.day}
                      </div>
                      <div className="w-px h-full bg-white/10 my-2" />
                    </div>
                    <div className="bg-[#0B1220] border border-white/5 rounded-md p-4 flex-1 mb-2 hover:border-white/10 transition-colors">
                      <h3 className="text-sm font-bold text-white mb-2">{day.title}</h3>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{day.desc}</p>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white flex items-center gap-1"><Hotel className="w-3 h-3 text-[#38BDF8]" /> W Bali Seminyak</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white flex items-center gap-1"><Map className="w-3 h-3 text-[#10B981]" /> Private Car</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === "Costing & Margin" && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
                        <th className="py-3 px-4">Component</th>
                        <th className="py-3 px-4">Provider</th>
                        <th className="py-3 px-4 text-right">Base Cost</th>
                        <th className="py-3 px-4 text-right">Selling Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 text-xs font-bold text-white flex items-center gap-2"><Hotel className="w-3.5 h-3.5 text-[#38BDF8]" /> Accommodation (5 Nights)</td>
                        <td className="py-3 px-4 text-xs text-[#94A3B8]">W Bali Seminyak</td>
                        <td className="py-3 px-4 text-xs text-white text-right font-mono">₹1,20,000</td>
                        <td className="py-3 px-4 text-xs text-[#14B8A6] font-bold text-right font-mono">₹1,41,600</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 text-xs font-bold text-white flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Activities & Tours</td>
                        <td className="py-3 px-4 text-xs text-[#94A3B8]">Bali Private Tours Ltd.</td>
                        <td className="py-3 px-4 text-xs text-white text-right font-mono">₹45,000</td>
                        <td className="py-3 px-4 text-xs text-[#14B8A6] font-bold text-right font-mono">₹53,100</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 text-xs font-bold text-white flex items-center gap-2"><Map className="w-3.5 h-3.5 text-[#10B981]" /> Transportation</td>
                        <td className="py-3 px-4 text-xs text-[#94A3B8]">VIP Transfers</td>
                        <td className="py-3 px-4 text-xs text-white text-right font-mono">₹30,000</td>
                        <td className="py-3 px-4 text-xs text-[#14B8A6] font-bold text-right font-mono">₹35,400</td>
                      </tr>
                      <tr className="bg-white/[0.02] border-t-2 border-white/10">
                        <td colSpan={2} className="py-4 px-4 text-sm font-bold text-white text-right">Totals (18% Margin)</td>
                        <td className="py-4 px-4 text-sm font-bold text-white text-right font-mono">₹1,95,000</td>
                        <td className="py-4 px-4 text-sm font-bold text-[#14B8A6] text-right font-mono">₹2,30,100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Other tabs placeholder */}
            {["Hotels", "Activities", "Meals"].includes(activeTab) && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Settings className="w-8 h-8 text-white/20 mb-4 animate-spin-slow" />
                <h3 className="text-sm font-bold text-white mb-1">Details populated by AI</h3>
                <p className="text-xs text-[#94A3B8]">Click 'Convert to Quotation' to finalize vendors and pricing.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/[0.01] rounded-md h-[85vh]">
          <div className="w-12 h-12 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center mb-4 relative">
            <Sparkles className="w-6 h-6 text-[#14B8A6]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#38BDF8] rounded-full border-2 border-[#020817]" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">TripPilot Package AI</h2>
          <p className="text-sm text-[#94A3B8] max-w-sm text-center mb-6 leading-relaxed">
            Configure your destination and budget parameters on the left, and our AI will generate a complete, perfectly margined travel package instantly.
          </p>
          <div className="flex gap-4 text-xs text-[#94A3B8] font-bold">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#10B981]" /> Auto-Routing</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#10B981]" /> Live Pricing</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#10B981]" /> Profit Calculator</span>
          </div>
        </div>
      )}

    </div>
  );
}
