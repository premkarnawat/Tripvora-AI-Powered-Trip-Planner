"use client";

import { useState } from "react";
import { HelpCircle, Plus, Search, Filter, Edit2, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["Account", "Payments", "Bookings", "Agencies", "Subscriptions", "Marketplace", "Trip Planning"];

const initialFaqs = [
  { id: 1, question: "How do I add a new vendor?", answer: "Go to the Operations > Vendor Library in your agency dashboard and click the '+ Add Vendor' button.", category: "Agencies" },
  { id: 2, question: "What happens if I exceed my API limit?", answer: "Your services will continue to run, but you will be billed for overages at the end of the billing cycle.", category: "Subscriptions" },
  { id: 3, question: "Can a traveler change their itinerary?", answer: "Yes, travelers can request changes through the live chat feature in their itinerary view.", category: "Trip Planning" },
  { id: 4, question: "How do payouts work for marketplace bookings?", answer: "Payouts are processed automatically every Friday to your registered bank account via Razorpay Route.", category: "Payments" },
];

export default function HelpCenterPage() {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            FAQ Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage all frequently asked questions in the public and agency help centers.</p>
        </div>
        <Button className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all">
          <Plus className="w-4 h-4 mr-2" /> Add New FAQ
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Categories Sidebar */}
        <div className="w-full lg:w-56 shrink-0 space-y-2">
          <h3 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-2 mb-2">Categories</h3>
          <button 
            onClick={() => setActiveCategory("All")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === "All" ? "bg-white/10 text-white font-bold" : "text-[#94A3B8] hover:bg-white/5 hover:text-white"}`}
          >
            All FAQs
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat ? "bg-white/10 text-white font-bold" : "text-[#94A3B8] hover:bg-white/5 hover:text-white"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#0B1220] border border-white/5 rounded-xl overflow-hidden flex flex-col">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#020817]/50 shrink-0">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input 
                type="text" 
                placeholder={`Search ${activeCategory} FAQs...`} 
                className="w-full bg-[#020817] border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
              />
            </div>
            <Button className="h-9 font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10 transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>

          {/* FAQ List */}
          <div className="p-6 space-y-3 overflow-y-auto">
            {faqs.filter(f => activeCategory === "All" || f.category === activeCategory).map((faq, index) => (
              <div key={faq.id} className="flex gap-3 items-start group">
                {/* Drag Handle */}
                <div className="mt-4 text-[#94A3B8] opacity-0 group-hover:opacity-100 cursor-grab transition-opacity shrink-0">
                  <GripVertical className="w-4 h-4" />
                </div>
                
                {/* FAQ Item */}
                <div className="flex-1 bg-[#020817] border border-white/10 rounded-lg p-4 transition-colors hover:border-white/20">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{faq.category}</span>
                        <h4 className="text-sm font-bold text-white">{faq.question}</h4>
                      </div>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{faq.answer}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-md flex items-center justify-center bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-md flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Reorder Arrows (Alternative to Drag for Accessibility) */}
                <div className="mt-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-[#94A3B8] hover:text-white"><ChevronUp className="w-4 h-4" /></button>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-[#94A3B8] hover:text-white"><ChevronDown className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
