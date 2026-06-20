"use client";

import { useState } from "react";
import { PlayCircle, Plus, Search, Filter, Edit2, Trash2, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["Getting Started", "Traveler Tutorials", "Agency CRM Tutorials", "Quotation Builder", "WhatsApp Automation", "Vendor Management", "Marketplace", "Admin Panel"];

const videos = [
  { id: "V-201", title: "Building your first Travel Package", category: "Agency CRM Tutorials", duration: "12:45", featured: true, views: "4.2k", date: "Oct 15, 2026", thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80" },
  { id: "V-202", title: "How to use the WhatsApp Quotation Sender", category: "WhatsApp Automation", duration: "05:20", featured: true, views: "8.1k", date: "Oct 10, 2026", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" },
  { id: "V-203", title: "Adding Global Vendors to your Library", category: "Vendor Management", duration: "08:15", featured: false, views: "2.5k", date: "Sep 28, 2026", thumbnail: "https://images.unsplash.com/photo-1542314831-c6a4d14d8373?w=500&q=80" },
  { id: "V-204", title: "Configuring Razorpay for Subscriptions", category: "Admin Panel", duration: "15:30", featured: false, views: "150", date: "Sep 15, 2026", thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&q=80" },
];

export default function VideoLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Video Library Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage and organize tutorial videos for Travelers and Agencies.</p>
        </div>
        <div className="flex gap-2">
          <Button className="h-9 font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all">
            <Plus className="w-4 h-4 mr-2" /> Upload Video
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0B1220] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
          <FilterBadge label="All Videos" active={activeCategory === "All"} onClick={() => setActiveCategory("All")} />
          <FilterBadge label="Featured" active={activeCategory === "Featured"} onClick={() => setActiveCategory("Featured")} />
          {categories.slice(0, 4).map(cat => (
            <FilterBadge key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
          ))}
          <button className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 text-[#94A3B8] hover:text-white shrink-0 border border-white/10 flex items-center gap-1">
            More <Filter className="w-3 h-3" />
          </button>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input 
            type="text" 
            placeholder="Search videos..." 
            className="w-full bg-[#020817] border border-white/10 rounded-full py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#14B8A6] transition-colors"
          />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {videos.filter(v => activeCategory === "All" || (activeCategory === "Featured" ? v.featured : v.category === activeCategory)).map((video, index) => (
          <div key={index} className="bg-[#0B1220] border border-white/5 rounded-xl overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50">
            
            {/* Thumbnail */}
            <div className="relative aspect-video bg-[#020817] overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-12 h-12 text-white/80 hover:text-white cursor-pointer drop-shadow-lg" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-white font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> {video.duration}
              </div>
              {video.featured && (
                <div className="absolute top-2 left-2 bg-[#F59E0B] px-2 py-1 rounded text-[10px] font-bold text-[#0F172A] flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-[#0F172A]" /> Featured
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-4 space-y-3">
              <div>
                <span className="text-[9px] font-bold text-[#14B8A6] uppercase tracking-widest bg-[#14B8A6]/10 px-2 py-0.5 rounded border border-[#14B8A6]/20">{video.category}</span>
                <h3 className="text-sm font-bold text-white mt-2 leading-snug line-clamp-2" title={video.title}>{video.title}</h3>
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#94A3B8]">
                <span>{video.views} views</span>
                <span>{video.date}</span>
              </div>
              <div className="pt-3 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-[#94A3B8]">{video.id}</span>
                <div className="flex gap-1">
                  <ActionBtn icon={Edit2} tooltip="Edit details" />
                  <ActionBtn icon={Trash2} tooltip="Delete" color="hover:text-red-400" />
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}

function FilterBadge({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border ${
        active ? "bg-white text-[#0F172A] border-white shadow-lg" : "bg-white/5 text-[#94A3B8] border-white/10 hover:text-white hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function ActionBtn({ icon: Icon, tooltip, color }: any) {
  return (
    <button title={tooltip} className={`w-7 h-7 rounded flex items-center justify-center text-[#94A3B8] hover:bg-white/10 transition-colors ${color || "hover:text-white"}`}>
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}
