"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, TrendingUp, FileText, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AgencyDashboard() {
  const currentDateTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' EST';
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* 1. Welcome Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
            <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest">Live Updates</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-sora font-black text-white mb-3">
            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#38BDF8]">Elite Travels</span>
          </h1>
          <p className="text-[#94A3B8] text-base max-w-xl leading-relaxed">
            Your agency is performing at peak efficiency. Here's what needs your attention today.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-right"
        >
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Current Time</p>
          <p className="text-xl font-bold text-white font-sora">{currentDateTime}</p>
        </motion.div>
      </div>

      {/* 2. KPI Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <KpiCard title="Total Revenue" value="$412,850" trend="+12.4%" isPositive={true} icon={DollarSign} />
        <KpiCard title="Active Leads" value="1,248" trend="+5.2%" isPositive={true} icon={Users} />
        <KpiCard title="Conversion Rate" value="18.4%" trend="+22.1%" isPositive={true} icon={TrendingUp} />
        <KpiCard title="Pending Quotes" value="42" trend="-2.4%" isPositive={false} icon={FileText} />
      </motion.div>

      {/* 3. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Growth Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-[#0B1220] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-white font-sora">Revenue Growth</h3>
              <p className="text-[#94A3B8] text-sm">Visualizing performance over the last 30 days</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white/[0.03] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white rounded-md text-xs font-bold transition-colors">7D</button>
              <button className="px-3 py-1 bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30 rounded-md text-xs font-bold transition-colors">30D</button>
              <button className="px-3 py-1 bg-white/[0.03] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white rounded-md text-xs font-bold transition-colors">90D</button>
            </div>
          </div>
          
          {/* Mock Chart Visualization */}
          <div className="h-48 w-full relative z-10 mt-10">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,35 Q10,30 20,32 T40,25 T60,20 T80,25 T100,5 L100,40 L0,40 Z" fill="url(#gradient)" className="opacity-80" />
              <path d="M0,35 Q10,30 20,32 T40,25 T60,20 T80,25 T100,5" fill="none" stroke="#14B8A6" strokeWidth="0.8" className="drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-[#94A3B8] mt-2">
              <span>Aug 01</span><span>Aug 08</span><span>Aug 15</span><span>Aug 22</span><span>Aug 29</span>
            </div>
          </div>
        </motion.div>

        {/* Lead Funnel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#0B1220] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col"
        >
          <h3 className="text-lg font-bold text-white font-sora mb-6">Lead Funnel</h3>
          
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <FunnelBar label="Prospecting" value={420} max={420} color="bg-white/20" />
            <FunnelBar label="Interested" value={215} max={420} color="bg-[#38BDF8]" />
            <FunnelBar label="Qualified" value={98} max={420} color="bg-[#38BDF8]/60" />
            <FunnelBar label="Closed Won" value={42} max={420} color="bg-[#10B981]" />
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-[#94A3B8] font-bold mb-1">Avg. Deal Velocity:</p>
            <p className="text-[#14B8A6] font-black font-sora text-xl">12.4 Days</p>
          </div>
        </motion.div>
      </div>

      {/* 4. Sales Pipeline Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-[#0B1220] border border-white/5 rounded-2xl p-6 shadow-xl overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white font-sora">Sales Pipeline</h3>
          <button className="text-[#14B8A6] text-sm font-bold flex items-center gap-1 hover:text-[#38BDF8] transition-colors">
            View all deals <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                <th className="py-4 px-4 font-bold w-1/4">Client / Deal</th>
                <th className="py-4 px-4 font-bold">Estimated Value</th>
                <th className="py-4 px-4 font-bold">Stage</th>
                <th className="py-4 px-4 font-bold">Lead Score</th>
                <th className="py-4 px-4 font-bold text-right">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {[
                { client: "Acme Corp Retreat", dest: "Maldives", value: "$45,000", stage: "Qualified", score: 94, owner: "JD" },
                { client: "Smith Family Vacay", dest: "Tokyo, JP", value: "$12,400", stage: "Booked", score: 98, owner: "AS" },
                { client: "Jenkins Honeymoon", dest: "Bali, IN", value: "$8,200", stage: "Proposal Sent", score: 85, owner: "JD" },
                { client: "Delta Team Offsite", dest: "Goa, IN", value: "$22,000", stage: "Contacted", score: 64, owner: "MK" },
                { client: "Rodriguez Anniversary", dest: "Paris, FR", value: "$15,500", stage: "New", score: 42, owner: "Unassigned" },
              ].map((deal, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="py-4 px-4">
                    <h4 className="font-bold text-white text-sm group-hover:text-[#38BDF8] transition-colors">{deal.client}</h4>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{deal.dest}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-white text-sm">{deal.value}</span>
                  </td>
                  <td className="py-4 px-4">
                    <StageChip stage={deal.stage} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-[#0F172A] rounded-full overflow-hidden max-w-[60px]">
                        <div 
                          className={`h-full rounded-full ${deal.score > 80 ? 'bg-[#10B981]' : deal.score > 60 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} 
                          style={{ width: `${deal.score}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-white/70">{deal.score}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {deal.owner === "Unassigned" ? (
                      <span className="text-xs text-[#94A3B8] font-bold border border-white/10 px-2 py-1 rounded-md">Assign</span>
                    ) : (
                      <div className="inline-flex w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F172A] to-[#14B8A6] items-center justify-center text-xs font-bold text-white border border-white/10">
                        {deal.owner}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}

function KpiCard({ title, value, trend, isPositive, icon: Icon }: any) {
  return (
    <div className="bg-[#0B1220] border border-white/[0.08] hover:border-[#14B8A6]/40 rounded-2xl p-5 flex flex-col justify-between transition-all group relative overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.1)]">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#14B8A6]/10 rounded-full blur-[30px] group-hover:bg-[#14B8A6]/20 transition-all" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center border border-white/5 group-hover:bg-[#14B8A6]/10 group-hover:border-[#14B8A6]/30 transition-all">
          <Icon className="w-5 h-5 text-[#94A3B8] group-hover:text-[#14B8A6] transition-colors" />
        </div>
        <div className="flex items-center gap-1">
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" /> : <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />}
          <span className={`text-xs font-bold ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{trend}</span>
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white font-sora">{value}</h3>
      </div>
    </div>
  );
}

function FunnelBar({ label, value, max, color }: any) {
  const percentage = (value / max) * 100;
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="w-24 text-xs font-bold text-[#94A3B8]">{label}</span>
      <div className="flex-1 h-2 bg-[#0F172A] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="w-8 text-right text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function StageChip({ stage }: { stage: string }) {
  const styles: Record<string, string> = {
    "New": "bg-white/10 text-white border-white/20",
    "Contacted": "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20",
    "Qualified": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Proposal Sent": "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    "Booked": "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
    "Lost": "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  };
  
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-widest whitespace-nowrap ${styles[stage] || styles["New"]}`}>
      {stage}
    </span>
  );
}
