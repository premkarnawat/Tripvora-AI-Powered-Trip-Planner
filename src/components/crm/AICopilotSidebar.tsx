"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, UserCheck, Package, TrendingUp, Search, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AICopilotSidebar() {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("Assistant");
  const [input, setInput] = useState("");
  
  const suggestedActions = [
    { text: "Generate Trip Itinerary", icon: Sparkles },
    { text: "Batch Update Clients", icon: UserCheck },
    { text: "Generate Package", icon: Package },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#0B1220] border-l border-white/5 shadow-2xl relative z-50">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
            TripPilot AI
          </h2>
          <p className="text-xs text-[#14B8A6] font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span> Ready to assist
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center border border-[#14B8A6]/20">
          <Bot className="w-5 h-5 text-[#14B8A6]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 pt-4 gap-6 border-b border-white/5">
        {["Assistant", "Commands", "Actions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold transition-all relative ${
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
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Assistant Message */}
        <div className="flex gap-3">
          <div className="flex-1 bg-[#0F172A] rounded-2xl rounded-tl-sm p-4 border border-white/5">
            <p className="text-sm text-white leading-relaxed">
              Hello! I've analyzed your upcoming Mediterranean departures. Sarah Jenkins' quote has been pending for 48 hours. Would you like me to draft a follow-up?
            </p>
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-3 justify-end">
          <div className="flex-1 max-w-[85%] bg-[#14B8A6]/10 rounded-2xl rounded-tr-sm p-4 border border-[#14B8A6]/20">
            <p className="text-sm text-white leading-relaxed">
              Yes, please include the recent discount on cabin upgrades.
            </p>
          </div>
        </div>

        {/* Typing Indicator */}
        <div className="flex gap-3 items-center text-[#94A3B8] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#38BDF8]" />
          Drafting follow-up...
        </div>

        {/* Suggested Actions */}
        <div className="pt-6">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4">Suggested Actions</p>
          <div className="space-y-3">
            {suggestedActions.map((action, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all group">
                <action.icon className="w-4 h-4 text-[#38BDF8] group-hover:text-[#14B8A6] transition-colors" />
                <span className="text-sm font-medium text-white/90">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-[#0B1220]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask TripPilot AI..."
            className="w-full bg-[#0F172A] border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8] transition-colors"
          />
          <button className="absolute right-2 w-8 h-8 rounded-xl bg-[#38BDF8] flex items-center justify-center hover:bg-[#38BDF8]/90 transition-colors">
            <Send className="w-4 h-4 text-[#0F172A]" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden xl:block w-[350px] h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Floating Action Button */}
      <button 
        onClick={() => setIsOpenMobile(true)}
        className="xl:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center z-40 hover:scale-105 transition-transform"
      >
        <Bot className="w-6 h-6 text-[#0F172A]" />
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
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#0B1220] z-[70] rounded-t-3xl overflow-hidden flex flex-col shadow-2xl border-t border-white/10 xl:hidden"
            >
              {/* Close Handle */}
              <div className="w-full flex justify-center pt-3 pb-1 absolute top-0 z-50">
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>
              <button 
                onClick={() => setIsOpenMobile(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/5 rounded-full flex items-center justify-center z-50"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex-1 mt-2 overflow-hidden h-full">
                {content}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
