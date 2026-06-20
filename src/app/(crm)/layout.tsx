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
      { name: "Vendors Library", href: "/agency/vendors", icon: Building2 },
    ]
  },
  {
    title: "ACCOUNT",
    links: [
      { name: "Revenue Dashboard", href: "/agency/revenue", icon: DollarSign },
      { name: "Business Settings", href: "/agency/settings", icon: Settings },
    ]
  }
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
          <Link href="/agency/packages">
            <button className="w-full bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] font-extrabold py-3 rounded-md text-sm transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              Generate Package
            </button>
          </Link>
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
          
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsHelpOpen(false); }}
              className={`relative w-8 h-8 rounded-md flex items-center justify-center transition-colors ${isNotificationsOpen ? 'text-white bg-white/10' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full border border-[#020817]" />
            </button>
            <button 
              onClick={() => { setIsHelpOpen(!isHelpOpen); setIsNotificationsOpen(false); }}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${isHelpOpen ? 'text-white bg-white/10' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-white/10 mx-1" />
            
            {/* Notification Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-16 mt-2 w-80 bg-[#0B1220] border border-white/10 rounded-md shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-white/5 flex justify-between items-center bg-[#020817]">
                    <span className="text-sm font-bold text-white">Notifications</span>
                    <span className="text-[10px] text-[#14B8A6] font-bold cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar flex flex-col">
                    {/* Admin Broadcast Notification */}
                    <div className="p-3 border-b border-[#EF4444]/20 bg-[#EF4444]/5 hover:bg-[#EF4444]/10 cursor-pointer flex gap-3 transition-colors">
                      <div className="w-8 h-8 rounded bg-[#EF4444]/20 flex items-center justify-center shrink-0">
                        <Bell className="w-4 h-4 text-[#EF4444]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-widest text-[#EF4444] mb-0.5">Admin Broadcast</p>
                        <p className="text-xs text-white/90">System Maintenance scheduled for Nov 20th, 02:00 AM IST. Expect 15 mins downtime.</p>
                        <p className="text-[10px] text-[#94A3B8] mt-1">10 mins ago</p>
                      </div>
                    </div>
                    {/* Normal Notifications */}
                    <NotificationItem title="New Lead Received" desc="Priya Sharma (Maldives Honeymoon)" time="Just now" />
                    <NotificationItem title="Quotation Viewed" desc="David Smith viewed Tokyo Package" time="2h ago" />
                    <NotificationItem title="Customer Replied" desc="Acme Corp: 'Looks good, let's proceed'" time="5h ago" />
                    <NotificationItem title="Trip Starting Tomorrow" desc="Jenkins Honeymoon (Maldives)" time="1d ago" />
                    <NotificationItem title="Payment Received" desc="₹45,000 from Jenkins" time="1d ago" />
                    <NotificationItem title="Subscription Renewal" desc="Your Pro plan renews in 3 days" time="2d ago" />
                    <NotificationItem title="Admin Message" desc="Your Vendor Library has been verified." time="3d ago" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Center Dropdown */}
            <AnimatePresence>
              {isHelpOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-8 mt-2 w-80 bg-[#0B1220] border border-white/10 rounded-md shadow-2xl overflow-hidden z-50 flex flex-col"
                >
                  <div className="p-4 border-b border-white/5 bg-[#020817]">
                    <h3 className="text-sm font-bold text-white mb-1">Support Center</h3>
                    <p className="text-xs text-[#94A3B8]">How can we help you today?</p>
                  </div>
                  <div className="p-2 grid grid-cols-2 gap-2 border-b border-white/5">
                    <HelpQuickLink icon={HelpCircle} title="FAQs" />
                    <HelpQuickLink icon={FileText} title="Documentation" />
                    <HelpQuickLink icon={Search} title="Video Tutorials" />
                    <HelpQuickLink icon={MessageSquare} title="Raise Ticket" />
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Live Admin Chat
                      </span>
                      <span className="text-[10px] bg-[#38BDF8] text-[#0F172A] font-bold px-1.5 py-0.5 rounded">2 New</span>
                    </div>
                    <div className="bg-[#020817] border border-white/5 rounded-md p-3 flex flex-col gap-3 h-32 overflow-y-auto custom-scrollbar">
                       <div className="flex flex-col gap-1 items-end">
                         <div className="bg-[#14B8A6]/10 text-white text-xs p-2 rounded-l-md rounded-br-md border border-[#14B8A6]/20">How do I add a new vendor?</div>
                         <span className="text-[9px] text-[#94A3B8]">You • 10:45 AM</span>
                       </div>
                       <div className="flex flex-col gap-1 items-start">
                         <div className="bg-white/5 text-white text-xs p-2 rounded-r-md rounded-bl-md border border-white/10">Hi! Go to Operations > Vendor Library and click '+ Add Vendor' in the top right.</div>
                         <span className="text-[9px] text-[#94A3B8]">Admin • 10:48 AM</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Type a message..." className="flex-1 bg-[#020817] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none" />
                      <button className="bg-[#14B8A6] text-[#0F172A] px-3 py-1.5 rounded text-xs font-bold">Send</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

function NotificationItem({ title, desc, time }: any) {
  return (
    <div className="p-3 border-b border-white/5 hover:bg-white/[0.02] cursor-pointer flex gap-3 transition-colors">
      <div className="w-2 h-2 rounded-full bg-[#14B8A6] mt-1.5 shrink-0" />
      <div>
        <p className="text-xs font-bold text-white mb-0.5">{title}</p>
        <p className="text-[10px] text-[#94A3B8] leading-snug">{desc}</p>
        <p className="text-[9px] text-[#94A3B8] mt-1">{time}</p>
      </div>
    </div>
  );
}

function HelpQuickLink({ icon: Icon, title }: any) {
  return (
    <button className="flex items-center gap-2 p-2 rounded hover:bg-white/5 text-left transition-colors group">
      <Icon className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#38BDF8]" />
      <span className="text-[10px] font-bold text-white/80 group-hover:text-white">{title}</span>
    </button>
  );
}
