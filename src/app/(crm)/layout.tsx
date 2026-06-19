"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, FileText, Settings, Menu, X, LogOut, 
  TrendingUp, Search, Bell, HelpCircle, CalendarCheck, Package,
  Store, Building2, Car, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AICopilotSidebar } from "@/components/crm/AICopilotSidebar";

const sidebarLinks = [
  { name: "Dashboard", href: "/agency", icon: LayoutDashboard },
  { name: "Leads", href: "/agency/leads", icon: Users },
  { name: "Customers", href: "/agency/customers", icon: Users },
  { name: "Bookings", href: "/agency/bookings", icon: CalendarCheck },
  { name: "Packages", href: "/agency/packages", icon: Package },
  { name: "Quotations", href: "/agency/quotations", icon: FileText },
  { name: "Marketplace Leads", href: "/agency/marketplace", icon: Store },
  { name: "Partners", href: "/agency/partners", icon: Building2 },
  { name: "Vendors", href: "/agency/vendors", icon: Car },
  { name: "Analytics", href: "/agency/analytics", icon: TrendingUp },
  { name: "Marketing", href: "/agency/marketing", icon: MessageSquare },
  { name: "Settings", href: "/agency/settings", icon: Settings },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#020817] min-h-screen w-full flex overflow-hidden font-sans text-white">
      
      {/* 1. Desktop Left Sidebar (280px) */}
      <aside className="hidden xl:flex w-[280px] flex-col bg-[#0B1220] border-r border-white/5 h-screen shrink-0 relative z-20">
        <div className="p-6">
          <Link href="/agency" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" fillOpacity="0.8"/>
              <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
            </svg>
            <div>
              <h2 className="text-xl font-sora font-black text-white tracking-tight leading-none">TripPilot</h2>
              <p className="text-[10px] text-[#94A3B8] font-bold tracking-widest mt-1 uppercase">Travel CRM</p>
            </div>
          </Link>
          <div className="mt-6 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <p className="text-xs text-[#94A3B8] uppercase tracking-widest font-bold mb-1">Elite Travels</p>
            <p className="text-[10px] text-[#14B8A6] font-bold">Enterprise Tier</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar space-y-1.5">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname?.startsWith(link.href + "/") && link.href !== "/agency");
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold group ${
                  isActive 
                    ? "bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20" 
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#14B8A6]" : "text-[#94A3B8] group-hover:text-white"}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
          <button className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] font-bold py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            + New Booking
          </button>
        </div>
      </aside>

      {/* Mobile Header / Menu Toggle */}
      <div className="xl:hidden fixed top-0 left-0 right-0 z-40 bg-[#0B1220]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" fillOpacity="0.8"/>
              <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
            </svg>
          <span className="font-sora font-bold text-white tracking-widest uppercase text-sm">CRM</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2 bg-white/5 rounded-lg border border-white/10">
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
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#0B1220] z-[70] flex flex-col shadow-2xl border-r border-white/10 xl:hidden"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <span className="font-sora font-bold text-xl text-white">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                        isActive ? "bg-[#14B8A6]/10 text-[#14B8A6]" : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="p-6 border-t border-white/5">
                <button className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] font-bold py-3 rounded-xl transition-colors">
                  + New Booking
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. Center Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#020817] relative">
        
        {/* Sticky Top Header */}
        <header className="hidden xl:flex h-20 bg-[#0B1220]/80 backdrop-blur-md border-b border-white/5 shrink-0 px-8 items-center justify-between z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search clients, trips, or agents..." 
              className="w-full bg-[#0F172A] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-3 bg-[#0F172A] px-3 py-1.5 rounded-full border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
              <span className="text-sm font-bold text-white">JD</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#14B8A6] to-[#38BDF8] flex items-center justify-center">
                <Users className="w-4 h-4 text-[#0F172A]" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar pt-20 xl:pt-0 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* 3. Right Sidebar (AI Copilot) */}
      <AICopilotSidebar />

    </div>
  );
}
