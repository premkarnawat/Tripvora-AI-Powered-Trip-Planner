"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Handshake, Globe, Zap, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4 font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <Handshake className="w-3 h-3" /> Partnership Program
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-sora tracking-tight mb-6">Integrate with the Future of Travel.</h1>
            <p className="text-white/60 font-medium text-lg mb-8 leading-relaxed">
              Are you a hotel chain, experience provider, or travel agency? Partner with TripPilot to inject your inventory directly into our AI's decision-making engine. Let our Smart Travel OS recommend your services to thousands of active planners.
            </p>
            <div className="flex gap-4">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-8 py-6 rounded-xl text-sm">
                Apply for Partnership
              </Button>
              <Button className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-6 rounded-xl text-sm border border-white/10">
                View API Docs
              </Button>
            </div>
          </div>
          
          <div className="relative">
            {/* Abstract visual representation of API / Partner integration */}
            <div className="w-full aspect-square max-w-md mx-auto bg-gradient-to-tr from-teal-500/20 to-purple-500/20 rounded-full blur-3xl absolute inset-0" />
            <div className="relative bg-[#0A0F1D]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Your Inventory API</p>
                      <p className="text-[10px] text-white/50">24ms Response Time</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                
                <div className="flex justify-center py-2">
                  <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                </div>

                <div className="flex items-center justify-between p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-teal-100">TripPilot AI Engine</p>
                      <p className="text-[10px] text-teal-400">Processing Match...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0A0F1D]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold font-sora mb-3">Seamless Integration</h3>
            <p className="text-sm text-white/60 leading-relaxed">Connect your existing booking engine via our standard REST APIs. Our AI automatically maps your inventory to user preferences.</p>
          </div>
          <div className="bg-[#0A0F1D]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold font-sora mb-3">Priority Ranking</h3>
            <p className="text-sm text-white/60 leading-relaxed">Official partners receive a 'Verified Partner' badge and priority injection into AI-generated itineraries matching their criteria.</p>
          </div>
          <div className="bg-[#0A0F1D]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold font-sora mb-3">Analytics Dashboard</h3>
            <p className="text-sm text-white/60 leading-relaxed">Track exactly how many itineraries your business was recommended in, click-through rates, and total generated revenue.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
