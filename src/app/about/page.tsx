"use client";

import { 
  Info, Sparkles, Globe, Heart, Check, Users 
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 mt-12 space-y-20">
        
        {/* Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black tracking-widest uppercase mb-4">
              <Info className="w-3.5 h-3.5" /> Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-sora leading-tight mb-6">
              Redefining Travel Planning
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4 font-semibold">
              At Travixa, we believe that the journey should be as enjoyable as the destination itself. For too long, planning a trip has been a fragmented, overwhelming process involving dozens of tabs and endless research.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-semibold">
              We've built a premium AI-powered ecosystem that understands your unique travel style, budget, and desires, crafting bespoke itineraries in seconds. It's like having a world-class travel concierge in your pocket.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/5 rounded-full blur-[100px] -z-10" />
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-black text-sm">AI-Powered</div>
                    <div className="text-xs text-slate-400 font-semibold">Smart recommendations</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-black text-sm">Global Reach</div>
                    <div className="text-xs text-slate-400 font-semibold">Any destination worldwide</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-black text-sm">Curated with Love</div>
                    <div className="text-xs text-slate-400 font-semibold">Passionate travel experts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-black font-sora tracking-tight mb-3">Meet the Team</h2>
            <p className="text-slate-500 text-xs font-semibold max-w-2xl mx-auto">
              We are a group of developers, designers, and explorers passionate about building the future of travel.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Founder & CEO", initials: "SC", color: "bg-teal-50 text-teal-700" },
              { name: "David Miller", role: "Head of AI", initials: "DM", color: "bg-teal-50 text-teal-700" },
              { name: "Priya Sharma", role: "Lead Designer", initials: "PS", color: "bg-teal-50 text-teal-700" },
            ].map(member => (
              <div key={member.name} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center group hover:y-[-2px] transition-all">
                <div className={`w-20 h-20 mx-auto rounded-full ${member.color} flex items-center justify-center text-xl font-bold shadow-sm mb-4`}>
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-black font-sora">{member.name}</h3>
                <p className="text-teal-600 text-xs font-semibold mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
