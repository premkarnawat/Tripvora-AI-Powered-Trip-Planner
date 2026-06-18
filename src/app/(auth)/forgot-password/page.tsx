"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Mock sending email
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-[#030712] to-[#030712] pointer-events-none" />
      <div className="absolute -left-[20%] top-[20%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        <Link href="/login" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="bg-[#0A0F1D]/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 shadow-2xl">
          
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-teal-400" />
              </div>
              <h2 className="text-2xl font-black text-white font-sora">Check your email</h2>
              <p className="text-sm text-white/60 font-medium">
                We've sent a password reset link to <br/> <span className="text-white font-bold">{email}</span>
              </p>
              <Button onClick={() => setIsSubmitted(false)} className="mt-8 bg-white/5 hover:bg-white/10 text-white font-bold w-full rounded-xl border border-white/10">
                Try another email
              </Button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6">
                <KeyRound className="w-6 h-6 text-teal-400" />
              </div>
              
              <h2 className="text-2xl font-black text-white font-sora mb-2">Reset Password</h2>
              <p className="text-sm text-white/50 font-medium mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-white/70 block mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-white/30" />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#121824] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl h-auto">
                  Send Reset Link
                </Button>
              </form>
            </>
          )}

        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-white/40 font-medium">
            Don't have an account? <Link href="/signup" className="text-white font-bold hover:underline">Sign up</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
