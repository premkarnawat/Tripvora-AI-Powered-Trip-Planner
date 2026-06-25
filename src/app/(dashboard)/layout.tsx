"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Compass, Map, Bookmark, Store, Percent, MapPin, 
  UserCheck, BookOpen, Shield, CreditCard, LifeBuoy, Settings, LogOut,
  Menu, X, Bell, Search, Plus, Sparkles, ChevronRight, History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Trips", href: "/saved-trips", icon: Compass },
  { name: "Saved Trips", href: "/bookmarks", icon: Bookmark },
  { name: "Destinations", href: "/destinations", icon: MapPin },
  { name: "Marketplace", href: "/marketplace", icon: Store },
  { name: "Offers", href: "/offers", icon: Percent },
  { name: "Travel Journal", href: "/community", icon: BookOpen },
  { name: "Trip History", href: "/dashboard/history", icon: History },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Support", href: "/help", icon: LifeBuoy },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const isAuthed = localStorage.getItem("traveler_auth") === "true";
    if (!isAuthed) {
      router.push("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    document.cookie = "travixa_role=; path=/; max-age=0";
    localStorage.removeItem("traveler_auth");
    localStorage.removeItem("travixa_role");
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {}
    router.push("/login");
  };

  // Mock Notifications for traveler
  const notifications = [
    { id: 1, text: "AI generated new options for your Goa trip", time: "5m ago" },
    { id: 2, text: "Hotel voucher for 'The Leela Goa' uploaded", time: "1h ago" },
    { id: 3, text: "Flight prices for Delhi -> Goa dropped 8%", time: "3h ago" }
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#14B8A6] rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-bold">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="traveler-theme min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased relative z-50">
      
      {/* Top Traveler Header */}
      <header className="sticky top-0 left-0 right-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between">
        
        {/* Left Side: Logo & Main Navigation links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" />
              <path d="M12 2L2 22H12V2Z" fill="#38BDF8" />
            </svg>
            <span className="text-lg font-bold font-sora tracking-tight text-[#0F172A]">Travixa</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#64748B] uppercase tracking-wider">
            <Link href="/explore" className="hover:text-[#0F172A] transition-colors">Discover</Link>
            <Link href="/trips" className="hover:text-[#0F172A] transition-colors">Itineraries</Link>
            <Link href="/partner" className="hover:text-[#0F172A] transition-colors">Concierge</Link>
            <Link href="/dashboard/vault" className="hover:text-[#0F172A] transition-colors">Vault</Link>
          </nav>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input 
            type="text" 
            placeholder="Search trips, places, bookings..." 
            className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#14B8A6] transition-all"
          />
        </div>

        {/* Right Side: Notification, profile circle, CTA Plan Trip */}
        <div className="flex items-center gap-4">
          
          {/* Notification Button */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2 rounded-full border transition-colors ${
                isNotificationsOpen ? "bg-[#F1F5F9] border-[#14B8A6]/30" : "hover:bg-[#F1F5F9] border-[#E5E7EB]"
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
                      <span>Travel Alerts</span>
                      <span className="text-[10px] text-[#14B8A6] hover:underline cursor-pointer">View all</span>
                    </h4>
                    <div className="space-y-2">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-[#0F172A]">{notif.text}</p>
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

          {/* User Profile Avatar Link */}
          <Link href="/settings">
            <div className="w-8 h-8 rounded-full border border-[#E5E7EB] overflow-hidden bg-slate-100 cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Plan Trip CTA */}
          <Link href="/trip-planner" className="hidden sm:block">
            <button className="flex items-center gap-1 px-4 py-2 bg-[#0F172A] hover:bg-[#0F172A]/90 text-white rounded-full text-xs font-bold shadow-sm transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span>Plan Trip</span>
            </button>
          </Link>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-full border border-[#E5E7EB] hover:bg-[#F1F5F9] transition-colors lg:hidden"
          >
            <Menu className="w-4 h-4 text-[#0F172A]" />
          </button>

        </div>
      </header>

      {/* Main Split Layout */}
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row relative">
        
        {/* Desktop Fixed Left Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#E5E7EB] sticky top-16 h-[calc(100vh-4rem)] p-4 justify-between shrink-0">
          
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
            
            {/* User details active widget */}
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E5E7EB] shrink-0 bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                  alt="Julian Thorne"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0F172A] truncate">Prem Karnawat</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span>
                  <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider leading-none">AI Concierge Active</span>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <nav className="space-y-0.5">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
                
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all group ${
                      isActive 
                        ? "bg-[#14B8A6]/10 text-[#14B8A6] font-extrabold" 
                        : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-[#14B8A6]" : "text-[#64748B] group-hover:text-[#0F172A]"
                      }`} />
                      <span>{link.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#14B8A6]" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout Action at bottom */}
          <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[#DC2626] hover:bg-red-50 transition-all shrink-0 mt-4 border-t border-[#E5E7EB] pt-4 w-full text-left">
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>

        </aside>

        {/* Dynamic content view */}
        <main className="flex-1 w-full relative z-10 p-6 md:p-8 lg:p-10">
          {children}
        </main>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed top-0 bottom-0 right-0 w-72 bg-white z-[70] p-6 flex flex-col justify-between shadow-2xl border-l border-[#E5E7EB] lg:hidden overflow-y-auto custom-scrollbar"
            >
              <div className="space-y-6 flex-grow">
                <div className="flex justify-between items-center shrink-0">
                  <span className="font-sora font-bold text-base text-[#0F172A]">Menu Navigation</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 border border-[#E5E7EB] rounded-full">
                    <X className="w-4 h-4 text-[#0F172A]" />
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E5E7EB] shrink-0 bg-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                      alt="Julian Thorne"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Prem Karnawat</p>
                    <p className="text-[9px] text-[#64748B]">AI Concierge Active</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
                    
                    return (
                      <Link 
                        key={link.name} 
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                          isActive 
                            ? "bg-[#14B8A6]/10 text-[#14B8A6] font-extrabold" 
                            : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4.5 h-4.5" />
                          <span>{link.name}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#14B8A6]" />}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-[#DC2626] hover:bg-red-50 transition-all shrink-0 mt-4 border-t border-[#E5E7EB] pt-4 w-full text-left">
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>

            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
