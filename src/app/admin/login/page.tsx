"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setError(error?.message || "Authentication failed. Invalid credentials.");
        setLoading(false);
        return;
      }

      // Check role
      const role = data.user.user_metadata?.role;
      if (role !== 'admin' && role !== 'super_admin') {
        // Sign out immediately if not admin
        await supabase.auth.signOut();
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.12), transparent 70%)"
      }}
    >
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Back button */}
      <Link href="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
        <ArrowLeft className="w-4 h-4" /> Back to Website
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-[#0D1226]/50 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl space-y-8 relative z-10"
      >
        {/* Shield Icon */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold font-sora tracking-tight text-white">
              Admin Workspace
            </h1>
            <p className="text-slate-400 text-xs font-semibold">
              Authorized personnel only
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-500/30 text-red-200 p-4 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@travixa.ai"
              className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-6 rounded-xl transition-all shadow-[0_4px_14px_rgba(20,184,166,0.2)] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Admin Sign In"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
