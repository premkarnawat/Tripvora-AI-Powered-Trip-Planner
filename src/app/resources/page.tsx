"use client";

import { 
  BookOpen, Compass, Map, ShieldAlert, Award, 
  HelpCircle, Clipboard, FileText, ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResourcesPage() {
  const categories = [
    {
      title: "Travel Guides",
      icon: Map,
      desc: "Complete regional blueprints including transportation, dining, safety, and cultural etiquette recommendations.",
      items: ["Japan Cherry Blossom Guide 2026", "Amalfi Coast Scenic Road-trips", "Explore Iceland Ring Road Guide"]
    },
    {
      title: "Trip Templates",
      icon: Clipboard,
      desc: "Instant pre-arranged plans crafted by professional trip curators for different travel types.",
      items: ["10-Day Family Bali Resort Plan", "5-Day Adventure Trek in Swiss Alps", "3-Day Budget Weekend in Prague"]
    },
    {
      title: "Hidden Places & Secrets",
      icon: Compass,
      desc: "Secret beaches, private local restaurants, and lesser-known historical viewpoints.",
      items: ["Kyoto's Hidden Bamboo Forests", "Secret lagoons in Azores Islands", "Lesser-known viewpoints in Santorini"]
    },
    {
      title: "Visa & Entry Guides",
      icon: FileText,
      desc: "Everything you need to know about e-visas, entry rules, passport validity, and transit requirements.",
      items: ["Schengen Visa Checklist 2026", "Indonesia Visa on Arrival Rules", "How to apply for Japan eVisa"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black tracking-widest uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Resource Library
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight font-sora mb-3">
            Guides, Templates & Tips
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Browse our curated selection of verified articles, visa blueprints, and templates designed to make travel planning effortless.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => {
            const IconComp = cat.icon;
            return (
              <div 
                key={i} 
                className="bg-white rounded-[32px] p-8 border border-slate-100/80 shadow-[0_4px_25px_rgba(15,23,42,0.01)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold font-sora text-black tracking-tight">{cat.title}</h3>
                  </div>
                  
                  <p className="text-slate-500 text-xs leading-relaxed mb-6 font-semibold">
                    {cat.desc}
                  </p>

                  <div className="space-y-3 mb-6">
                    {cat.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                        <span className="text-xs font-bold text-slate-800">{item}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="bg-slate-50 border border-slate-100 hover:bg-black hover:text-white hover:border-black text-black rounded-xl py-2.5 text-xs font-bold w-fit transition-all">
                  Browse Category
                </Button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
