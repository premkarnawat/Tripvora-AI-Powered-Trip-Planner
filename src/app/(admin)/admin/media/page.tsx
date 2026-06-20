"use client";

import { useState } from "react";
import { Image as ImageIcon, Video, FileText, UploadCloud, Search, Filter, Trash2, Download, ExternalLink, Grid, List, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const mediaFiles = [
  { id: "M-301", name: "hero-background.jpg", type: "Image", size: "2.4 MB", url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80", date: "Oct 15" },
  { id: "M-302", name: "trip-pilot-logo-white.png", type: "Image", size: "124 KB", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80", date: "Oct 12" },
  { id: "M-303", name: "agency-terms.pdf", type: "PDF", size: "1.1 MB", url: "", date: "Oct 10" },
  { id: "M-304", name: "promo-video-1080p.mp4", type: "Video", size: "45 MB", url: "", date: "Oct 05" },
  { id: "M-305", name: "diwali-offer-banner.png", type: "Image", size: "1.8 MB", url: "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?w=500&q=80", date: "Oct 01" },
  { id: "M-306", name: "maldives-thumbnail.jpg", type: "Image", size: "850 KB", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80", date: "Sep 28" },
];

export default function MediaLibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Media Library
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Centralized storage for all platform images, videos, and documents.</p>
        </div>
        <div className="flex gap-2">
          <Button className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload Files
          </Button>
        </div>
      </div>

      <div className="bg-[#0B1220] border border-white/5 rounded-xl overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#020817]/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search by file name or extension..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button className="h-9 font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10 transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Type
            </Button>
            <div className="h-9 w-px bg-white/10 mx-1" />
            <div className="flex bg-[#020817] border border-white/10 rounded-md overflow-hidden p-0.5">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {/* Upload Dropzone */}
              <div className="aspect-square bg-[#020817] border border-white/10 border-dashed rounded-lg flex flex-col items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#14B8A6] hover:bg-[#14B8A6]/5 cursor-pointer transition-colors group">
                <UploadCloud className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-100 group-hover:text-[#14B8A6] transition-all" />
                <span className="text-xs font-bold">Drag & Drop</span>
              </div>
              
              {mediaFiles.map((file, i) => (
                <div key={i} className="aspect-square bg-[#020817] border border-white/5 rounded-lg overflow-hidden group relative">
                  {file.type === "Image" ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02]">
                      {file.type === "PDF" && <FileText className="w-10 h-10 text-red-400 opacity-80" />}
                      {file.type === "Video" && <Video className="w-10 h-10 text-[#38BDF8] opacity-80" />}
                      <span className="mt-2 text-[10px] font-bold text-white/50">{file.type}</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-white">{file.size}</span>
                      <button className="text-white hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white truncate mb-1">{file.name}</p>
                      <div className="flex gap-1">
                        <button className="flex-1 bg-white/20 hover:bg-white/30 py-1 rounded text-[10px] font-bold text-white flex justify-center items-center gap-1 transition-colors">
                          <ExternalLink className="w-3 h-3" /> View
                        </button>
                        <button className="w-6 bg-white/20 hover:bg-white/30 rounded flex justify-center items-center text-white transition-colors">
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-white/5 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#020817] border-b border-white/5">
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">File Name</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Type</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Size</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Uploaded</th>
                    <th className="p-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mediaFiles.map((file, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0">
                            {file.type === "Image" && <ImageIcon className="w-4 h-4 text-[#14B8A6]" />}
                            {file.type === "PDF" && <FileText className="w-4 h-4 text-red-400" />}
                            {file.type === "Video" && <Video className="w-4 h-4 text-[#38BDF8]" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{file.name}</p>
                            <p className="text-[10px] text-[#94A3B8] font-mono">{file.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-white">{file.type}</td>
                      <td className="p-4 text-xs font-mono text-[#94A3B8]">{file.size}</td>
                      <td className="p-4 text-xs text-[#94A3B8]">{file.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ActionBtn icon={ExternalLink} tooltip="Preview" />
                          <ActionBtn icon={Download} tooltip="Download" />
                          <ActionBtn icon={Trash2} tooltip="Delete" color="hover:text-red-400" />
                          <ActionBtn icon={MoreVertical} tooltip="More Options" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function ActionBtn({ icon: Icon, tooltip, color }: any) {
  return (
    <button title={tooltip} className={`w-8 h-8 rounded flex items-center justify-center text-[#94A3B8] hover:bg-white/5 transition-colors ${color || "hover:text-white"}`}>
      <Icon className="w-4 h-4" />
    </button>
  );
}
