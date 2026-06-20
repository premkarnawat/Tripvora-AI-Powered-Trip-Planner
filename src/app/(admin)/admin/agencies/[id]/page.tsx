"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, ArrowLeft, Mail, Phone, MessageSquare, CreditCard, 
  TrendingUp, FileText, CheckCircle2, AlertCircle, Users, Briefcase, 
  DollarSign, Clock, ShieldCheck, ExternalLink, Calendar
} from "lucide-react";

export default function AgencyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const [activeTab, setActiveTab] = useState("Overview");

  // Mock agency data based on params or fallback
  const agency = {
    name: "Wanderlust Holidays",
    owner: "Karan Johar",
    gst: "27AAAAA1111A1Z1",
    email: "contact@wanderlust.in",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    subscription: "Premium Tier (₹2,999/mo)",
    status: "Active",
    revenue: "₹2,45,600",
    bookings: 84,
    renewalDate: "15 November 2026",
    joinedDate: "12 May 2025"
  };

  const tabs = ["Overview", "Leads", "Customers", "Quotations", "Vendors", "Payments", "Activity Logs"];

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link href="/admin/agencies" className="flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#0EA5A4] transition-colors w-max">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Partners</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0EA5A4]/10 text-[#0EA5A4] flex items-center justify-center font-bold text-xl border border-[#0EA5A4]/15 shrink-0">
            WH
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-sora text-[#0F172A]">{agency.name}</h1>
              <span className="px-2.5 py-0.5 bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 text-[10px] font-bold rounded-full">
                {agency.status}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">Owner: {agency.owner} • Joined {agency.joinedDate}</p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-1.5 bg-[#DC2626]/10 hover:bg-[#DC2626]/20 border border-[#DC2626]/20 text-[#DC2626] rounded-full text-xs font-semibold transition-all">
            Suspend Account
          </button>
          <button className="px-3.5 py-1.5 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm transition-all">
            Verify GST Document
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-[#E5E7EB] flex gap-4 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
              activeTab === tab 
                ? "border-[#0EA5A4] text-[#0EA5A4] font-bold" 
                : "border-transparent text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            
            {/* Left: Agency details list */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 lg:col-span-2 space-y-6">
              <h3 className="text-base font-bold font-sora text-[#0F172A] border-b border-[#E5E7EB] pb-3">Agency Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Company Name" value={agency.name} />
                <InfoItem label="Owner / MD" value={agency.owner} />
                <InfoItem label="GST Number" value={agency.gst} />
                <InfoItem label="Subscription Plan" value={agency.subscription} />
                <InfoItem label="Primary Email" value={agency.email} />
                <InfoItem label="Direct Phone" value={agency.phone} />
                <InfoItem label="WhatsApp Number" value={agency.whatsapp} />
                <InfoItem label="Next Renewal Date" value={agency.renewalDate} />
              </div>
            </div>

            {/* Right: Revenue metrics */}
            <div className="space-y-6">
              
              {/* Financial Box */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Gross Revenue Generated</span>
                <h3 className="text-3xl font-bold font-sora text-[#0F172A] mt-1">{agency.revenue}</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-semibold mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>₹38k platform commission earned</span>
                </div>
              </div>

              {/* Booking counts */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Total Bookings Closed</span>
                <h3 className="text-3xl font-bold font-sora text-[#0F172A] mt-1">{agency.bookings}</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mt-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Success rate: 94.2%</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === "Leads" && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold font-sora text-[#0F172A]">Assigned Leads</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                    <th className="py-3 px-4 font-normal">Lead ID</th>
                    <th className="py-3 px-4 font-normal">Destination</th>
                    <th className="py-3 px-4 font-normal">Budget</th>
                    <th className="py-3 px-4 font-normal">Priority</th>
                    <th className="py-3 px-4 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50 text-xs font-semibold text-[#0F172A]">
                  <tr>
                    <td className="py-3 px-4 text-[#0EA5A4]">LD-2840</td>
                    <td className="py-3 px-4">Kashmir Escape</td>
                    <td className="py-3 px-4">₹1,45,000</td>
                    <td className="py-3 px-4 text-[#16A34A]">High</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-sky-100 text-sky-600 rounded">Proposal Sent</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-[#0EA5A4]">LD-2839</td>
                    <td className="py-3 px-4">Goa Honeymoon</td>
                    <td className="py-3 px-4">₹85,000</td>
                    <td className="py-3 px-4 text-[#64748B]">Medium</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-[#16A34A]/10 text-[#16A34A] rounded">Booked</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Customers" && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold font-sora text-[#0F172A]">Customer Database</h3>
            <p className="text-xs text-[#64748B]">Travellers who have completed onboarding or travel journeys with this agency.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Vikramaditya Rao", "Preeti Sharma", "Amit Patel"].map((cName, idx) => (
                <div key={idx} className="border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-[#0EA5A4]">
                    {cName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">{cName}</p>
                    <p className="text-[10px] text-[#64748B]">{cName.toLowerCase().replace(" ", "")}@gmail.com</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Quotations" && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold font-sora text-[#0F172A]">Quotations Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                    <th className="py-3 px-4 font-normal">Quote #</th>
                    <th className="py-3 px-4 font-normal">Customer</th>
                    <th className="py-3 px-4 font-normal">Total Cost</th>
                    <th className="py-3 px-4 font-normal">Selling Price</th>
                    <th className="py-3 px-4 font-normal">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50 text-xs font-semibold text-[#0F172A]">
                  <tr>
                    <td className="py-3 px-4 text-[#0EA5A4]">QT-2026-004</td>
                    <td className="py-3 px-4">Vikramaditya Rao</td>
                    <td className="py-3 px-4">₹1,10,000</td>
                    <td className="py-3 px-4">₹1,32,000</td>
                    <td className="py-3 px-4 text-[#16A34A]">20% (₹22,000)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Vendors" && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold font-sora text-[#0F172A]">Whitelisted Vendors</h3>
            <p className="text-xs text-[#64748B]">B2B flight, hotel, and transport providers linked to this agency.</p>
            <div className="space-y-3">
              {[
                { name: "Deccan Cabs Pune", type: "Transport Provider", location: "Pune, MH" },
                { name: "Jaipur Heritage Stays", type: "Hotel Provider", location: "Jaipur, RJ" },
              ].map((vend, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border border-[#E5E7EB] rounded-xl text-xs font-semibold">
                  <div>
                    <p className="text-[#0F172A] font-bold">{vend.name}</p>
                    <p className="text-[10px] text-[#64748B]">{vend.type}</p>
                  </div>
                  <span className="text-[10px] text-[#64748B]">{vend.location}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Payments" && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold font-sora text-[#0F172A]">Razorpay Split Payments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                    <th className="py-3 px-4 font-normal">Transaction ID</th>
                    <th className="py-3 px-4 font-normal">Amount</th>
                    <th className="py-3 px-4 font-normal">Platform Fee</th>
                    <th className="py-3 px-4 font-normal">Method</th>
                    <th className="py-3 px-4 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50 text-xs font-semibold text-[#0F172A]">
                  <tr>
                    <td className="py-3 px-4 text-[#0EA5A4]">pay_RazorPay92841</td>
                    <td className="py-3 px-4">₹1,32,000</td>
                    <td className="py-3 px-4">₹19,800 (15%)</td>
                    <td className="py-3 px-4 font-mono">UPI split</td>
                    <td className="py-3 px-4 text-[#16A34A]">Transferred</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Activity Logs" && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold font-sora text-[#0F172A]">Agency Audit Log</h3>
            <div className="space-y-4">
              {[
                { time: "Today 11:32 AM", text: "Karan Johar created new Quotation QT-2026-004", actor: "Owner" },
                { time: "Yesterday 04:15 PM", text: "Broadcasting meta notification templates dispatched", actor: "System" },
                { time: "18 Jun 2026", text: "GST registration document verified successfully by Admin Prem", actor: "Platform Admin" },
              ].map((log, idx) => (
                <div key={idx} className="flex gap-4 text-xs font-medium border-l-2 border-[#E5E7EB] pl-4 relative">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0EA5A4] border-2 border-white" />
                  <div>
                    <span className="text-[10px] text-[#94A3B8] font-bold block">{log.time}</span>
                    <p className="text-[#0F172A] mt-0.5">{log.text}</p>
                    <span className="text-[9px] text-[#64748B]">Actor: {log.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{label}</span>
      <p className="text-sm font-semibold text-[#0F172A]">{value}</p>
    </div>
  );
}
