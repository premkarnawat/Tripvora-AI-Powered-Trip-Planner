"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Info, Sparkles, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="About Tripvora" 
        description="Our mission is to make travel planning effortless, personalized, and magical using AI."
        icon={Info}
      />
      
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 mt-12 space-y-24">
        
        {/* Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div>
              <h2 className="text-3xl font-bold text-white font-sora mb-6">Redefining Travel</h2>
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                 At Tripvora, we believe that the journey should be as enjoyable as the destination itself. For too long, planning a trip has been a fragmented, overwhelming process involving dozens of tabs and endless research.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                 We've built an AI-powered ecosystem that understands your unique travel style, budget, and desires, crafting bespoke itineraries in seconds. It's like having a world-class travel agent in your pocket.
              </p>
           </div>
           <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] -z-10" />
              <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                 <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-primary" />
                       </div>
                       <div>
                          <div className="font-bold text-white">AI-Powered</div>
                          <div className="text-sm text-white/50">Smart recommendations</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <Globe className="w-6 h-6 text-indigo-400" />
                       </div>
                       <div>
                          <div className="font-bold text-white">Global Reach</div>
                          <div className="text-sm text-white/50">Any destination worldwide</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-rose-400" />
                       </div>
                       <div>
                          <div className="font-bold text-white">Curated with Love</div>
                          <div className="text-sm text-white/50">Passionate travel experts</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Team Section */}
        <section>
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white font-sora mb-4">Meet the Team</h2>
              <p className="text-white/60 max-w-2xl mx-auto">We are a group of developers, designers, and explorers passionate about building the future of travel.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                 { name: "Sarah Chen", role: "Founder & CEO", initials: "SC", color: "from-blue-500 to-indigo-500" },
                 { name: "David Miller", role: "Head of AI", initials: "DM", color: "from-emerald-500 to-teal-500" },
                 { name: "Priya Sharma", role: "Lead Designer", initials: "PS", color: "from-rose-500 to-pink-500" },
              ].map(member => (
                 <div key={member.name} className="glass-card p-6 rounded-3xl border border-white/5 text-center group hover:bg-white/5 transition-colors">
                    <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-2xl font-bold text-white shadow-xl mb-4 group-hover:scale-110 transition-transform`}>
                       {member.initials}
                    </div>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
                 </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
}
