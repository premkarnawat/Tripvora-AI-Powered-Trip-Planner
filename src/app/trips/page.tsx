"use client";

import { 
  Map, Calendar, Users, ArrowRight, Plus, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const upcomingTrips = [
  {
    id: "bali-luxury-vacation",
    title: "Bali Luxury Escape",
    dates: "May 20 - May 25, 2024",
    duration: "7 Days",
    people: "2 People",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&auto=format&fit=crop"
  }
];

const pastTrips = [
  {
    id: "swiss-alps",
    title: "Dubai Adventure",
    dates: "Jan 10 - Jan 15, 2024",
    duration: "6 Days",
    people: "4 People",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "marrakesh-tour",
    title: "Himachal Backpacking",
    dates: "Oct 05 - Oct 12, 2023",
    duration: "8 Days",
    people: "3 People",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=400&auto=format&fit=crop"
  }
];

export default function TripsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pt-28 pb-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-black tracking-widest uppercase mb-4">
              <Map className="w-3.5 h-3.5" /> Traveler Dashboard
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight font-sora">
              My Trips
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-1">
              View your upcoming adventures and relive your past journeys.
            </p>
          </div>

          <Link href="/plan">
            <Button className="bg-black hover:bg-black/90 text-white rounded-full px-6 h-11 text-xs font-bold flex items-center gap-1.5 shadow-sm border-none">
              <Plus className="w-4 h-4" /> Create New Trip
            </Button>
          </Link>
        </div>

        {/* Upcoming Trips */}
        <div className="mb-16">
          <h2 className="text-xl font-extrabold text-black font-sora mb-6">Upcoming Trips</h2>
          {upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {upcomingTrips.map(trip => (
                <div key={trip.id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden shrink-0 bg-slate-50">
                    <img 
                      src={trip.image} 
                      alt={trip.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <div className="flex items-start justify-between mb-2 gap-4">
                        <h3 className="text-xl font-bold text-black font-sora">{trip.title}</h3>
                        <span className="bg-teal-50 text-teal-700 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {trip.status}
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-xs font-semibold mb-4">{trip.dates}</p>
                      
                      <div className="flex items-center gap-6 mb-6 text-slate-500 text-xs font-bold uppercase">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{trip.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>{trip.people}</span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/trips/${trip.id}`}>
                      <Button variant="ghost" className="w-fit p-0 h-auto text-teal-600 hover:text-teal-700 hover:bg-transparent flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                        View Itinerary <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[32px] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">No upcoming trips</h3>
              <p className="text-slate-500 text-xs mb-6 font-semibold">Time to start planning your next adventure!</p>
              <Link href="/plan">
                <Button className="bg-black hover:bg-black/90 text-white rounded-full px-6 h-11 text-xs font-bold border-none">
                  Plan a Trip
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Past Trips */}
        <div>
          <h2 className="text-xl font-extrabold text-black font-sora mb-6">Past Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastTrips.map(trip => (
              <div key={trip.id} className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm hover:y-[-2px] transition-all flex flex-col justify-between">
                <div>
                  <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-slate-50">
                    <img 
                      src={trip.image} 
                      alt={trip.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-black font-sora mb-1">{trip.title}</h3>
                  <p className="text-slate-400 text-xs font-semibold mb-4">{trip.dates}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50 text-xs font-bold text-slate-400 uppercase">
                  <span>{trip.duration}</span>
                  <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md text-[9px] font-black">{trip.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
