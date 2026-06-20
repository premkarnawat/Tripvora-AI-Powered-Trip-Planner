"use client";

import { useState } from "react";
import { 
  Users, Search, Filter, ShieldCheck, Mail, Phone, 
  Plus, Calendar, CreditCard, ChevronRight, Eye, ArrowLeft
} from "lucide-react";

// Mock platform travelers data
const usersData = [
  {
    id: "usr-01",
    name: "Aditya Roy",
    email: "adityaroy@gmail.com",
    phone: "+91 99887 76655",
    type: "Premium Traveler",
    trips: 18,
    bookings: 4,
    status: "Active",
    joinedDate: "10 Jan 2026",
    premiumPlan: "TripPilot Pro Plus",
    totalPaid: "₹24,500"
  },
  {
    id: "usr-02",
    name: "Priya Sen",
    email: "priyasen@hotmail.com",
    phone: "+91 98888 77777",
    type: "Regular Traveler",
    trips: 6,
    bookings: 1,
    status: "Active",
    joinedDate: "15 Mar 2026",
    premiumPlan: "Free Tier",
    totalPaid: "₹0"
  },
  {
    id: "usr-03",
    name: "Rahul Verma",
    email: "rverma@gmail.com",
    phone: "+91 97777 66666",
    type: "Premium Traveler",
    trips: 24,
    bookings: 6,
    status: "Inactive",
    joinedDate: "05 May 2025",
    premiumPlan: "TripPilot Pro",
    totalPaid: "₹18,000"
  }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(usersData);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTab, setUserTab] = useState("All");

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = userTab === "All" || 
                       (userTab === "Premium" && u.type === "Premium Traveler") ||
                       (userTab === "Inactive" && u.status === "Inactive");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8">
      
      {!selectedUser ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">User Directory</h2>
              <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Registered Travelers</h1>
              <p className="text-sm text-[#64748B] mt-1">Manage and audit travel customer directories, premium support options.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Plus className="w-4 h-4" />
                <span>Invite Traveler</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <StatCard title="Total Users" value="34,250" />
            <StatCard title="Premium Users" value="4,800" />
            <StatCard title="Active Users" value="12,450" />
            <StatCard title="Trips Generated" value="84,900" />
            <StatCard title="Bookings Closed" value="4,820" />
          </div>

          {/* Filters & Search */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
              {["All", "Premium", "Inactive"].map(t => (
                <button
                  key={t}
                  onClick={() => setUserTab(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    userTab === t 
                      ? "bg-[#0EA5A4]/15 text-[#0EA5A4]" 
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {t === "All" ? "All Users" : t === "Premium" ? "Premium Members" : "Inactive Users"}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input 
                type="text" 
                placeholder="Search travelers by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all"
              />
            </div>
          </div>

          {/* Table list */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-slate-50 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                    <th className="p-4 font-normal">Traveler Name</th>
                    <th className="p-4 font-normal">Contact info</th>
                    <th className="p-4 font-normal">Member Tier</th>
                    <th className="p-4 font-normal">Trips</th>
                    <th className="p-4 font-normal">Bookings</th>
                    <th className="p-4 font-normal">Status</th>
                    <th className="p-4 font-normal text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50 text-xs font-semibold text-[#0F172A]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#0EA5A4]/10 text-[#0EA5A4] flex items-center justify-center font-bold">
                            {u.name[0]}
                          </div>
                          <span className="font-bold text-[#0F172A]">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[#0F172A]">{u.email}</span>
                          <span className="text-[10px] text-[#64748B]">{u.phone}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold tracking-wider ${
                          u.type === "Premium Traveler" 
                            ? "bg-amber-100/60 border-amber-300 text-amber-700" 
                            : "bg-slate-100 border-slate-200 text-[#64748B]"
                        }`}>
                          {u.type === "Premium Traveler" ? "PRO MEMBER" : "FREE MEMBER"}
                        </span>
                      </td>
                      <td className="p-4 text-center">{u.trips}</td>
                      <td className="p-4 text-center">{u.bookings}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          u.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 bg-[#0EA5A4]/10 hover:bg-[#0EA5A4]/20 border border-[#0EA5A4]/25 text-[#0EA5A4] rounded font-bold text-[10px] transition-all"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* User details subpage */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <button 
              onClick={() => setSelectedUser(null)}
              className="flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#0EA5A4] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Travelers</span>
            </button>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0EA5A4]/10 text-[#0EA5A4] flex items-center justify-center font-bold text-lg">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-sora text-[#0F172A]">{selectedUser.name}</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">Joined: {selectedUser.joinedDate} • Member ID: {selectedUser.id}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0F172A] rounded-full text-xs font-semibold transition-all">
                  Edit Details
                </button>
                <button className="px-3.5 py-1.5 bg-[#DC2626]/10 hover:bg-[#DC2626]/20 border border-[#DC2626]/20 text-[#DC2626] rounded-full text-xs font-semibold transition-all">
                  Deactivate User
                </button>
              </div>
            </div>

            {/* Profile Grid Sub-tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-3">User Profile</h3>
                  <div className="space-y-3.5 text-xs font-semibold text-[#64748B]">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span>Email</span>
                      <span className="text-[#0F172A]">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span>Phone</span>
                      <span className="text-[#0F172A]">{selectedUser.phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span>Subscription Tier</span>
                      <span className="text-amber-600">{selectedUser.premiumPlan}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span>Total Platform Paid</span>
                      <span className="text-[#16A34A]">{selectedUser.totalPaid}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Trips Log */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Trips History</h3>
                <div className="space-y-3">
                  {[
                    { title: "Kashmir Escapade Itinerary", dates: "14 Jun 2026 - 19 Jun 2026", status: "Completed" },
                    { title: "Goa Weekend Getaway", dates: "20 Jul 2026 - 24 Jul 2026", status: "Active" }
                  ].map((trip, idx) => (
                    <div key={idx} className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-xs font-semibold flex justify-between items-center">
                      <div>
                        <p className="text-[#0F172A] font-bold">{trip.title}</p>
                        <p className="text-[10px] text-[#64748B] mt-0.5">{trip.dates}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                        trip.status === "Completed" ? "bg-green-100 text-green-700" : "bg-sky-100 text-sky-700"
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments History */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Payment Transactions</h3>
                <div className="space-y-3 text-xs font-semibold">
                  {[
                    { tx: "pay_TajStay1829", amt: "₹18,000", date: "15 May 2026", method: "Razorpay UPI" },
                    { tx: "pay_Skyscanner8829", amt: "₹6,500", date: "10 Jan 2026", method: "Skyscanner Flight" }
                  ].map((pay, idx) => (
                    <div key={idx} className="bg-white border border-[#E5E7EB] rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[#0EA5A4]">{pay.tx}</span>
                        <span className="font-bold text-[#16A34A]">{pay.amt}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-[#64748B]">
                        <span>{pay.date}</span>
                        <span>{pay.method}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
      <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest">{title}</span>
      <h4 className="text-xl font-bold font-sora text-[#0F172A] mt-1">{value}</h4>
    </div>
  );
}
