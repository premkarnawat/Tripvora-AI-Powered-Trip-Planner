"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Users, Heart, MessageCircle, Share2, MapPin } from "lucide-react";

const posts = [
  {
    id: 1,
    user: "Elena R.",
    avatar: "ER",
    location: "Santorini, Greece",
    image: "bg-blue-900", // Placeholder for actual image
    likes: 245,
    comments: 18,
    time: "2 hours ago",
    caption: "Just experienced the most magical sunset in Oia. The AI planner suggested this hidden spot away from the crowds and it was perfect! 🌅✨",
  },
  {
    id: 2,
    user: "Marcus T.",
    avatar: "MT",
    location: "Kyoto, Japan",
    image: "bg-emerald-900",
    likes: 892,
    comments: 45,
    time: "5 hours ago",
    caption: "Wandering through the bamboo forests. The itinerary Tripvora built for my week here has been flawless. Highly recommend the early morning route!",
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="Traveler Community" 
        description="Get inspired by itineraries, photos, and stories from fellow Tripvora explorers."
        icon={Users}
      />
      
      <div className="max-w-[800px] mx-auto px-4 md:px-8 mt-8 space-y-8">
        
        {posts.map((post) => (
          <div key={post.id} className="glass-card rounded-3xl border border-white/5 overflow-hidden">
            {/* Post Header */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">
                  {post.avatar}
                </div>
                <div>
                  <h3 className="text-white font-medium">{post.user}</h3>
                  <div className="flex items-center gap-1 text-sm text-white/50">
                    <MapPin className="w-3 h-3" />
                    {post.location} • {post.time}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Image Placeholder */}
            <div className={`w-full h-[400px] ${post.image} relative`}>
               <div className="absolute inset-0 flex items-center justify-center text-white/20 font-medium">
                  Image Placeholder
               </div>
            </div>

            {/* Post Actions & Caption */}
            <div className="p-6">
              <div className="flex items-center gap-6 mb-4">
                <button className="flex items-center gap-2 text-white/70 hover:text-red-500 transition-colors group">
                  <Heart className="w-6 h-6 group-hover:fill-red-500 transition-colors" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors">
                  <MessageCircle className="w-6 h-6" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-white/70 hover:text-primary transition-colors ml-auto">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-white/80 leading-relaxed">
                <span className="font-bold text-white mr-2">{post.user}</span>
                {post.caption}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
