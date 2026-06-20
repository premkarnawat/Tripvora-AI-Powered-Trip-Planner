"use client";

import { useState } from "react";
import { 
  LifeBuoy, Search, Filter, AlertCircle, Clock, 
  CheckCircle2, Send, Paperclip, ShieldAlert, ArrowRight,
  User, Mail, Phone, Calendar, History, Trash2, ExternalLink
} from "lucide-react";

// Mock tickets list
const initialTickets = [
  {
    id: "TCK-1042",
    user: "David Smith",
    email: "david@smithtravels.com",
    phone: "+1 555-019-2834",
    type: "Traveler",
    subject: "Refund for cancelled flight",
    priority: "High",
    status: "Open",
    created: "2 hrs ago",
    lastReply: "10 mins ago",
    avatar: "DS",
    historyCount: 4,
    messages: [
      { sender: "David Smith", text: "Hi, my flight TRIP-9281 to Goa was cancelled by the airline. Can I get a full refund?", time: "2 hrs ago" },
      { sender: "Support Agent", text: "Hi David, let me check the cancellation policy for you. One moment.", time: "1 hr ago" },
      { sender: "David Smith", text: "Thank you, I need this resolved urgently as my booking date was yesterday.", time: "10 mins ago" }
    ]
  },
  {
    id: "TCK-1041",
    user: "Karan Johar (Wanderlust)",
    email: "karan@wanderlust.in",
    phone: "+91 98765 43210",
    type: "Agency",
    subject: "API quota threshold reached",
    priority: "Urgent",
    status: "In Progress",
    created: "5 hrs ago",
    lastReply: "1 hr ago",
    avatar: "KJ",
    historyCount: 18,
    messages: [
      { sender: "Karan Johar", text: "We are getting 429 rate limit errors on Gemini package builders. Can you increase our quota?", time: "5 hrs ago" }
    ]
  },
  {
    id: "TCK-1040",
    user: "Priya Sharma",
    email: "priya@sharmatrips.com",
    phone: "+91 99999 88888",
    type: "Traveler",
    subject: "How to edit active itinerary?",
    priority: "Low",
    status: "Resolved",
    created: "1 day ago",
    lastReply: "12 hrs ago",
    avatar: "PS",
    historyCount: 2,
    messages: [
      { sender: "Priya Sharma", text: "I generated a trip to Kashmir. How do I swap day 3 hotel?", time: "1 day ago" }
    ]
  }
];

