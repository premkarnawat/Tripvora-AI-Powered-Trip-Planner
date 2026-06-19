"use client";

import { motion } from "framer-motion";
import { Plus, Search, FileText, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuotationsTool() {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-sora">
            Quotation Builder
          </h1>
          <p className="text-white/60 mt-2">Create stunning AI-powered proposals for your clients.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            <Plus className="w-4 h-4 mr-2" /> New Proposal
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Builder Form Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card rounded-3xl p-6"
        >
          <div className="border-b border-white/10 pb-4 mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Create New Package</h3>
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Draft</span>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Client Name</label>
                <input type="text" placeholder="Select or type client name" className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 transition-colors outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Destination</label>
                <input type="text" placeholder="e.g., Paris, France" className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 transition-colors outline-none" />
              </div>
            </div>
            
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">AI Itinerary Generation</h4>
                  <p className="text-sm text-white/50">Let TripPilot AI build the day-by-day plan.</p>
                </div>
              </div>
              <Button className="bg-white/10 hover:bg-white/20 text-white font-bold border-none">
                Generate
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Package Cost</label>
                <input type="text" placeholder="$0" className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 transition-colors outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Agency Markup</label>
                <input type="text" placeholder="15%" className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 transition-colors outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Total Quote</label>
                <input type="text" placeholder="$0" readOnly className="w-full bg-teal-500/10 border border-teal-500/30 rounded-xl px-4 py-3 text-teal-400 font-bold focus:outline-none" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Col: Recent Quotes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search proposals..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          
          <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Recent Quotes</h3>
          
          <div className="space-y-4">
            {[
              { id: "QT-1042", client: "Sarah Jenkins", total: "$4,500", status: "Sent" },
              { id: "QT-1041", client: "David Kim", total: "$3,200", status: "Accepted" },
              { id: "QT-1040", client: "Priya Sharma", total: "$8,000", status: "Draft" },
            ].map((quote) => (
              <div key={quote.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-white/40">{quote.id}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    quote.status === "Sent" ? "bg-blue-500/20 text-blue-400" :
                    quote.status === "Accepted" ? "bg-teal-500/20 text-teal-400" :
                    "bg-white/10 text-white/60"
                  }`}>
                    {quote.status}
                  </span>
                </div>
                <h4 className="font-bold text-white">{quote.client}</h4>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-white">{quote.total}</span>
                  <div className="flex gap-2">
                    <button className="text-white/40 hover:text-white transition-colors"><FileText className="w-4 h-4" /></button>
                    <button className="text-white/40 hover:text-white transition-colors"><Send className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
