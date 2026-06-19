"use client";

import { DollarSign, TrendingUp, TrendingDown, CreditCard, ArrowUpRight, ArrowDownRight, FileText, Download, Activity, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RevenuePage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Revenue & Profit
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Financial overview, profit margins, and payment tracking.</p>
        </div>
        <div className="flex gap-3 items-center">
          <select className="bg-[#0B1220] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#38BDF8]">
            <option>This Month (Oct 2026)</option>
            <option>Last Month (Sep 2026)</option>
            <option>This Quarter (Q4 2026)</option>
            <option>This Year (2026)</option>
          </select>
          <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Download className="w-3.5 h-3.5 mr-1" /> Export Report
          </Button>
        </div>
      </div>

      {/* Top Metrics - Profit Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Gross Revenue" value="₹42,50,000" trend="+12.5%" isPositive icon={DollarSign} />
        <MetricCard title="Total Expenses" value="₹34,00,000" trend="+4.2%" isPositive={false} icon={CreditCard} />
        <MetricCard title="Net Profit" value="₹8,50,000" trend="+22.4%" isPositive icon={TrendingUp} highlight />
        <MetricCard title="Net Margin" value="20.0%" trend="+1.5%" isPositive icon={PieChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Charts & Visuals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart Placeholder */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white">Revenue vs Profit (YTD)</h3>
            </div>
            <div className="h-64 w-full relative">
              {/* Mock SVG Chart */}
              <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="profGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Revenue Line */}
                <path d="M0,35 Q10,32 20,28 T40,20 T60,25 T80,15 T100,10 L100,40 L0,40 Z" fill="url(#revGrad)" />
                <path d="M0,35 Q10,32 20,28 T40,20 T60,25 T80,15 T100,10" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
                {/* Profit Line */}
                <path d="M0,38 Q10,36 20,34 T40,30 T60,32 T80,25 T100,20 L100,40 L0,40 Z" fill="url(#profGrad)" />
                <path d="M0,38 Q10,36 20,34 T40,30 T60,32 T80,25 T100,20" fill="none" stroke="#14B8A6" strokeWidth="1" className="drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]" />
              </svg>
              <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-[#94A3B8] mt-2">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
              </div>
            </div>
            <div className="flex gap-4 justify-center mt-6">
              <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]"><span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Gross Revenue</span>
              <span className="flex items-center gap-1.5 text-xs text-white font-bold"><span className="w-2 h-2 rounded-full bg-[#14B8A6] shadow-[0_0_8px_rgba(20,184,166,0.8)]" /> Net Profit</span>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0B1220] border border-white/5 rounded-md p-4">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Package Sales</p>
              <p className="text-lg font-bold text-white">₹32,00,000</p>
            </div>
            <div className="bg-[#0B1220] border border-white/5 rounded-md p-4">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Flight Commissions</p>
              <p className="text-lg font-bold text-white">₹6,20,000</p>
            </div>
            <div className="bg-[#0B1220] border border-white/5 rounded-md p-4">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Visa & Insurance</p>
              <p className="text-lg font-bold text-white">₹4,30,000</p>
            </div>
          </div>
        </div>

        {/* Right Col: Payments Tracker */}
        <div className="space-y-6">
          
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-6">Payment Tracker</h3>
            
            <div className="space-y-4">
              <PaymentProgress label="Advance Collected" amount="₹28,50,000" percent={67} color="bg-[#10B981]" />
              <PaymentProgress label="Pending Payments" amount="₹12,40,000" percent={29} color="bg-[#F59E0B]" />
              <PaymentProgress label="Refunded/Cancelled" amount="₹1,60,000" percent={4} color="bg-[#EF4444]" />
            </div>

            <Button className="w-full h-9 mt-6 text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors">
              Send Automated Reminders
            </Button>
          </div>

          {/* Recent Invoices */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white">Recent Invoices</h3>
              <button className="text-xs text-[#14B8A6] font-bold hover:text-white">View All</button>
            </div>
            
            <div className="space-y-3">
              {[
                { id: "INV-142", client: "Acme Corp", amount: "₹45,00,000", status: "Paid" },
                { id: "INV-141", client: "David Smith", amount: "₹8,50,000", status: "Partial" },
                { id: "INV-140", client: "Priya Sharma", amount: "₹12,00,000", status: "Unpaid" },
              ].map((inv, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-[#020817] border border-white/5 rounded hover:border-white/10 transition-colors group cursor-pointer">
                  <div>
                    <p className="text-xs font-bold text-white">{inv.client}</p>
                    <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">{inv.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{inv.amount}</p>
                    <p className={`text-[10px] font-bold mt-0.5 ${inv.status === 'Paid' ? 'text-[#10B981]' : inv.status === 'Partial' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                      {inv.status}
                    </p>
                  </div>
                </div>
              ))}
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
        <h3 className={`text-2xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-white'}`}>{value}</h3>
        <span className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
    </div>
  );
}

function PaymentProgress({ label, amount, percent, color }: any) {
  return (
    <div>
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-xs font-bold text-[#94A3B8]">{label}</span>
        <span className="text-xs font-bold text-white">{amount}</span>
      </div>
      <div className="w-full h-1.5 bg-[#020817] rounded-full overflow-hidden border border-white/5">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
