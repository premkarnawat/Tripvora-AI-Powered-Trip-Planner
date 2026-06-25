"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Lock, User, Phone, MapPin, Globe, FileText, Check, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AgencyRegisterPage() {
  const [agencyName, setAgencyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      // 1. Sign up user via Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: ownerName,
            role: 'agency'
          }
        }
      });

      if (signUpError) throw signUpError;

      const user = data.user;
      if (!user) throw new Error("Failed to create user account.");

      // 2. Insert profile in public.users table
      const { error: profileError } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email || email,
        full_name: ownerName,
        role: 'agency',
        phone: phone || null,
        subscription_tier: 'Free Tier',
        preferences: { destinations: [], styles: [], foods: [] }
      });

      if (profileError) {
        console.error("Profile creation warning:", profileError.message);
      }

      // 3. Insert agency details in public.agencies table
      const { error: agencyError } = await supabase.from('agencies').insert({
        user_id: user.id,
        agency_name: agencyName,
        owner_name: ownerName,
        business_email: email,
        business_address: address || null,
        phone: phone || null,
        website: website || null,
        gst_number: gstNumber || null,
        subscription_plan: 'Free Tier'
      });

      if (agencyError) {
        throw agencyError;
      }

      // 4. Handle navigation
      if (data.session) {
        // Auto-login succeeds (auto-confirm is active)
        localStorage.setItem("traveler_auth", "true");
        router.push("/agency?welcome=true");
      } else {
        // Requires email verification
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to register agency.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left Column: Premium Branding & Info */}
      <div 
        className="w-full lg:w-[40%] bg-[#0B1329] p-8 lg:p-16 text-white flex flex-col justify-between relative min-h-[300px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-white/5"
        style={{
          backgroundImage: "radial-gradient(circle at 10% 10%, rgba(20, 184, 166, 0.15), transparent 60%)"
        }}
      >
        <div className="space-y-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" fillOpacity="0.8"/>
              <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
            </svg>
            <span className="text-2xl font-bold tracking-tight font-sora text-white">Travixa</span>
          </Link>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl lg:text-4xl font-extrabold font-sora leading-tight"
            >
              Partner with the leading AI-Powered Travel OS.
            </motion.h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Unlock powerful CRM tools, automated package creation, dynamic quotations, client communications via WhatsApp, and live affiliate tracking.
            </p>
          </div>
        </div>

        {/* Bullet points */}
        <div className="mt-8 lg:mt-0 space-y-4">
          {[
            "AI-Automated Travel Packages & Quotes",
            "Full Customer Relationship Management (CRM)",
            "WhatsApp Automation & Templates Integration",
            "Real-time Inventory Injection & Referrals",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-300">
              <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Check className="w-3 h-3" />
              </div>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-2xl bg-[#0D1226]/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl space-y-8 my-8">
          
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-950/40 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto mb-4 animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white font-sora">Registration Successful</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                We've sent a verification link to <span className="text-teal-400 font-semibold">{email}</span>. Please verify your email to access your new agency workspace.
              </p>
              <Button asChild className="mt-6 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-extrabold font-sora tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  Register Your Agency
                </h2>
                <p className="text-slate-400 text-xs font-semibold">
                  Already registered?{" "}
                  <Link href="/login" className="text-teal-400 hover:text-teal-300 underline underline-offset-4">
                    Sign in here
                  </Link>
                </p>
              </div>

              {error && (
                <div className="bg-red-950/30 border border-red-500/30 text-red-200 p-4 rounded-lg flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Agency Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> Agency Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="e.g. Travel Wonders Ltd"
                      className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* Owner Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Owner / Admin Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* Business Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. contact@agency.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-400" /> Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 555-0199"
                      className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400" /> Website URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. https://myagency.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>

                  {/* GST / Business ID */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> GST / Business registration ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="e.g. 22AAAAA0000A1Z5"
                      className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Business Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 Luxury Way, Suite 400"
                    className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-6 rounded-xl transition-all shadow-[0_4px_14px_rgba(20,184,166,0.3)] disabled:opacity-50"
                >
                  {loading ? "Registering Agency..." : "Create Agency Workspace"}
                </Button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
