"use client";

import { BarChart3, TrendingUp, Users, Target, Calendar, ArrowUpRight, ArrowDownRight, Activity, Globe, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Analytics & Reports
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Deep dive into your agency's performance metrics and conversion funnels.</p>
        </div>
        <div className="flex gap-3 items-center">
          <select className="bg-[#0B1220] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Year to Date</option>
          </select>
          <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Download className="w-3.5 h-3.5 mr-1" /> Export Data
          </Button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Leads" value="1,248" trend="+14%" isPositive icon={Users} />
        <MetricCard title="Conversion Rate" value="18.5%" trend="+2.4%" isPositive icon={Target} />
        <MetricCard title="Avg Deal Size" value="₹4,25,000" trend="-1.2%" isPositive={false} icon={Activity} />
        <MetricCard title="Sales Cycle" value="12 Days" trend="-2 Days" isPositive icon={Calendar} highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Funnel & Sources */}
        <div className="space-y-6">
          
          {/* Sales Funnel */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-6">Lead Conversion Funnel</h3>
            <div className="space-y-3">
              <FunnelStep label="Total Inquiries" value={1248} max={1248} color="bg-[#38BDF8]" />
              <FunnelStep label="Qualified Leads" value={850} max={1248} color="bg-[#8B5CF6]" />
              <FunnelStep label="Proposals Sent" value={420} max={1248} color="bg-[#F59E0B]" />
              <FunnelStep label="Closed Won" value={230} max={1248} color="bg-[#10B981]" />
            </div>
          </div>

          {/* Lead Sources */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-6">Top Lead Sources</h3>
            <div className="space-y-4">
              <SourceRow source="TripPilot Marketplace" percent={45} color="bg-[#14B8A6]" />
              <SourceRow source="Organic Website" percent={25} color="bg-[#38BDF8]" />
              <SourceRow source="Instagram Ads" percent={20} color="bg-purple-500" />
              <SourceRow source="Referrals" percent={10} color="bg-[#F59E0B]" />
            </div>
          </div>

        </div>

        {/* Right Col: Charts & Destinations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Chart Placeholder */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white">Conversion Velocity</h3>
            </div>
            <div className="h-72 w-full flex items-end gap-2 px-4 pb-4 border-b border-white/5 relative">
              {/* Bar Chart Mock */}
              {[40, 65, 45, 80, 55, 90, 75, 100, 85, 110, 95, 120].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                  <div 
                    className="w-full bg-gradient-to-t from-[#14B8A6]/20 to-[#14B8A6] rounded-t-sm group-hover:opacity-80 transition-opacity" 
                    style={{ height: `${h}%` }} 
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#020817] border border-white/10 text-xs font-bold text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {h} Leads
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-[#94A3B8] mt-3 px-4">
              <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5</span><span>Week 6</span>
            </div>
          </div>

          {/* Top Destinations */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-4">Top Performing Destinations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DestinationCard dest="Bali, Indonesia" bookings={42} rev="₹45L" trend="+12%" />
              <DestinationCard dest="Maldives" bookings={38} rev="₹85L" trend="+5%" />
              <DestinationCard dest="Dubai, UAE" bookings={25} rev="₹32L" trend="-2%" />
              <DestinationCard dest="Europe" bookings={18} rev="₹95L" trend="+8%" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, isPositive, icon: Icon, highlight }: any) {
  return (
    <div className={`bg-[#0B1220] border ${highlight ? 'border-[#14B8A6]/30 shadow-[0_0_20px_rgba(20,184,166,0.1)]' : 'border-white/5'} rounded-md p-4 hover:bg-white/[0.02] transition-all relative overflow-hidden group`}>
      {highlight && <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#14B8A6]/10 rounded-full blur-[20px]" />}
      <div className="flex justify-between items-start mb-3 relative z-10">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${highlight ? 'text-[#14B8A6]' : 'text-[#94A3B8]'}`}>{title}</p>
        <div className={`w-6 h-6 rounded flex items-center justify-center ${highlight ? 'bg-[#14B8A6]/20' : 'bg-white/5'}`}>
          <Icon className={`w-3.5 h-3.5 ${highlight ? 'text-[#14B8A6]' : 'text-[#94A3B8]'}`} />
        </div>
      </div>
      <div className="flex items-end justify-between relative z-10">
        <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
        <span className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
    </div>
  );
}

function FunnelStep({ label, value, max, color }: any) {
  const percent = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-xs font-bold text-white">{label}</span>
        <span className="text-xs font-bold text-[#94A3B8]">{value}</span>
      </div>
      <div className="w-full h-4 bg-[#020817] rounded overflow-hidden border border-white/5">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function SourceRow({ source, percent, color }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 text-right text-xs font-bold text-white">{percent}%</div>
      <div className="flex-1 h-2 bg-[#020817] rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="w-32 text-[10px] text-[#94A3B8] truncate">{source}</div>
    </div>
  );
}

function DestinationCard({ dest, bookings, rev, trend }: any) {
  const isPos = trend.includes('+');
  return (
    <div className="bg-[#020817] border border-white/5 rounded-md p-3 hover:border-white/10 transition-colors">
      <h4 className="text-xs font-bold text-white mb-2 truncate" title={dest}>{dest}</h4>
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] text-[#94A3B8]">Bookings</span>
        <span className="text-xs font-bold text-white">{bookings}</span>
      </div>
      <div className="flex justify-between items-end">
        <span className="text-[10px] text-[#94A3B8]">Revenue</span>
        <span className="text-xs font-bold text-[#14B8A6]">{rev}</span>
      </div>
    </div>
  );
}
