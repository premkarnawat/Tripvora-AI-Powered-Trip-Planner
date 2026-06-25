"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, Users, Building2, Store, Compass, Send, ShieldAlert, 
  ArrowUpRight, ArrowDownRight, CreditCard, Clock, CheckCircle2, ChevronRight, Activity
} from "lucide-react";

export default function AdminDashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState("This Month");
  const [metricsData, setMetricsData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then(res => res.json())
      .then(data => {
        if (data.metrics) setMetricsData(data.metrics);
      })
      .catch(err => console.error("Error loading metrics:", err));
  }, []);

  // Summary Metrics
  const metrics = [
    { title: "Total Revenue", value: "₹48,92,400", change: "+14.2%", isPositive: true, subtext: "vs last month" },
    { title: "Monthly Revenue", value: "₹6,24,800", change: "+8.4%", isPositive: true, subtext: "vs last month" },
    { title: "Active Agencies", value: metricsData ? metricsData.activeAgencies.toString() : "0", change: "+12.1%", isPositive: true, subtext: "28 onboarding" },
    { title: "Marketplace Listings", value: "1,842", change: "+16.5%", isPositive: true, subtext: "54 new reviews" },
    { title: "Website Users", value: metricsData ? metricsData.websiteUsers.toString() : "0", change: "+22.4%", isPositive: true, subtext: "4,800 premium" },
    { title: "Trips Generated", value: metricsData ? metricsData.tripsGenerated.toString() : "0", change: "+18.9%", isPositive: true, subtext: "Gemini AI" },
    { title: "Qualified Leads", value: metricsData ? metricsData.qualifiedLeads.toString() : "0", change: "-2.4%", isPositive: false, subtext: "conversion 18%" },
    { title: "Pending Approvals", value: "16", change: "Alert", isPositive: false, subtext: "needs review" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">TripPilot Hub</h2>
          <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Welcome Back, Admin</h1>
          <p className="text-sm text-[#64748B] mt-1">Here is the latest snapshot of your travel ecosystem today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] bg-[#16A34A]/10 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>All systems nominal</span>
          </span>
        </div>
      </div>

      {/* Grid of 8 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => (
          <div 
            key={idx}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:translate-y-[-2px] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          >
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2">{m.title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold font-sora text-[#0F172A]">{m.value}</h3>
              <span className={`text-[10px] font-bold flex items-center ${
                m.isPositive ? "text-[#16A34A]" : "text-[#DC2626]"
              }`}>
                {m.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {m.change}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-1 font-medium">{m.subtext}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between h-[380px]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-sora text-[#0F172A]">Revenue & Transaction Flow</h3>
              <p className="text-xs text-[#64748B]">Monthly platform commission and subscriptions</p>
            </div>
            <select 
              value={revenuePeriod} 
              onChange={(e) => setRevenuePeriod(e.target.value)}
              className="bg-[#F1F5F9] border-none rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-bold focus:outline-none"
            >
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          {/* Premium SVG Line/Bar Chart */}
          <div className="flex-1 w-full flex items-end gap-2 pt-6 pb-2">
            {[45, 65, 50, 85, 70, 95, 110, 80, 105, 120, 90, 130].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <div className="w-full relative flex justify-center items-end h-full">
                  {/* Subtle bar background */}
                  <div 
                    className="w-full bg-[#0EA5A4]/10 group-hover:bg-[#0EA5A4]/25 rounded-t-md transition-all"
                    style={{ height: `${val}%` }}
                  />
                  {/* Floating tooltip */}
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-[#0F172A] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap">
                    ₹{(val * 5).toFixed(1)}k
                  </div>
                </div>
                <span className="text-[9px] font-bold text-[#94A3B8] uppercase">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Chart & Leads Funnel */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between h-[380px]">
          <div>
            <h3 className="text-base font-bold font-sora text-[#0F172A]">Leads Conversion Funnel</h3>
            <p className="text-xs text-[#64748B]">Platform inquiry to closed booking</p>
          </div>

          <div className="space-y-4 py-4">
            {[
              { stage: "Total Inquiries", count: "12,400", percent: 100, color: "bg-[#0EA5A4]" },
              { stage: "Qualified Leads", count: "5,840", percent: 47, color: "bg-[#14B8A6]" },
              { stage: "Quotations Sent", count: "2,840", percent: 22, color: "bg-teal-400" },
              { stage: "Bookings Closed", count: "1,240", percent: 10, color: "bg-[#16A34A]" },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#64748B]">{step.stage}</span>
                  <span className="text-[#0F172A] font-bold">{step.count} ({step.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${step.color}`} style={{ width: `${step.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activities */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
            <h3 className="text-sm font-bold font-sora text-[#0F172A]">Recent Activities</h3>
            <span className="text-[10px] text-[#0EA5A4] font-bold hover:underline cursor-pointer">View log</span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[260px] pr-1">
            {[
              { icon: Users, text: "New customer profile created: Anil Verma", time: "3m ago", bg: "bg-sky-50", textCol: "text-sky-600" },
              { icon: Building2, text: "Agency 'Mumbai Travels' verified successfully", time: "18m ago", bg: "bg-emerald-50", textCol: "text-emerald-600" },
              { icon: Send, text: "API Dispatch: meta template message sent", time: "45m ago", bg: "bg-[#0EA5A4]/10", textCol: "text-[#0EA5A4]" },
              { icon: ShieldAlert, text: "Razorpay payment failure: Order #2841", time: "1h ago", bg: "bg-red-50", textCol: "text-red-600" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start text-xs font-medium">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                  <item.icon className={`w-4 h-4 ${item.textCol}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[#0F172A] leading-tight font-semibold">{item.text}</p>
                  <span className="text-[10px] text-[#94A3B8] mt-1 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Registrations */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
            <h3 className="text-sm font-bold font-sora text-[#0F172A]">Latest Registrations</h3>
            <span className="text-[10px] text-[#0EA5A4] font-bold hover:underline cursor-pointer">See all</span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[260px] pr-1">
            {[
              { name: "Deccan Expeditions", location: "Pune, Maharashtra", status: "Premium Plan" },
              { name: "Himalayan Stays", location: "Manali, HP", status: "Growth Plan" },
              { name: "Kerala Heritage Tours", location: "Kochi, Kerala", status: "Base Plan" },
              { name: "Wanderlust India", location: "New Delhi", status: "Premium Plan" },
            ].map((reg, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-medium">
                <div>
                  <p className="text-[#0F172A] font-bold">{reg.name}</p>
                  <p className="text-[10px] text-[#94A3B8]">{reg.location}</p>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[#0F172A] text-[9px] font-bold rounded">
                  {reg.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
            <h3 className="text-sm font-bold font-sora text-[#0F172A]">Pending Verifications</h3>
            <span className="text-[10px] text-[#0EA5A4] font-bold hover:underline cursor-pointer">Review</span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[260px] pr-1">
            {[
              { name: "Taj Safaris India", gst: "27AAAAA1111A1Z1", date: "Today" },
              { name: "Goa Shore Trips", gst: "30BBBBB2222B2Z2", date: "Yesterday" },
              { name: "Jaipur Palace Guides", gst: "08CCCCC3333C3Z3", date: "2 days ago" },
              { name: "Indus Cruises", gst: "09DDDDD4444D4Z4", date: "3 days ago" },
            ].map((v, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-medium">
                <div>
                  <p className="text-[#0F172A] font-bold">{v.name}</p>
                  <p className="text-[10px] text-[#94A3B8] font-mono">GST: {v.gst}</p>
                </div>
                <button className="text-[10px] font-bold text-[#0EA5A4] hover:bg-[#0EA5A4]/10 px-2.5 py-1 rounded-md border border-[#0EA5A4]/20 transition-all">
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
