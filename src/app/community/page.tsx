"use client";

import { useState } from "react";
import { 
  Users, Heart, MessageCircle, Share2, MapPin, 
  Bookmark, Send, Plus, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Elena R.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
      location: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1486894980609-fce7c3c164ad?q=80&w=800&auto=format&fit=crop",
      likes: 245,
      hasLiked: false,
      comments: 18,
      time: "2 hours ago",
      caption: "Just experienced the most magical sunset in Oia. The AI planner suggested this hidden spot away from the crowds and it was perfect! 🌅✨",
      tags: ["#Sunset", "#Greece", "#Oia"]
    },
    {
      id: 2,
      user: "Marcus T.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      location: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=800&auto=format&fit=crop",
      likes: 892,
      hasLiked: true,
      comments: 45,
      time: "5 hours ago",
      caption: "Wandering through the bamboo forests. The itinerary TripPilot built for my week here has been flawless. Highly recommend the early morning route!",
      tags: ["#Kyoto", "#Japan", "#Forests"]
    }
  ]);

  const handleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[800px] mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black tracking-widest uppercase mb-4">
            <Users className="w-3.5 h-3.5" /> Travel Journal
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight font-sora mb-2">
            Shared Adventures
          </h1>
          <p className="text-slate-500 text-xs font-semibold leading-relaxed">
            See real itineraries, photos, and stories posted by the global TripPilot explorer network.
          </p>
        </div>

        {/* Share box */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
              alt="You" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-xs text-slate-400 font-bold">Share your latest itinerary or photo...</span>
          </div>
          <Button className="bg-slate-50 hover:bg-slate-100 text-black border border-slate-150 rounded-full px-5 h-9 text-xs font-bold flex items-center gap-1">
            <Plus className="w-4 h-4" /> Post
          </Button>
        </div>

        {/* Feed Posts */}
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
              
              {/* Post Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={post.avatar} 
                    alt={post.user}
                    className="w-11 h-11 rounded-full object-cover" 
                  />
                  <div>
                    <h3 className="text-black font-bold text-sm leading-tight">{post.user}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.location}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-black">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              {/* Post Image */}
              <div className="h-96 w-full relative overflow-hidden bg-slate-50">
                <img 
                  src={post.image} 
                  alt={post.location} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Actions & Caption */}
              <div className="p-6">
                <div className="flex items-center gap-6 mb-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      post.hasLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.hasLiked ? 'fill-red-500' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-400 hover:text-black text-xs font-bold transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-400 hover:text-black text-xs font-bold transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                  <span className="font-extrabold text-black mr-2">{post.user}</span>
                  {post.caption}
                </p>

                {/* Tags */}
                <div className="flex gap-2 mt-3.5">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-black text-teal-600 uppercase tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
