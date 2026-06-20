"use client";

import { useState } from "react";
import { LayoutTemplate, Plus, Search, Filter, Edit2, Eye, Calendar, Globe, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const pages = [
  { id: "P-01", title: "Home Page", url: "/", status: "Published", lastEdited: "2 hours ago", author: "Prem Karnawat" },
  { id: "P-02", title: "For Agencies", url: "/agencies", status: "Published", lastEdited: "1 day ago", author: "David Smith" },
  { id: "P-03", title: "Pricing", url: "/pricing", status: "Published", lastEdited: "3 days ago", author: "Prem Karnawat" },
  { id: "P-04", title: "Marketplace", url: "/marketplace", status: "Published", lastEdited: "1 week ago", author: "System" },
  { id: "P-05", title: "About Us", url: "/about", status: "Draft", lastEdited: "2 hours ago", author: "Prem Karnawat" },
  { id: "P-06", title: "Contact Us", url: "/contact", status: "Scheduled", lastEdited: "1 day ago", author: "David Smith" },
];

export default function CMSPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {!isEditorOpen ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Content Management System
              </h1>
              <p className="text-xs text-[#94A3B8] mt-1">Manage and edit all public-facing website pages without code changes.</p>
            </div>
            <div className="flex gap-2">
              <Button className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all">
                <Plus className="w-4 h-4 mr-2" /> Create New Page
              </Button>
            </div>
          </div>

          <div className="bg-[#0B1220] border border-white/5 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#020817]/50">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input 
                  type="text" 
                  placeholder="Search pages by title or URL..." 
                  className="w-full bg-[#020817] border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>
              <Button className="h-9 font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10 transition-colors">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#020817] border-b border-white/5">
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Page Title</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">URL Slug</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Last Edited</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pages.map((page, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <LayoutTemplate className="w-4 h-4 text-[#94A3B8]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{page.title}</p>
                            <p className="text-[10px] text-[#94A3B8]">{page.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-[#38BDF8]">{page.url}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center w-max gap-1 ${
                          page.status === "Published" ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" :
                          page.status === "Draft" ? "bg-white/5 text-[#94A3B8] border-white/10" :
                          "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                        }`}>
                          {page.status === "Published" && <CheckCircle2 className="w-3 h-3" />}
                          {page.status === "Scheduled" && <Calendar className="w-3 h-3" />}
                          {page.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[#94A3B8]">{page.lastEdited}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ActionBtn icon={Globe} tooltip="View Live" />
                          <ActionBtn icon={Edit2} tooltip="Edit Page Blocks" onClick={() => setIsEditorOpen(true)} />
                          <ActionBtn icon={Trash2} tooltip="Delete" color="hover:text-red-400" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* CMS Page Builder View */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsEditorOpen(false)} className="text-[#94A3B8] hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Edit Home Page</h1>
                <p className="text-[10px] font-mono text-[#38BDF8]">https://trippilot.in/</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditorOpen(false)} className="h-9 font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
                Save Draft
              </Button>
              <Button onClick={() => setIsEditorOpen(false)} className="h-9 font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20">
                <Calendar className="w-4 h-4 mr-2" /> Schedule
              </Button>
              <Button onClick={() => setIsEditorOpen(false)} className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                Publish Changes
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Page Blocks Editor */}
            <div className="flex-1 space-y-4">
              <h3 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-1">Page Blocks</h3>
              
              <div className="bg-[#0B1220] border border-[#14B8A6]/30 rounded-xl p-4 relative group cursor-pointer hover:border-[#14B8A6] transition-colors">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center"><Edit2 className="w-3 h-3" /></button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]"><LayoutTemplate className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Hero Section</h4>
                    <p className="text-[10px] text-[#94A3B8]">Main headline, subtitle, CTA, and background video.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0B1220] border border-white/10 rounded-xl p-4 relative group cursor-pointer hover:border-white/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white/50"><LayoutTemplate className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Features Grid</h4>
                    <p className="text-[10px] text-[#94A3B8]">3x2 grid showing main platform benefits.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0B1220] border border-white/10 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-[#94A3B8] hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-sm font-bold">Add New Block</span>
              </div>
            </div>

            {/* Sidebar Settings */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              <div className="bg-[#0B1220] border border-white/5 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Page Settings</h3>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Page Title</label>
                  <input type="text" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-xs text-white focus:outline-none focus:border-[#14B8A6]" defaultValue="Home Page" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">URL Slug</label>
                  <input type="text" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-xs font-mono text-[#38BDF8] focus:outline-none focus:border-[#14B8A6]" defaultValue="/" />
                </div>
              </div>

              <div className="bg-[#0B1220] border border-white/5 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">SEO Meta Data</h3>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Meta Title</label>
                  <input type="text" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-xs text-white focus:outline-none focus:border-[#14B8A6]" defaultValue="TripPilot - The Ultimate Travel OS" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Meta Description</label>
                  <textarea rows={4} className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-xs text-white focus:outline-none focus:border-[#14B8A6]" defaultValue="TripPilot combines an AI Travel Planner with a powerful Agency CRM. Generate leads and close bookings faster." />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function ActionBtn({ icon: Icon, tooltip, color, onClick }: any) {
  return (
    <button title={tooltip} onClick={onClick} className={`w-8 h-8 rounded flex items-center justify-center text-[#94A3B8] hover:bg-white/5 transition-colors ${color || "hover:text-white"}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}
