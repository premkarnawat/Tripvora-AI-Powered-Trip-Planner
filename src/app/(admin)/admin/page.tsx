"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, Activity, TrendingUp, Building } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-xl text-white/60 mb-1 font-medium">TripPilot OS</h2>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-sora">
            Super Admin Dashboard
          </h1>
        </motion.div>
      </div>

      {/* KPI Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard title="Total Platform Users" value="12,450" icon={Users} trend="+840 this week" />
        <StatCard title="B2B Agencies" value="342" icon={Building} trend="+12 pending approval" />
        <StatCard title="MRR (SaaS + Affiliate)" value="$124,500" icon={DollarSign} trend="+15% vs last month" />
        <StatCard title="Trips Generated" value="84,200" icon={Activity} trend="99.9% uptime" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-3xl p-6 h-[400px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Revenue Growth</h3>
            <select className="bg-[#121824] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none">
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 pt-10">
            {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
              <div key={i} className="w-full relative group">
                <div 
                  className="w-full bg-purple-500/20 border border-purple-500/30 rounded-t-lg transition-all group-hover:bg-purple-500/40"
                  style={{ height: `${h}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-white text-black text-xs font-bold py-1 px-2 rounded transition-opacity pointer-events-none">
                  ${h * 1000}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-white/40 uppercase">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </motion.div>

        {/* Recent Platform Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-3xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Live Platform Activity</h3>
            <span className="flex items-center gap-2 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Live
            </span>
          </div>

          <div className="space-y-4">
            {[
              { text: "New user signed up from Paris, France", time: "2 mins ago", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
              { text: "Agency 'GlobeTrotters' paid $99/mo Pro tier", time: "15 mins ago", icon: DollarSign, color: "text-green-400", bg: "bg-green-400/10" },
              { text: "Gemini API successfully generated 5-day Tokyo trip", time: "42 mins ago", icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10" },
              { text: "New B2B Agency application requires approval", time: "1 hour ago", icon: Building, color: "text-orange-400", bg: "bg-orange-400/10" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg}`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{activity.text}</p>
                  <p className="text-xs text-white/40 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: any, trend: string }) {
  return (
    <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-purple-500/10">
      <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
        <Icon className="w-12 h-12 text-purple-400" />
      </div>
      <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-3xl font-black text-white font-sora mb-2">{value}</h3>
      <p className="text-xs text-purple-400 font-medium">{trend}</p>
    </div>
  );
}
