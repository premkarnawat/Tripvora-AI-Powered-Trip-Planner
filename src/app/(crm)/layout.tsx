"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, FileText, Settings, Menu, X,
  TrendingUp, Search, Bell, CalendarCheck, Package,
  Store, Building2, Car, MessageSquare, CreditCard,
  Bot, Phone, HelpCircle, CheckSquare, Briefcase, Map, DollarSign, Plug
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AICopilotSidebar } from "@/components/crm/AICopilotSidebar";

const sidebarGroups = [
  {
    title: "SALES",
    links: [
      { name: "Dashboard", href: "/agency", icon: LayoutDashboard },
      { name: "Marketplace Leads", href: "/agency/marketplace", icon: Store },
      { name: "Leads Pipeline", href: "/agency/leads", icon: Users },
      { name: "Customers", href: "/agency/customers", icon: Briefcase },
    ]
  },
  {
    title: "BUILDERS",
    links: [
      { name: "AI Package Builder", href: "/agency/packages", icon: Package },
      { name: "Quotations", href: "/agency/quotations", icon: FileText },
    ]
  },
  {
    title: "OPERATIONS",
    links: [
      { name: "WhatsApp Hub", href: "/agency/whatsapp", icon: Phone },
      { name: "Trips & Bookings", href: "/agency/trips", icon: Map },
    ]
  },
  {
    title: "ACCOUNT",
    links: [
      { name: "Revenue Dashboard", href: "/agency/revenue", icon: DollarSign },
      { name: "Subscription & Settings", href: "/agency/subscription", icon: Settings },
    ]
  }
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#020817] min-h-screen w-full flex font-sans text-white relative">
      
      {/* 1. Desktop Left Sidebar (260px) - Denser Width */}
      <aside className="hidden xl:flex w-[260px] flex-col bg-[#020817] border-r border-white/10 h-screen shrink-0 sticky top-0 z-20">
        <div className="p-5 border-b border-white/5">
          <Link href="/agency" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" fillOpacity="0.8"/>
              <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
            </svg>
            <h2 className="text-lg font-bold text-white tracking-tight leading-none">TripPilot OS</h2>
          </Link>
          
          <div className="mt-4 flex items-center gap-3 p-2 bg-white/[0.03] border border-white/10 rounded-md">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#14B8A6] to-[#0F172A] flex items-center justify-center font-bold text-xs shadow-inner">
              ET
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Elite Travels</p>
              <p className="text-[10px] text-[#14B8A6] truncate">Enterprise Tier</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-6">
          {sidebarGroups.map((group, idx) => (
            <div key={idx}>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-3 mb-2">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (pathname?.startsWith(link.href + "/") && link.href !== "/agency");
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors text-sm font-medium group ${
                        isActive 
                          ? "bg-[#14B8A6]/10 text-[#14B8A6]" 
                          : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#14B8A6]" : "text-[#94A3B8] group-hover:text-white"}`} />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-[#0B1220]">
          <button className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] font-bold py-2 rounded-md text-sm transition-colors shadow-sm">
            Quick Action (Cmd+K)
          </button>
        </div>
      </aside>

      {/* Mobile Header / Menu Toggle */}
      <div className="xl:hidden fixed top-0 left-0 right-0 z-40 bg-[#020817]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" fillOpacity="0.8"/>
              <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
            </svg>
          <span className="font-bold text-white text-sm">TripPilot OS</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-1.5 hover:bg-white/5 rounded-md transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-[60] xl:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#020817] z-[70] flex flex-col shadow-2xl border-r border-white/10 xl:hidden"
            >
              <div className="p-5 flex justify-between items-center border-b border-white/5">
                <span className="font-bold text-white">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-md transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
                {sidebarGroups.map((group, idx) => (
                  <div key={idx}>
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-2 mb-2">
                      {group.title}
                    </p>
                    <div className="space-y-0.5">
                      {group.links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                          <Link 
                            key={link.name} 
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-sm ${
                              isActive ? "bg-[#14B8A6]/10 text-[#14B8A6]" : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {link.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. Center Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#020817] relative">
        
        {/* Dense Top Header */}
        <header className="hidden xl:flex h-14 bg-[#020817]/95 backdrop-blur-md border-b border-white/10 shrink-0 px-6 items-center justify-between z-10 sticky top-0">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search leads, customers, packages..." 
              className="w-full bg-[#0B1220] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8] transition-colors shadow-inner"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 rounded-md flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full border border-[#020817]" />
            </button>
            <button className="w-8 h-8 rounded-md flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded-md transition-colors">
              <div className="w-6 h-6 rounded bg-[#14B8A6]/20 flex items-center justify-center border border-[#14B8A6]/30">
                <Users className="w-3 h-3 text-[#14B8A6]" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pt-16 xl:pt-0 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* 3. Right Sidebar (AI Copilot) */}
      <AICopilotSidebar />

    </div>
  );
}
