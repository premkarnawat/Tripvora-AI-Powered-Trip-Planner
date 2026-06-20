"use client";

import { useState } from "react";
import { 
  LayoutTemplate, Plus, Search, Filter, Edit2, 
  Eye, Calendar, Globe, Trash2, CheckCircle2, Save, X
} from "lucide-react";

// Mock website pages data
const pagesData = [
  { id: "P-01", title: "Homepage", url: "/", status: "Published", lastEdited: "2 hours ago", author: "Prem Karnawat" },
  { id: "P-02", title: "About Us", url: "/about", status: "Published", lastEdited: "1 day ago", author: "Prem Karnawat" },
  { id: "P-03", title: "Pricing", url: "/pricing", status: "Published", lastEdited: "3 days ago", author: "System" },
  { id: "P-04", title: "FAQ", url: "/faq", status: "Draft", lastEdited: "1 week ago", author: "David Smith" },
  { id: "P-05", title: "Terms & Conditions", url: "/terms", status: "Published", lastEdited: "2 weeks ago", author: "System" },
  { id: "P-06", title: "Privacy Policy", url: "/privacy", status: "Published", lastEdited: "2 weeks ago", author: "System" },
  { id: "P-07", title: "Contact Us", url: "/contact", status: "Published", lastEdited: "3 weeks ago", author: "David Smith" }
];

export default function CMSPage() {
  const [pages, setPages] = useState(pagesData);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);

  const handleEditPage = (page: any) => {
    setSelectedPage(page);
    setIsEditorOpen(true);
  };

  const handleSavePage = () => {
    setIsEditorOpen(false);
    setSelectedPage(null);
  };

  return (
    <div className="space-y-8">
      
      {!isEditorOpen ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-1">Content Manager</h2>
              <h1 className="text-3xl font-bold font-sora text-[#0F172A]">Website Pages CMS</h1>
              <p className="text-sm text-[#64748B] mt-1">Manage and edit all public-facing website pages and block content without code changes.</p>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto">
              <Plus className="w-4 h-4" />
              <span>Create New Page</span>
            </button>
          </div>

          {/* Search bar & filter */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex justify-between items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input 
                type="text" 
                placeholder="Search pages by title or slug..." 
                className="w-full bg-[#F1F5F9] border border-transparent rounded-full py-1.5 pl-9 pr-4 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all"
              />
            </div>
            <button className="h-9 px-4 font-bold bg-[#F1F5F9] hover:bg-slate-200 text-[#0F172A] border-none rounded-full text-xs transition-colors flex items-center gap-1">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* Table Grid list */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-slate-50 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                    <th className="p-4 font-normal">Page Title</th>
                    <th className="p-4 font-normal">URL Slug</th>
                    <th className="p-4 font-normal">Status</th>
                    <th className="p-4 font-normal">Last Edited</th>
                    <th className="p-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50 text-xs font-semibold text-[#0F172A]">
                  {pages.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#0EA5A4]/10 border border-[#0EA5A4]/25 flex items-center justify-center shrink-0">
                            <LayoutTemplate className="w-4 h-4 text-[#0EA5A4]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0F172A]">{p.title}</p>
                            <p className="text-[10px] text-[#64748B]">{p.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[#0EA5A4]">{p.url}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border flex items-center w-max gap-1 ${
                          p.status === "Published" ? "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/25" : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {p.status === "Published" && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[#94A3B8]">{p.lastEdited}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[#64748B]" title="View live Page">
                            <Globe className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditPage(p)}
                            className="p-1.5 bg-[#0EA5A4]/10 hover:bg-[#0EA5A4]/20 border border-[#0EA5A4]/25 rounded text-[#0EA5A4]" 
                            title="Edit Blocks"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
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
        /* Block builder view */
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header editor */}
          <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[#64748B] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xl font-bold font-sora text-[#0F172A]">Edit: {selectedPage.title}</h1>
                <p className="text-xs font-mono text-[#0EA5A4]">{selectedPage.url}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleSavePage}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0F172A] rounded-full text-xs font-bold transition-all"
              >
                Save Draft
              </button>
              <button 
                onClick={handleSavePage}
                className="px-4 py-2 bg-[#0EA5A4] hover:bg-[#0EA5A4]/90 text-white rounded-full text-xs font-bold shadow-sm transition-all"
              >
                Publish Changes
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Block builder cards list */}
            <div className="flex-1 space-y-4">
              <h3 className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest px-1">Interactive Page Blocks</h3>
              
              <div className="bg-white border-2 border-[#0EA5A4] rounded-2xl p-4 relative group hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0EA5A4]/10 flex items-center justify-center text-[#0EA5A4] shrink-0">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">Hero Banner Block</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">Title headline, subtitle, search bar placeholder and cover video.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 relative group hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">Top Destinations Block</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">3-card carousel linking to top verified wikis.</p>
                  </div>
                </div>
              </div>

              <div className="border border-dashed border-slate-300 hover:border-[#0EA5A4] rounded-2xl p-6 flex flex-col items-center justify-center text-[#64748B] hover:text-[#0EA5A4] hover:bg-[#0EA5A4]/5 cursor-pointer transition-all">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Add Custom Block Section</span>
              </div>
            </div>

            {/* Sidebar metadata editor */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              
              {/* Settings block */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold font-sora text-[#0F172A] border-b border-slate-100 pb-2">Page Properties</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Page Title</label>
                  <input type="text" className="w-full bg-[#F1F5F9] border border-transparent rounded-lg py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all" defaultValue={selectedPage.title} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">URL Slug</label>
                  <input type="text" className="w-full bg-[#F1F5F9] border border-transparent rounded-lg py-2 px-3 text-xs font-mono text-[#0EA5A4] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all" defaultValue={selectedPage.url} />
                </div>
              </div>

              {/* SEO metadata */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold font-sora text-[#0F172A] border-b border-slate-100 pb-2">SEO Configurations</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Meta Title</label>
                  <input type="text" className="w-full bg-[#F1F5F9] border border-transparent rounded-lg py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all" defaultValue={`${selectedPage.title} | TripPilot`} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Meta Description</label>
                  <textarea rows={4} className="w-full bg-[#F1F5F9] border border-transparent rounded-lg py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#0EA5A4] transition-all resize-none" defaultValue="Configure page blocks description metrics." />
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
