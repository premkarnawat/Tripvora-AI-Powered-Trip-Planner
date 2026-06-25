"use client";

import { useState } from "react";
import { Scale, Edit2, Eye, History, CheckCircle2, ChevronRight, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";

const legalPages = [
  { id: "L-1", name: "Terms & Conditions", status: "Published", lastUpdated: "Oct 15, 2026", version: "v2.4" },
  { id: "L-2", name: "Privacy Policy", status: "Published", lastUpdated: "Sep 20, 2026", version: "v1.8" },
  { id: "L-3", name: "Refund Policy", status: "Draft", lastUpdated: "2 hours ago", version: "v1.2 (Draft)" },
  { id: "L-4", name: "Cancellation Policy", status: "Published", lastUpdated: "Jan 10, 2026", version: "v1.0" },
  { id: "L-5", name: "Cookie Policy", status: "Published", lastUpdated: "Jan 10, 2026", version: "v1.0" },
  { id: "L-6", name: "Disclaimer", status: "Published", lastUpdated: "Jan 10, 2026", version: "v1.0" },
];

export default function LegalPagesManager() {
  const [activePage, setActivePage] = useState<string | null>(null);

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 pb-10">
      
      {!activePage ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Legal Documents
              </h1>
              <p className="text-xs text-[#94A3B8] mt-1">Manage public-facing legal and compliance pages for Travixa.</p>
            </div>
          </div>

          {/* Legal Pages List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalPages.map((page, i) => (
              <div key={i} className="bg-[#0B1220] border border-white/5 rounded-xl p-5 group hover:border-white/20 transition-all flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#94A3B8] mb-4">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{page.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      page.status === "Published" ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                    }`}>
                      {page.status}
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8]">{page.version}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-[#94A3B8]">Updated {page.lastUpdated}</span>
                  <button onClick={() => setActivePage(page.name)} className="text-xs font-bold text-[#14B8A6] flex items-center gap-1 group-hover:gap-2 transition-all">
                    Edit Document <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Document Editor View */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setActivePage(null)} className="text-[#94A3B8] hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-[#14B8A6]" /> Edit {activePage}
                </h1>
                <p className="text-[10px] font-mono text-[#38BDF8] mt-1">Status: Editing Draft (v1.3)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setActivePage(null)} className="h-9 font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
                <Eye className="w-4 h-4 mr-2" /> Preview
              </Button>
              <Button onClick={() => setActivePage(null)} className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Publish Version
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Editor */}
            <div className="flex-1 space-y-4">
              <div className="w-full bg-[#0B1220] border border-white/5 rounded-xl p-4 flex flex-col min-h-[600px]">
                {/* Formatting Toolbar */}
                <div className="flex gap-2 border-b border-white/10 pb-4 mb-4">
                  <div className="flex bg-[#020817] border border-white/10 rounded overflow-hidden">
                    <button className="px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 border-r border-white/10">H1</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 border-r border-white/10">H2</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 border-r border-white/10">B</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 italic">I</button>
                  </div>
                </div>
                {/* Text Area */}
                <textarea 
                  className="flex-1 w-full bg-transparent border-none text-sm text-white resize-none focus:outline-none custom-scrollbar leading-relaxed font-mono"
                  defaultValue={`1. ACCEPTANCE OF TERMS

By accessing or using the Travixa Platform, you agree to be bound by these Terms and Conditions.

2. DEFINITIONS

"Platform" means the Travixa software, website, and associated services.
"User" means any individual or entity utilizing the Platform, including Travelers and Agencies.`}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              <div className="bg-[#0B1220] border border-white/5 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#14B8A6]" /> Version History
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <span className="text-xs font-bold text-white">v1.2 (Current)</span>
                      <p className="text-[10px] text-[#94A3B8]">Published Oct 15, 2026</p>
                    </div>
                    <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-white/[0.02] cursor-pointer transition-colors">
                    <div>
                      <span className="text-xs font-bold text-white/60">v1.1</span>
                      <p className="text-[10px] text-[#94A3B8]">Published Sep 1, 2026</p>
                    </div>
                    <button className="text-[10px] font-bold text-[#14B8A6] hover:underline">Restore</button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-white/[0.02] cursor-pointer transition-colors">
                    <div>
                      <span className="text-xs font-bold text-white/60">v1.0</span>
                      <p className="text-[10px] text-[#94A3B8]">Published Jan 10, 2026</p>
                    </div>
                    <button className="text-[10px] font-bold text-[#14B8A6] hover:underline">Restore</button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
