"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Building2, Store, Megaphone, Percent, Compass, 
  Coins, CreditCard, Send, LifeBuoy, LayoutTemplate, Settings, Menu, X, 
  Bell, MessageSquare, Search, Plus, ChevronRight, LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Agencies", href: "/admin/agencies", icon: Building2 },
  { name: "Marketplace", href: "/admin/marketplace", icon: Store },
  { name: "Advertisements", href: "/admin/advertisements", icon: Megaphone },
  { name: "Offers", href: "/admin/offers", icon: Percent },
  { name: "Destinations", href: "/admin/destinations", icon: Compass },
  { name: "Revenue", href: "/admin/revenue", icon: Coins },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Leads", href: "/admin/leads", icon: Send },
  { name: "Support Center", href: "/admin/support", icon: LifeBuoy },
  { name: "CMS", href: "/admin/cms", icon: LayoutTemplate },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function checkSession() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          if (mounted) router.push("/admin/login");
          return;
        }
        
        const role = session.user.user_metadata?.role;
        if (role !== 'admin' && role !== 'super_admin') {
          if (mounted) router.push("/unauthorized");
          return;
        }

        if (mounted) setCheckingAuth(false);
      } catch (e) {
        if (mounted) router.push("/admin/login");
      }
    }
    checkSession();
    return () => { mounted = false; };
  }, [router]);
  
  // Dummy data for dropdowns
  const notifications = [
    { id: 1, text: "New agency registration: 'Delhi Horizons'", time: "5m ago", type: "info" },
    { id: 2, text: "High revenue alert: ₹2.4L package booked", time: "1h ago", type: "success" },
    { id: 3, text: "API quota threshold reached (90%)", time: "2h ago", type: "warning" },
  ];

  const messages = [
    { id: 1, sender: "Karan Johar", snippet: "GST verification document uploaded...", time: "10m ago" },
    { id: 2, sender: "Sunita Travel", snippet: "Query regarding Razorpay split payments...", time: "30m ago" },
    { id: 3, sender: "Rajesh (Traveler)", snippet: "Is Viator integration down?", time: "1h ago" },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0EA5A4] rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-bold">Securing Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-theme min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased relative z-50">
      
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#E5E7EB] fixed top-0 bottom-0 left-0 z-30">
        
        {/* Logo and Tagline */}
        <div className="p-6 border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22L12 2L22 22H2Z" fill="#0EA5A4" />
              <path d="M12 2L2 22H12V2Z" fill="#14B8A6" />
            </svg>
            <h1 className="text-lg font-bold font-sora tracking-tight text-[#0F172A]">Travixa Admin</h1>
          </div>
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest mt-1">Travel OS</p>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
            
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                  isActive 
                    ? "bg-[#0EA5A4]/10 text-[#0EA5A4] font-semibold" 
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-[#0EA5A4]" : "text-[#64748B] group-hover:text-[#0F172A]"
                  }`} />
                  <span>{link.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#0EA5A4]" />}
              </Link>
            );
          })}
        </nav>

        {/* Profile Card Bottom */}
        <div className="p-4 border-t border-[#E5E7EB] shrink-0 bg-white">
          <div 
            onClick={async () => {
              try {
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();
                await supabase.auth.signOut();
              } catch (e) {}
              router.push("/admin/login");
            }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F1F5F9] transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E7EB] shrink-0 bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
                alt="Admin Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#0F172A] truncate">Prem Karnawat</p>
              <p className="text-[10px] text-[#64748B] font-medium truncate">Lead Architect</p>
            </div>
            <LogOut className="w-4 h-4 text-[#64748B] group-hover:text-red-500 transition-colors shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        
        {/* Sticky Header */}
        <header className="sticky top-0 right-0 left-0 lg:left-64 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-6 flex items-center justify-between">
          
          {/* Menu Toggle (Mobile only) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F1F5F9] transition-colors"
            >
              <Menu className="w-5 h-5 text-[#0F172A]" />
            </button>
            <div className="flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 22L12 2L22 22H2Z" fill="#0EA5A4" />
              </svg>
              <span className="font-bold font-sora text-sm text-[#0F172A]">Travixa</span>
            </div>
          </div>

          {/* Global Search */}
          <div className="hidden md:flex relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input 
              type="text" 
              placeholder="Search bookings, agencies, tickets..." 
              className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all"
            />
          </div>

          {/* Quick Actions & Profile Dropdowns */}
          <div className="flex items-center gap-4">
            
            {/* Quick Actions CTA */}
            <button className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Actions</span>
            </button>

            {/* Messages Panel Toggle */}
            <div className="relative">
              <button 
                onClick={() => { setIsMessagesOpen(!isMessagesOpen); setIsNotificationsOpen(false); }}
                className={`p-2 rounded-full border transition-colors ${
                  isMessagesOpen ? "bg-[#F1F5F9] border-[#0EA5A4]/30" : "hover:bg-[#F1F5F9] border-[#E5E7EB]"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#0F172A]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#0EA5A4] rounded-full border border-white"></span>
              </button>

              <AnimatePresence>
                {isMessagesOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMessagesOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-50 p-4"
                    >
                      <h4 className="text-xs font-bold text-[#0F172A] border-b border-[#E5E7EB] pb-2 mb-2 flex items-center justify-between">
                        <span>Recent Messages</span>
                        <span className="text-[10px] text-[#0EA5A4] hover:underline cursor-pointer">Mark all read</span>
                      </h4>
                      <div className="space-y-2">
                        {messages.map(msg => (
                          <div key={msg.id} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer">
                            <p className="text-xs font-bold text-[#0F172A]">{msg.sender}</p>
                            <p className="text-[10px] text-[#64748B] truncate mt-0.5">{msg.snippet}</p>
                            <span className="text-[9px] text-[#94A3B8] block mt-1">{msg.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications Panel Toggle */}
            <div className="relative">
              <button 
                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsMessagesOpen(false); }}
                className={`p-2 rounded-full border transition-colors ${
                  isNotificationsOpen ? "bg-[#F1F5F9] border-[#0EA5A4]/30" : "hover:bg-[#F1F5F9] border-[#E5E7EB]"
                }`}
              >
                <Bell className="w-4 h-4 text-[#0F172A]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#14B8A6] rounded-full border border-white"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-50 p-4"
                    >
                      <h4 className="text-xs font-bold text-[#0F172A] border-b border-[#E5E7EB] pb-2 mb-2 flex items-center justify-between">
                        <span>Platform Alerts</span>
                        <span className="text-[10px] text-[#0EA5A4] hover:underline cursor-pointer">View all</span>
                      </h4>
                      <div className="space-y-2">
                        {notifications.map(notif => (
                          <div key={notif.id} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer flex gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                              notif.type === "success" ? "bg-green-500" :
                              notif.type === "warning" ? "bg-amber-500" : "bg-[#0EA5A4]"
                            }`} />
                            <div>
                              <p className="text-xs font-medium text-[#0F172A]">{notif.text}</p>
                              <span className="text-[9px] text-[#94A3B8]">{notif.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Avatar Circle */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E5E7EB] shrink-0 bg-slate-100 cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </header>

        {/* Dynamic Main Page Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Responsive Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white z-[70] p-6 flex flex-col gap-6 shadow-2xl border-r border-[#E5E7EB] lg:hidden overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 22L12 2L22 22H2Z" fill="#0EA5A4" />
                  </svg>
                  <span className="font-sora font-bold text-[#0F172A]">Travixa Admin</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-[#E5E7EB] rounded-full">
                  <X className="w-4 h-4 text-[#0F172A]" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
                  
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-[#0EA5A4]/10 text-[#0EA5A4] font-semibold" 
                          : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{link.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#0EA5A4]" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-[#E5E7EB] pt-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E7EB]">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Prem Karnawat</p>
                    <p className="text-[10px] text-[#64748B]">Lead Architect</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
