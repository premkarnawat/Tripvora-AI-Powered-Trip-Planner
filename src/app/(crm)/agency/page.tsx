"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, CalendarCheck, DollarSign, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgencyDashboard() {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-xl text-white/60 mb-1 font-medium">Agency Overview</h2>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-sora">
            Dashboard
          </h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-full px-6 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            + Create New Quotation
          </Button>
        </motion.div>
      </div>

      {/* KPI Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard title="Active Leads" value="24" icon={Users} trend="+12% this week" />
        <StatCard title="Total Revenue" value="$45,200" icon={DollarSign} trend="+8% this month" />
        <StatCard title="Successful Bookings" value="156" icon={CalendarCheck} trend="+24% this year" />
        <StatCard title="Conversion Rate" value="18.5%" icon={TrendingUp} trend="+2.4% vs last month" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Inquiries</h3>
            <button className="text-sm font-bold text-teal-400 hover:text-teal-300">View All Leads</button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Sarah Jenkins", trip: "Honeymoon in Bali", budget: "$4,500", status: "New" },
              { name: "Mike Ross", trip: "Corporate Retreat Goa", budget: "$12,000", status: "Quoted" },
              { name: "Priya Sharma", trip: "Family Europe Tour", budget: "$8,000", status: "Contacted" },
            ].map((lead, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold border border-teal-500/30">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{lead.name}</h4>
                    <p className="text-sm text-white/50">{lead.trip}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-white">{lead.budget}</p>
                  <p className="text-xs text-white/50">Budget</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    lead.status === "New" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : 
                    lead.status === "Quoted" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                    "bg-teal-500/20 text-teal-400 border-teal-500/30"
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions & Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-3xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">AI Insights</h3>
          <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl mb-4">
            <h4 className="font-bold text-teal-400 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Hot Destination
            </h4>
            <p className="text-sm text-white/70">Searches for "Bali" from your region have increased by 45% this week. Consider promoting Bali packages.</p>
          </div>
          
          <div className="space-y-3 mt-8">
            <h4 className="font-bold text-white mb-2">Quick Actions</h4>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/10 justify-between group">
              Manage Team <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white" />
            </Button>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/10 justify-between group">
              View Analytics Report <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
        <Icon className="w-12 h-12 text-teal-400" />
      </div>
      <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-3xl font-black text-white font-sora mb-2">{value}</h3>
      <p className="text-xs text-teal-400 font-medium">{trend}</p>
    </div>
  );
}
