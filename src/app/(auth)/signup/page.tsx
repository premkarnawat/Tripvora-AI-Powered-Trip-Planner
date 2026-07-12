"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
};

function validatePassword(pw: string): string | null {
  if (pw.length < PASSWORD_RULES.minLength) {
    return `Password must be at least ${PASSWORD_RULES.minLength} characters.`;
  }
  if (!PASSWORD_RULES.hasUppercase.test(pw)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!PASSWORD_RULES.hasNumber.test(pw)) {
    return "Password must contain at least one number.";
  }
  return null;
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"traveler" | "agency">("traveler");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Enforce password policy client-side (Supabase enforces server-side too)
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Sanitize name input
    const sanitizedName = name.trim();
    if (sanitizedName.length < 1 || sanitizedName.length > 200) {
      setError("Please enter a valid name.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: sanitizedName,
            role: accountType,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to create account.");
        setLoading(false);
        return;
      }

      if (!data?.user) {
        setError("Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      // Attempt to create profile row — non-blocking for UX but we log the error
      try {
        await supabase.from("users").upsert({
          id: data.user.id,
          email: data.user.email || email,
          full_name: sanitizedName,
          role: accountType,
          subscription_tier: accountType === "agency" ? "Partner Tier" : "Free Tier",
          preferences: { destinations: [], styles: [], foods: [] },
        });
      } catch {
        // Profile creation failure is non-fatal; user can complete profile later
      }

      // Show email verification screen — do NOT auto-redirect
      setSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message || "Google sign-up failed.");
        setLoading(false);
      }
      // Browser will redirect to Google — no further action needed
    } catch {
      setError("Failed to initiate Google sign-up.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left Column: Deep Navy */}
      <div 
        className="w-full md:w-[45%] bg-[#0B1329] p-8 md:p-16 text-white flex flex-col justify-between relative min-h-[350px] md:min-h-screen"
        style={{
          backgroundImage: "radial-gradient(circle at 10% 10%, rgba(20, 184, 166, 0.15), transparent 60%)"
        }}
      >
        <div>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-16 md:mb-24">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22L12 2L22 22H2Z" fill="#14B8A6" fillOpacity="0.8"/>
              <path d="M12 2L2 22H12V2Z" fill="#38BDF8"/>
            </svg>
            <span className="text-xl font-bold tracking-tight font-sora text-white">Travixa</span>
          </Link>
          
          <motion.h3 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-extrabold font-sora leading-[1.2] mb-6 max-w-sm"
          >
            &quot;Your next journey starts here.&quot;
          </motion.h3>
          
          {/* Avatar list */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B1329]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="user" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B1329]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="user" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0B1329]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="user" />
            </div>
            <span className="text-xs font-semibold text-slate-300">Joined by 10,000+ travelers</span>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 font-medium">
          © {new Date().getFullYear()} Travixa Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="max-w-sm w-full mx-auto">
          
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-teal-500/10 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-black mb-2">Check your email</h2>
              <p className="text-slate-500 text-xs leading-relaxed mb-8">
                We&apos;ve sent a confirmation link to <span className="font-bold text-black">{email}</span>. Please verify your email to continue.
              </p>
              <Link 
                href="/login" 
                className="inline-block w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-black hover:bg-slate-900 transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-black text-black tracking-tight mb-2">Create Account</h1>
              <p className="text-slate-500 text-xs mb-6 font-medium">Begin crafting your bespoke global travel experiences.</p>
              
              {/* Tabs */}
              <div className="flex border-b border-slate-100 mb-6">
                <Link href="/login" className="flex-1 text-center py-2 text-xs font-bold text-slate-400 hover:text-black transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="flex-1 text-center py-2 text-xs font-bold text-black border-b-2 border-black">
                  Sign Up
                </Link>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                
                {/* Google Login */}
                <button 
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="text-center text-[10px] font-black text-slate-300 tracking-wider my-3 uppercase">
                  OR
                </div>

                {/* Account Type Toggle */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-700 mb-2 block">Account Type</label>
                  <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setAccountType('traveler')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${accountType === 'traveler' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-black'}`}
                    >
                      Traveler
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('agency')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${accountType === 'agency' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-black'}`}
                    >
                      Agency / Partner
                    </button>
                  </div>
                </div>

                {/* Full Name Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full Name</label>
                  <input 
                    type="text" 
                    required
                    maxLength={200}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@luxury.com" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs text-slate-800 focus:outline-none focus:border-black focus:bg-white transition-all font-medium pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 bottom-3.5 text-slate-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength hints */}
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${password.length >= 8 ? 'text-teal-500' : 'text-slate-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${PASSWORD_RULES.hasUppercase.test(password) ? 'text-teal-500' : 'text-slate-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${PASSWORD_RULES.hasNumber.test(password) ? 'text-teal-500' : 'text-slate-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>One number</span>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-black/90 text-white rounded-xl py-3 text-xs font-bold transition-all shadow-md mt-4 border-none h-11"
                >
                  {loading ? "Creating Account..." : "Continue"}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-6 text-[10px] text-slate-400 font-bold mt-12 md:mt-0">
          <span className="hover:text-black cursor-pointer">Privacy Policy</span>
          <span className="hover:text-black cursor-pointer">Terms of Service</span>
          <span className="hover:text-black cursor-pointer">Need help?</span>
        </div>
      </div>
    </div>
  );
}