export default function SupportCenterPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicketId, setActiveTicketId] = useState("TCK-1042");
  const [replyText, setReplyText] = useState("");

  const activeTicket = tickets.find(t => t.id === activeTicketId) || tickets[0];

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    setTickets(prev => prev.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          lastReply: "Just now",
          messages: [
            ...t.messages,
            { sender: "Admin (Prem)", text: replyText, time: "Just now" }
          ]
        };
      }
      return t;
    }));
    
    setReplyText("");
  };

  const handleTicketAction = (action: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === activeTicket.id) {
        if (action === "Close") return { ...t, status: "Closed" };
        if (action === "Escalate") return { ...t, priority: "Urgent" };
      }
      return t;
    }));
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] h-[calc(100vh-140px)] flex flex-col md:flex-row">
      
      {/* LEFT PANEL: Tickets List */}
      <div className="w-full md:w-80 border-r border-[#E5E7EB] flex flex-col shrink-0">
        
        {/* Search */}
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all"
            />
          </div>
        </div>

        {/* Tickets Scroll List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB] custom-scrollbar">
          {tickets.map((t) => {
            const isActive = t.id === activeTicket.id;
            return (
              <div 
                key={t.id}
                onClick={() => setActiveTicketId(t.id)}
                className={`p-4 cursor-pointer transition-colors text-xs font-semibold ${
                  isActive ? "bg-[#0EA5A4]/10" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[#64748B]">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-widest ${
                    t.status === "Open" ? "bg-red-100 text-red-700" :
                    t.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h4 className="text-[#0F172A] font-bold truncate">{t.subject}</h4>
                <p className="text-[#64748B] mt-0.5 truncate">{t.user}</p>
                <div className="flex justify-between text-[10px] text-[#94A3B8] mt-2">
                  <span>{t.lastReply}</span>
                  <span className={t.priority === "Urgent" ? "text-red-500 font-bold" : ""}>{t.priority} Priority</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* CENTER PANEL: Active Conversation */}
      <div className="flex-1 flex flex-col justify-between border-r border-[#E5E7EB]">
        
        {/* Active conversation header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold font-sora text-[#0F172A]">{activeTicket.subject}</h3>
            <p className="text-[10px] text-[#64748B] mt-0.5">Ticket ID: {activeTicket.id} • Assigned to: Support Team</p>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => handleTicketAction("Close")}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0F172A] rounded text-[10px] font-bold transition-all"
            >
              Close Ticket
            </button>
            <button 
              onClick={() => handleTicketAction("Escalate")}
              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded text-[10px] font-bold transition-all"
            >
              Escalate
            </button>
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20 custom-scrollbar">
          {activeTicket.messages.map((msg, idx) => {
            const isAdmin = msg.sender.startsWith("Admin") || msg.sender.startsWith("Support");
            return (
              <div 
                key={idx}
                className={`flex gap-3 max-w-[80%] text-xs font-semibold ${
                  isAdmin ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                {/* Mini avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                  isAdmin ? "bg-[#0EA5A4] text-white" : "bg-slate-200 text-[#64748B]"
                }`}>
                  {isAdmin ? "A" : activeTicket.avatar}
                </div>
                
                <div className={`p-3.5 rounded-2xl ${
                  isAdmin 
                    ? "bg-[#0EA5A4] text-white rounded-tr-none" 
                    : "bg-white border border-[#E5E7EB] text-[#0F172A] rounded-tl-none"
                }`}>
                  <p className="leading-snug">{msg.text}</p>
                  <span className={`text-[8px] mt-1 block text-right font-bold ${
                    isAdmin ? "text-white/70" : "text-[#94A3B8]"
                  }`}>{msg.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Message Input Area */}
        <div className="p-4 border-t border-[#E5E7EB] bg-white flex flex-col gap-3">
          <textarea 
            rows={3}
            placeholder="Type your reply here..." 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full bg-[#F1F5F9] border border-transparent rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all resize-none"
          />

          <div className="flex justify-between items-center">
            {/* Attachment action button */}
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[#64748B] transition-all" title="Attach file">
              <Paperclip className="w-4 h-4" />
            </button>
            
            <button 
              onClick={handleSendReply}
              className="flex items-center gap-1 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-bold shadow-sm transition-all"
            >
              <span>Reply Ticket</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT PANEL: User Details */}
      <div className="hidden lg:flex w-72 flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar shrink-0">
        
        {/* User profile header */}
        <div className="text-center pb-4 border-b border-[#E5E7EB]">
          <div className="w-12 h-12 rounded-full bg-[#0EA5A4]/10 text-[#0EA5A4] flex items-center justify-center font-bold text-base mx-auto border border-[#0EA5A4]/15">
            {activeTicket.avatar}
          </div>
          <h4 className="text-sm font-bold font-sora text-[#0F172A] mt-2">{activeTicket.user}</h4>
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 mt-1 inline-block">
            {activeTicket.type}
          </span>
        </div>

        {/* Profile parameters list */}
        <div className="space-y-4 text-xs font-semibold text-[#64748B]">
          
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2">User Details</h5>
            <div className="space-y-2.5">
              <div className="flex gap-2 items-center">
                <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                <span className="text-[#0F172A] truncate">{activeTicket.email}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                <span className="text-[#0F172A]">{activeTicket.phone}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB]">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2 flex items-center justify-between">
              <span>Customer History</span>
              <History className="w-3.5 h-3.5 text-[#94A3B8]" />
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>Total tickets created:</span>
                <span className="text-[#0F172A]">{activeTicket.historyCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="text-[#16A34A] font-bold">Good Standing</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
            <button className="w-full flex items-center justify-between px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-[#0F172A] rounded-lg transition-all">
              <span>View User Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
