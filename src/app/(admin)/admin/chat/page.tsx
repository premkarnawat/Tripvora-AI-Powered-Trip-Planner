"use client";

import { useState } from "react";
import { Search, Filter, Paperclip, Send, Image as ImageIcon, FileText, CheckCheck, MoreVertical, Pin, User, Building, Archive, UserPlus, Forward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const conversations = [
  { id: "C-1", name: "David Smith", type: "Traveler", active: true, unread: 2, lastMsg: "Can you change my hotel?", time: "10:45 AM" },
  { id: "C-2", name: "Elite Travels", type: "Agency", active: false, unread: 0, lastMsg: "Thanks, the quota is updated.", time: "Yesterday" },
  { id: "C-3", name: "Acme Corp", type: "Agency", active: false, unread: 0, lastMsg: "Payment went through.", time: "2 Days Ago" },
  { id: "C-4", name: "Priya Sharma", type: "Traveler", active: false, unread: 0, lastMsg: "Perfect, looking forward to it!", time: "Nov 15" },
];

export default function LiveChatPage() {
  const [activeChat, setActiveChat] = useState("C-1");

  return (
    <div className="w-full max-w-[1500px] mx-auto h-[calc(100vh-10rem)] flex overflow-hidden bg-[#0B1220] border border-white/5 rounded-xl">
      
      {/* Left Pane - Conversation List */}
      <div className="w-full md:w-80 flex flex-col border-r border-white/5 shrink-0 bg-[#020817]">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white mb-4">Live Chat</h2>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-[#0B1220] border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">All</button>
            <button className="px-3 py-1 text-[10px] font-bold rounded-full bg-white/5 text-[#94A3B8] border border-white/10 hover:text-white hover:bg-white/10 transition-colors">Agencies</button>
            <button className="px-3 py-1 text-[10px] font-bold rounded-full bg-white/5 text-[#94A3B8] border border-white/10 hover:text-white hover:bg-white/10 transition-colors">Travelers</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.map((conv) => (
            <div 
              key={conv.id} 
              onClick={() => setActiveChat(conv.id)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-all ${activeChat === conv.id ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${conv.active ? "bg-[#10B981]" : "bg-transparent"}`} />
                  <span className="text-sm font-bold text-white">{conv.name}</span>
                </div>
                <span className="text-[10px] text-[#94A3B8]">{conv.time}</span>
              </div>
              <div className="flex justify-between items-end pl-4">
                <p className="text-xs text-[#94A3B8] truncate max-w-[180px]">{conv.lastMsg}</p>
                {conv.unread > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#EF4444] text-[9px] font-bold text-white flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane - Chat Window */}
      <div className="flex-1 flex flex-col bg-[#0B1220]">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#020817]/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">DS</div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                David Smith
                <span className="text-[9px] font-bold bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20 uppercase tracking-wider">Traveler</span>
              </h3>
              <p className="text-[10px] text-[#10B981] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ActionBtn icon={Pin} tooltip="Pin Message" />
            <ActionBtn icon={Forward} tooltip="Forward" />
            <ActionBtn icon={UserPlus} tooltip="Assign to Team" />
            <ActionBtn icon={Archive} tooltip="Archive" />
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ActionBtn icon={Search} tooltip="Search Chat" />
            <ActionBtn icon={MoreVertical} tooltip="Options" />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
          
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-[#020817] px-3 py-1 rounded-full border border-white/5">Today</span>
          </div>

          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
            <div>
              <div className="bg-[#020817] border border-white/10 text-sm text-white/90 p-3 rounded-2xl rounded-tl-sm">
                Hi, I'm reviewing the Maldives itinerary you generated.
              </div>
              <span className="text-[10px] text-[#94A3B8] mt-1 ml-1 block">10:42 AM</span>
            </div>
          </div>

          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
            <div>
              <div className="bg-[#020817] border border-white/10 text-sm text-white/90 p-3 rounded-2xl rounded-tl-sm">
                Can you change my hotel from Sun Island to Paradise Island?
              </div>
              <span className="text-[10px] text-[#94A3B8] mt-1 ml-1 block">10:45 AM</span>
            </div>
          </div>

          <div className="flex gap-3 max-w-[80%] self-end flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-[#14B8A6]/20 shrink-0 flex items-center justify-center">
              <span className="text-xs font-bold text-[#14B8A6]">ME</span>
            </div>
            <div className="flex flex-col items-end">
              <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-sm text-white p-3 rounded-2xl rounded-tr-sm">
                Hello David! Absolutely, I can update that for you right now. Give me one moment to check availability.
              </div>
              <div className="flex items-center gap-1 mt-1 mr-1">
                <span className="text-[10px] text-[#94A3B8]">10:46 AM</span>
                <CheckCheck className="w-3 h-3 text-[#38BDF8]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-12">
            <span className="flex space-x-1 items-center bg-[#020817] px-3 py-2 rounded-full border border-white/5">
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full" />
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full" />
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full" />
            </span>
            <span className="text-[10px] text-[#94A3B8]">David is typing...</span>
          </div>

        </div>

        {/* Message Input */}
        <div className="p-4 bg-[#020817]/80 border-t border-white/5 shrink-0">
          <div className="flex items-end gap-3 bg-[#0B1220] border border-white/10 p-2 rounded-xl focus-within:border-[#38BDF8] transition-colors">
            <div className="flex gap-1 pb-1">
              <button className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <ImageIcon className="w-4 h-4" />
              </button>
              <button className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
              </button>
            </div>
            <textarea 
              rows={2}
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none text-sm text-white resize-none py-2 px-2 focus:outline-none custom-scrollbar"
            />
            <Button className="h-10 px-4 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.2)] transition-all mb-0.5">
              <Send className="w-4 h-4 mr-2" /> Send
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}

function ActionBtn({ icon: Icon, tooltip }: any) {
  return (
    <button title={tooltip} className="w-8 h-8 rounded-md flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
      <Icon className="w-4 h-4" />
    </button>
  );
}
