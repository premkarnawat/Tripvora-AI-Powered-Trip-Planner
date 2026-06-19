"use client";

import { motion } from "framer-motion";
import { Plus, MoreHorizontal, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const kanbanColumns = [
  { id: "new", title: "New Inquiries", color: "border-blue-500/30", bg: "bg-blue-500/10" },
  { id: "contacted", title: "Contacted", color: "border-purple-500/30", bg: "bg-purple-500/10" },
  { id: "quoted", title: "Quoted", color: "border-orange-500/30", bg: "bg-orange-500/10" },
  { id: "won", title: "Won / Booked", color: "border-teal-500/30", bg: "bg-teal-500/10" }
];

const mockLeads = [
  { id: 1, name: "Sarah Jenkins", trip: "Bali Honeymoon", budget: "$4,500", col: "new" },
  { id: 2, name: "David Kim", trip: "Tokyo Adventure", budget: "$3,200", col: "new" },
  { id: 3, name: "Priya Sharma", trip: "Europe Tour", budget: "$8,000", col: "contacted" },
  { id: 4, name: "Mike Ross", trip: "Goa Retreat", budget: "$12,000", col: "quoted" },
  { id: 5, name: "Emma Stone", trip: "Maldives Luxury", budget: "$15,000", col: "won" },
];

export default function LeadsKanban() {
  return (
    <div className="w-full min-h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-sora">
            Lead Management
          </h1>
          <p className="text-white/60 mt-2">Track and convert your customer inquiries.</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Button className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10">
            <Plus className="w-4 h-4 mr-2" /> Add Manual Lead
          </Button>
        </motion.div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {kanbanColumns.map((col, idx) => (
            <motion.div 
              key={col.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className={`w-80 flex flex-col glass-card rounded-3xl overflow-hidden border-t-4 ${col.color}`}
            >
              <div className={`p-4 ${col.bg} border-b border-white/5 flex items-center justify-between`}>
                <h3 className="font-bold text-white font-sora">{col.title}</h3>
                <span className="w-6 h-6 rounded-full bg-black/40 text-white text-xs font-bold flex items-center justify-center">
                  {mockLeads.filter(l => l.col === col.id).length}
                </span>
              </div>
              
              <div className="p-4 flex-1 space-y-4 bg-white/[0.02]">
                {mockLeads.filter(l => l.col === col.id).map(lead => (
                  <div key={lead.id} className="bg-[#0A0F1D] border border-white/10 rounded-2xl p-4 cursor-grab hover:border-white/30 transition-colors shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                        <p className="text-xs text-white/50">{lead.trip}</p>
                      </div>
                      <button className="text-white/30 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-1 rounded-md">{lead.budget}</span>
                      <div className="flex gap-2">
                        <button className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                          <MessageSquare className="w-3.5 h-3.5 text-white/70" />
                        </button>
                        <button className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                          <Phone className="w-3.5 h-3.5 text-white/70" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
