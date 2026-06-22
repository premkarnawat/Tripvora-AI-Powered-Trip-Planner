"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Compass, PlusCircle, Users, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const isAuthPage = pathname ? (
    pathname.startsWith("/login") || 
    pathname.startsWith("/signup") || 
    pathname.startsWith("/agency") || 
    pathname.startsWith("/admin") || 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/trips") || 
    pathname.startsWith("/trip-planner") ||
    pathname.startsWith("/saved-trips") ||
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/help")
  ) : false;
  
  if (isAuthPage) return null;
  
  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/plan", icon: PlusCircle, label: "Plan", primary: true },
    { href: "/community", icon: Users, label: "Community" },
    { href: "/dashboard", icon: User, label: "Dashboard" },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden"
    >
      <div className="bg-[#0B1329] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pb-safe pb-4 pt-3 px-2 flex items-center justify-around rounded-t-3xl">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          if (link.primary) {
            return (
              <Link key={link.href} href={link.href} className="relative -top-6">
                <div className="bg-primary p-4 rounded-full shadow-[0_10px_25px_rgba(20,184,166,0.5)] flex items-center justify-center transition-transform active:scale-95 border-4 border-[#0B1329]">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </Link>
            );
          }
          
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 p-2 transition-transform active:scale-95">
              <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-white/60")} />
              <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-white/60")}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
