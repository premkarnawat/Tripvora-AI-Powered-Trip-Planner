"use client";

import { useState } from "react";
import { FileText, Download, Send, Phone, MessageCircle, Mail, Plus, MapPin, Calculator, PlusCircle, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuotationBuilderPage() {
  const [markup, setMarkup] = useState(18);
  const [baseCost, setBaseCost] = useState(195000);
  const [gst, setGst] = useState(5);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const markupAmount = (baseCost * markup) / 100;
  const subtotal = baseCost + markupAmount;
  const gstAmount = (subtotal * gst) / 100;
  const finalPrice = subtotal + gstAmount;

  return (
    <>
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10 flex flex-col xl:flex-row gap-6">
      
      {/* Main Builder Area */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Quotation Builder
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">Create and send premium proposals to clients.</p>
          </div>
          <div className="flex gap-2">
            <Button className="h-8 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
              Save Draft
            </Button>
            <Button className="h-8 text-xs font-bold bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/20 transition-colors">
              <Download className="w-3.5 h-3.5 mr-1" /> Generate PDF
            </Button>
            <Button 
              onClick={() => setIsNewModalOpen(true)}
              className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> New Quotation
            </Button>
          </div>
        </div>

        {/* AI Estimation Mode Warning */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-md p-3 flex items-start gap-3">
          <div className="mt-0.5">
            <Calculator className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Estimated Pricing Mode</h3>
            <p className="text-xs text-purple-300/80 mt-0.5">No local vendors were found for this destination. These costs are AI-generated estimates. Please verify actual availability before finalizing booking.</p>
          </div>
        </div>

        {/* Client & Trip Details */}
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Lead / Client</label>
            <select className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]">
              <option>Smith Family (L-4092)</option>
              <option>Acme Corp (L-4089)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Destination</label>
            <input type="text" defaultValue="Tokyo, Japan" className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Dates</label>
            <input type="text" defaultValue="Oct 15 - Oct 25, 2026" className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 block">Travelers</label>
            <input type="number" defaultValue={4} className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]" />
          </div>
        </div>

        {/* Components Editor */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest px-1">Package Components</h2>
          
          <ComponentSection title="Hotels & Accommodation" total="₹1,20,000" items={[
            { name: "The Ritz-Carlton, Tokyo (Deluxe Room, 5 Nights)", cost: "₹80,000" },
            { name: "Hoshinoya Kyoto (Ryokan, 5 Nights)", cost: "₹40,000" }
          ]} />
          
          <ComponentSection title="Activities & Sightseeing" total="₹45,000" items={[
            { name: "Private Mt. Fuji Tour with Guide", cost: "₹25,000" },
            { name: "Kyoto Temple Pass & Tea Ceremony", cost: "₹20,000" }
          ]} />
          
          <ComponentSection title="Transportation" total="₹30,000" items={[
            { name: "JR Pass (14 Days) - 4 Pax", cost: "₹25,000" },
            { name: "Airport Transfers (VIP Alphard)", cost: "₹5,000" }
          ]} />
          
          <ComponentSection title="Meals & Dining" total="₹20,000" items={[
            { name: "Welcome Gala Dinner", cost: "₹15,000" },
            { name: "Daily Breakfast Supplement", cost: "₹5,000" }
          ]} />

          <div className="bg-[#020817] border border-white/5 rounded-md p-4 space-y-3">
             <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block">Travel Notes & Inclusions</label>
             <textarea className="w-full bg-[#0B1220] border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none focus:border-[#38BDF8] min-h-[80px]" defaultValue="Includes all local taxes and service charges. Early check-in requested but subject to availability." />
          </div>

          <div className="bg-[#020817] border border-white/5 rounded-md p-4 space-y-3">
             <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block">Terms & Conditions</label>
             <textarea className="w-full bg-[#0B1220] border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none focus:border-[#38BDF8] min-h-[80px]" defaultValue="100% advance required for flight confirmation. 50% advance for hotels. Standard cancellation policy applies." />
          </div>

          <Button className="w-full h-10 border border-dashed border-white/20 bg-transparent hover:bg-white/5 text-[#94A3B8] hover:text-white rounded-md text-xs font-bold transition-colors">
            <PlusCircle className="w-4 h-4 mr-1.5" /> Add Custom Component
          </Button>
        </div>

      </div>

      {/* Right Calculator & Actions Sidebar */}
      <div className="xl:w-[350px] shrink-0 space-y-6">
        
        {/* Live Calculator */}
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#14B8A6] to-[#38BDF8]" />
          
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <Calculator className="w-4 h-4 text-[#14B8A6]" /> Live Profit Calculator
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-xs text-[#94A3B8]">Total Base Cost</span>
              <span className="text-sm font-mono font-bold text-white">₹{baseCost.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#94A3B8]">Agency Margin (%)</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={markup} 
                  onChange={(e) => setMarkup(Number(e.target.value))} 
                  className="w-16 bg-[#020817] border border-white/10 rounded-md py-1 px-2 text-xs text-white text-right font-mono focus:border-[#38BDF8] focus:outline-none"
                />
                <span className="text-xs font-bold text-[#14B8A6]">₹{markupAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-xs text-[#94A3B8]">GST (%)</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={gst} 
                  onChange={(e) => setGst(Number(e.target.value))} 
                  className="w-16 bg-[#020817] border border-white/10 rounded-md py-1 px-2 text-xs text-white text-right font-mono focus:border-[#38BDF8] focus:outline-none"
                />
                <span className="text-xs font-mono text-[#94A3B8]">₹{gstAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Final Selling Price</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">₹{finalPrice.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Send Actions */}
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 space-y-4">
          <h2 className="text-sm font-bold text-white mb-4">Send Proposal</h2>
          
          <Button className="w-full h-10 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/20 text-xs font-bold flex justify-between group transition-colors">
            <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Send via WhatsApp</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <Button className="w-full h-10 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold flex justify-between group transition-colors">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Send via Email</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          
          <Button className="w-full h-10 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/20 text-xs font-bold flex justify-between group transition-colors">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> Copy Direct Link</span>
          </Button>
        </div>

      </div>
    </div>

    {/* New Quotation Modal */}
    {isNewModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-[#0B1220] border border-white/10 rounded-lg w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#020817]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#14B8A6]" />
              Start New Quotation
            </h2>
            <button onClick={() => setIsNewModalOpen(false)} className="text-[#94A3B8] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Select Customer / Lead</label>
              <select className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]">
                <option>David Smith (L-4092)</option>
                <option>Priya Sharma (L-4095)</option>
                <option>Acme Corp (L-4089)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Destination</label>
                <input type="text" placeholder="e.g. Maldives" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Budget (₹)</label>
                <input type="number" placeholder="e.g. 150000" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Days</label>
                <input type="number" placeholder="e.g. 5" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Members</label>
                <input type="number" placeholder="e.g. 2" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#38BDF8]" />
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-white/5 bg-[#020817] flex gap-3">
            <Button className="flex-1 font-bold bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/20 transition-colors">
              Generate Package
            </Button>
            <Button onClick={() => setIsNewModalOpen(false)} className="flex-1 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-colors">
              Create Quotation
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function ComponentSection({ title, total, items }: any) {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
      <div className="flex justify-between items-center bg-white/[0.02] p-3 border-b border-white/5">
        <h3 className="text-xs font-bold text-white">{title}</h3>
        <span className="text-xs font-mono font-bold text-[#14B8A6]">{total}</span>
      </div>
      <div className="p-2 space-y-1">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex justify-between items-center p-2 hover:bg-white/[0.02] rounded-md transition-colors group">
            <div className="flex items-center gap-3">
              <button className="text-white/20 hover:text-[#EF4444] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              <span className="text-xs text-white/90">{item.name}</span>
            </div>
            <span className="text-xs font-mono text-[#94A3B8] group-hover:text-white transition-colors">{item.cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
