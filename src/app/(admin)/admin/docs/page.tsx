"use client";

import { useState } from "react";
import { FileText, Plus, Search, Filter, Edit2, Trash2, Eye, LayoutTemplate, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const docs = [
  { id: "D-101", title: "Getting Started with Agency CRM", category: "Agency CRM Guides", status: "Published", views: "1.2k", date: "Oct 15, 2026" },
  { id: "D-102", title: "How to Configure WhatsApp Automation", category: "Setup Guides", status: "Published", views: "850", date: "Oct 12, 2026" },
  { id: "D-103", title: "Building your first AI Package", category: "Tutorials", status: "Draft", views: "0", date: "Oct 10, 2026" },
  { id: "D-104", title: "Understanding the Dual-Engine Cost Builder", category: "Agency CRM Guides", status: "Published", views: "2.1k", date: "Sep 28, 2026" },
];

export default function DocumentationPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {!isEditorOpen ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Documentation Manager
              </h1>
              <p className="text-xs text-[#94A3B8] mt-1">Create and manage guides, tutorials, and setup articles.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditorOpen(true)} className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all">
                <Plus className="w-4 h-4 mr-2" /> Write Article
              </Button>
            </div>
          </div>

          {/* Docs Table */}
          <div className="bg-[#0B1220] border border-white/5 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#020817]/50">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
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
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Title</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Category</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Views</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Date</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {docs.map((doc, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-[#94A3B8]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{doc.title}</p>
                            <p className="text-[10px] text-[#94A3B8]">{doc.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-[#94A3B8]">{doc.category}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          doc.status === "Published" ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" : "bg-white/5 text-[#94A3B8] border-white/10"
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[#94A3B8]">{doc.views}</td>
                      <td className="p-4 text-xs text-[#94A3B8]">{doc.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ActionBtn icon={Eye} tooltip="Preview" />
                          <ActionBtn icon={Edit2} tooltip="Edit" onClick={() => setIsEditorOpen(true)} />
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
        /* Document Editor View */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsEditorOpen(false)} className="text-[#94A3B8] hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <h1 className="text-xl font-bold text-white">Edit Article</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditorOpen(false)} className="h-9 font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">
                Save Draft
              </Button>
              <Button onClick={() => setIsEditorOpen(false)} className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                Publish Article
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Main Editor */}
            <div className="flex-1 space-y-6">
              <div className="bg-[#0B1220] border border-white/5 rounded-xl p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Article Title</label>
                  <input type="text" placeholder="Enter a descriptive title..." className="w-full bg-[#020817] border border-white/10 rounded-md px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-[#14B8A6] transition-colors" defaultValue="Getting Started with Agency CRM" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Short Description</label>
                  <textarea rows={2} placeholder="A brief summary of what this article covers..." className="w-full bg-[#020817] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#14B8A6] transition-colors" defaultValue="Learn how to navigate the new Travel Sales Operating System and set up your agency for success." />
                </div>
                
                <div className="space-y-1.5 pt-4">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest flex justify-between items-center">
                    Content
                    <div className="flex gap-2 bg-[#020817] p-1 rounded border border-white/10">
                      <button className="p-1 hover:bg-white/10 rounded text-white"><ImageIcon className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:bg-white/10 rounded text-white"><LinkIcon className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:bg-white/10 rounded text-white"><LayoutTemplate className="w-3.5 h-3.5" /></button>
                    </div>
                  </label>
                  <div className="w-full h-96 bg-[#020817] border border-white/10 rounded-md p-4 text-sm text-[#94A3B8] font-mono flex items-center justify-center">
                    [ Rich Text Editor Component / MDX Editor goes here ]
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Settings */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              
              <div className="bg-[#0B1220] border border-white/5 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Article Settings</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Category</label>
                  <select className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-[#14B8A6]">
                    <option>Agency CRM Guides</option>
                    <option>Traveler Guides</option>
                    <option>Setup Guides</option>
                    <option>Tutorials</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">URL Slug</label>
                  <input type="text" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-xs text-white focus:outline-none focus:border-[#14B8A6]" defaultValue="getting-started-agency-crm" />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest block mb-2">Featured Image</label>
                  <div className="w-full aspect-video rounded-md bg-[#020817] border border-white/10 border-dashed flex flex-col items-center justify-center text-[#94A3B8] hover:bg-white/5 cursor-pointer transition-colors">
                    <ImageIcon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold">Upload Image</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0B1220] border border-white/5 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">SEO Meta Data</h3>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Meta Title</label>
                  <input type="text" className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-xs text-white focus:outline-none focus:border-[#14B8A6]" defaultValue="Getting Started with Travixa CRM" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Meta Description</label>
                  <textarea rows={3} className="w-full bg-[#020817] border border-white/10 rounded-md py-2 px-3 text-xs text-white focus:outline-none focus:border-[#14B8A6]" defaultValue="Learn the basics of using the Travixa Agency CRM to manage your leads and build packages." />
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
