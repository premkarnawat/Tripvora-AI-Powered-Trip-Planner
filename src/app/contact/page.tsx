"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, MapPin, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => setIsSubmitted(true), 1000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4 font-sans relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black font-sora tracking-tight mb-4">Let's Talk Travel.</h1>
          <p className="text-white/60 font-medium text-lg max-w-2xl">
            Have questions about the Smart Travel OS? Need support for your agency? Or just want to say hi? We're here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form Side */}
          <div className="bg-[#0A0F1D]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold font-sora">Message Sent!</h3>
                <p className="text-white/60 font-medium">We'll get back to you within 24 hours.</p>
                <Button onClick={() => setIsSubmitted(false)} className="mt-4 bg-white/10 text-white hover:bg-white/20">Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full bg-[#121824] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl h-auto">
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Info Side */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Mail className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-sora text-white">Email Us</h3>
                <p className="text-white/50 text-sm mt-1">For general inquiries and support.</p>
                <a href="mailto:hello@trippilot.ai" className="text-teal-400 font-bold text-sm mt-2 block hover:underline">hello@trippilot.ai</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <MessageSquare className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-sora text-white">Live Chat</h3>
                <p className="text-white/50 text-sm mt-1">Available 24/7 for Pro and Agency users.</p>
                <p className="text-teal-400 font-bold text-sm mt-2 cursor-pointer hover:underline">Open Chat Portal</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <MapPin className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-sora text-white">Headquarters</h3>
                <p className="text-white/50 text-sm mt-1 leading-relaxed">
                  123 Innovation Drive<br/>
                  Tech District, CA 94103<br/>
                  United States
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
