"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Settings, Menu, X, LogOut, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "Dashboard", href: "/agency", icon: LayoutDashboard },
  { name: "Leads", href: "/agency/leads", icon: Users },
  { name: "Quotations", href: "/agency/quotations", icon: FileText },
  { name: "Analytics", href: "/agency/analytics", icon: TrendingUp },
  { name: "Settings", href: "/agency/settings", icon: Settings },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="pt-24 pb-20 min-h-screen max-w-[1500px] mx-auto flex flex-col lg:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col gap-6 px-6 border-r border-white/5 sticky top-24 h-[calc(100vh-6rem)] py-6">
        <div className="mb-4 px-4">
          <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">Agency Portal</p>
          <h2 className="text-xl font-sora font-bold text-white">Wanderlust Inc.</h2>
        </div>
        
        <div className="space-y-2 flex-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-teal-500/20 text-teal-400 font-bold shadow-[0_0_15px_rgba(20,184,166,0.15)]" 
                    : "text-white/60 hover:text-white hover:bg-white/5 font-medium"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </div>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 font-medium transition-all mt-auto">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Mobile Header / Menu Toggle */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-[#04060E]/90 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex justify-between items-center">
        <span className="font-sora font-bold text-teal-400 tracking-widest uppercase text-sm">Agency Portal</span>
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
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#0A0F1D] z-[70] p-6 flex flex-col gap-8 shadow-2xl border-l border-white/10"
            >
              <div className="flex justify-between items-center">
                <span className="font-sora font-bold text-xl text-white">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-2 flex-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                        isActive ? "bg-teal-500/20 text-teal-400 font-bold" : "text-white/60 hover:text-white hover:bg-white/5 font-medium"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <button className="flex items-center gap-3 px-4 py-4 rounded-xl text-red-400 hover:bg-red-400/10 font-medium transition-all">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 px-4 lg:px-8 pt-20 lg:pt-6">
        {children}
      </main>

    </div>
  );
}
