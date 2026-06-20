"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Building, ShieldCheck, Activity, Menu, X, LogOut, 
  DollarSign, Settings, LifeBuoy, MessageSquare, FileText, Video, Image, 
  FileSignature, LayoutTemplate, Megaphone, HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarGroups = [
  {
    title: "CORE OPERATIONS",
    links: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Platform Users", href: "/admin/users", icon: Users },
      { name: "Agencies (B2B)", href: "/admin/agencies", icon: Building },
      { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
    ]
  },
  {
    title: "CUSTOMER SUCCESS",
    links: [
      { name: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
      { name: "Live Chat", href: "/admin/chat", icon: MessageSquare },
    ]
  },
  {
    title: "PLATFORM CONFIG",
    links: [
      { name: "Platform Settings", href: "/admin/settings", icon: Settings },
      { name: "Audit Logs", href: "/admin/audit", icon: ShieldCheck },
    ]
  },
  {
    title: "KNOWLEDGE BASE",
    links: [
      { name: "Help Center", href: "/admin/help-center", icon: HelpCircle },
      { name: "Documentation", href: "/admin/docs", icon: FileText },
      { name: "Video Library", href: "/admin/videos", icon: Video },
    ]
  },
  {
    title: "CONTENT & ASSETS",
    links: [
      { name: "Pages CMS", href: "/admin/cms", icon: LayoutTemplate },
      { name: "Media Library", href: "/admin/media", icon: Image },
      { name: "Legal Pages", href: "/admin/legal", icon: FileSignature },
      { name: "Promotions", href: "/admin/promotions", icon: Megaphone },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="pt-24 pb-20 min-h-screen max-w-[1500px] mx-auto flex flex-col xl:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden xl:flex w-72 flex-col gap-6 px-6 border-r border-white/5 sticky top-24 h-[calc(100vh-6rem)] py-6 overflow-y-auto custom-scrollbar">
        <div className="mb-2 px-4 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-6 h-6 text-purple-400" />
          <div>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest leading-none mb-1">Super Admin</p>
            <h2 className="text-lg font-sora font-bold text-white leading-none">TripPilot OS</h2>
          </div>
        </div>
        
        <div className="flex flex-col gap-6 flex-1">
          {sidebarGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="px-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{group.title}</span>
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                      isActive 
                        ? "bg-purple-500/20 text-purple-400 font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                        : "text-white/60 hover:text-white hover:bg-white/5 font-medium"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 font-medium transition-all shrink-0 mt-4">
          <LogOut className="w-5 h-5 shrink-0" />
          Secure Logout
        </button>
      </aside>

      {/* Mobile Header / Menu Toggle */}
      <div className="xl:hidden fixed top-16 left-0 right-0 z-40 bg-[#04060E]/90 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <span className="font-sora font-bold text-purple-400 tracking-widest uppercase text-sm">TripPilot OS</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2 bg-white/5 rounded-lg border border-white/10">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] xl:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#0A0F1D] z-[70] p-6 flex flex-col gap-6 shadow-2xl border-l border-white/10 overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center shrink-0">
                <span className="font-sora font-bold text-xl text-white">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-6 flex-1">
                {sidebarGroups.map((group, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="px-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">{group.title}</span>
                    {group.links.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                      return (
                        <Link 
                          key={link.name} 
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                            isActive ? "bg-purple-500/20 text-purple-400 font-bold" : "text-white/60 hover:text-white hover:bg-white/5 font-medium"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-sm">{link.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 font-medium transition-all shrink-0">
                <LogOut className="w-5 h-5 shrink-0" />
                Secure Logout
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 px-4 xl:px-8 pt-20 xl:pt-6">
        {children}
      </main>

    </div>
  );
}
