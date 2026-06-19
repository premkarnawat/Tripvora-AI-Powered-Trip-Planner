"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, UserCheck, Package, TrendingUp, Phone, ChevronRight, X } from "lucide-react";

export function AICopilotSidebar() {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("Assistant");
  const [input, setInput] = useState("");
  
  const aiCommands = [
    { cmd: "/whatsapp", desc: "Generate WhatsApp Follow-up", icon: Phone },
    { cmd: "/leads", desc: "Find Hot Leads", icon: UserCheck },
    { cmd: "/profit", desc: "Predict Revenue", icon: TrendingUp },
    { cmd: "/package", desc: "Generate Package", icon: Package },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#020817] border-l border-white/10 shadow-2xl relative z-50">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#0B1220]">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            TripPilot AI
          </h2>
          <p className="text-[10px] text-[#14B8A6] font-bold tracking-widest uppercase mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span> Ready to assist
          </p>
        </div>
        <div className="w-8 h-8 rounded bg-[#14B8A6]/10 flex items-center justify-center border border-[#14B8A6]/20">
          <Bot className="w-4 h-4 text-[#14B8A6]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 pt-3 gap-5 border-b border-white/5 bg-[#0B1220]">
        {["Assistant", "Commands"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-xs font-bold transition-all relative ${
              activeTab === tab ? "text-white" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="ai-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#38BDF8]" />
            )}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#020817]">
        {activeTab === "Assistant" ? (
          <>
            {/* Assistant Message */}
            <div className="flex gap-2">
              <div className="flex-1 bg-[#0B1220] rounded-lg rounded-tl-sm p-3 border border-white/5 shadow-sm">
                <p className="text-xs text-white leading-relaxed">
                  I've detected 3 "Hot" leads whose quotations have been pending for 48 hours. I recommend sending a WhatsApp follow-up.
                </p>
              </div>
            </div>

            {/* Suggested Action */}
            <button className="ml-2 mt-1 flex items-center gap-1.5 text-[10px] font-bold text-[#38BDF8] hover:text-[#14B8A6] transition-colors border border-[#38BDF8]/20 bg-[#38BDF8]/5 px-2 py-1 rounded">
              <Phone className="w-3 h-3" /> Draft WhatsApp Message
            </button>

            {/* User Message */}
            <div className="flex gap-2 justify-end pt-4">
              <div className="max-w-[85%] bg-[#14B8A6]/10 rounded-lg rounded-tr-sm p-3 border border-[#14B8A6]/20">
                <p className="text-xs text-white leading-relaxed">
                  Yes, draft the message and include the new Bali package offer.
                </p>
              </div>
            </div>

            {/* Typing Indicator */}
            <div className="flex gap-2 items-center text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest pt-2">
              <Sparkles className="w-3 h-3 animate-pulse text-[#38BDF8]" />
              Drafting...
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Available Commands</p>
            {aiCommands.map((cmd, i) => (
              <button key={i} className="w-full flex items-center justify-between p-3 bg-[#0B1220] hover:bg-white/[0.05] border border-white/5 rounded-lg transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-[#38BDF8]/10 flex items-center justify-center">
                    <cmd.icon className="w-3.5 h-3.5 text-[#38BDF8]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">{cmd.cmd}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">{cmd.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/5 bg-[#0B1220]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command or ask..."
            className="w-full bg-[#020817] border border-white/10 rounded-md py-2.5 pl-3 pr-10 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8] transition-colors"
          />
          <button className="absolute right-1.5 w-7 h-7 rounded text-[#38BDF8] flex items-center justify-center hover:bg-[#38BDF8]/10 transition-colors">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden xl:block w-[300px] h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Floating Action Button */}
      <button 
        onClick={() => setIsOpenMobile(true)}
        className="xl:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center justify-center z-40 hover:scale-105 transition-transform"
      >
        <Bot className="w-5 h-5 text-[#0F172A]" />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpenMobile(false)}
              className="fixed inset-0 bg-black/80 z-[60] xl:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-[#020817] z-[70] rounded-t-2xl overflow-hidden flex flex-col shadow-2xl border-t border-white/10 xl:hidden"
            >
              <div className="w-full flex justify-center pt-2 pb-1 absolute top-0 z-50">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>
              <button 
                onClick={() => setIsOpenMobile(false)}
                className="absolute top-3 right-3 w-7 h-7 bg-white/5 rounded-md flex items-center justify-center z-50"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex-1 mt-1 overflow-hidden h-full">
                {content}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
