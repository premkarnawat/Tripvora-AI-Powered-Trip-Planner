"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Map, Calendar, Users, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const upcomingTrips = [
  {
    id: 1,
    title: "Goa Getaway",
    dates: "May 20 - May 25, 2024",
    duration: "5 Days",
    people: "2 People",
    status: "Upcoming",
  }
];

const pastTrips = [
  {
    id: 2,
    title: "Dubai Adventure",
    dates: "Jan 10 - Jan 15, 2024",
    duration: "6 Days",
    people: "4 People",
    status: "Completed",
  },
  {
    id: 3,
    title: "Himachal Backpacking",
    dates: "Oct 05 - Oct 12, 2023",
    duration: "8 Days",
    people: "3 People",
    status: "Completed",
  }
];

export default function TripsPage() {
  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="My Trips" 
        description="View your upcoming adventures and relive your past journeys."
        icon={Map}
      />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 mt-8">
        
        {/* Actions */}
        <div className="flex justify-end mb-8">
          <Link href="/plan">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12 flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
               <Plus className="w-5 h-5" />
               Create New Trip
            </Button>
          </Link>
        </div>

        {/* Upcoming Trips */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white font-sora mb-6">Upcoming Trips</h2>
          {upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingTrips.map(trip => (
                <div key={trip.id} className="glass-card rounded-3xl p-6 border border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -z-10 group-hover:bg-primary/20 transition-colors" />
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-40 h-40 rounded-2xl bg-gradient-to-tr from-teal-900 to-slate-800 shrink-0 relative overflow-hidden">
                       <div className="absolute inset-0 flex items-center justify-center text-white/20 font-medium">Image Placeholder</div>
                    </div>
                    
                    <div className="flex flex-col justify-center flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-white">{trip.title}</h3>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                          <span className="text-xs font-medium text-primary">{trip.status}</span>
                        </div>
                      </div>
                      
                      <p className="text-white/60 mb-6">{trip.dates}</p>
                      
                      <div className="flex items-center gap-6 mt-auto mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/40" />
                          <span className="text-sm text-white/70">{trip.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-white/40" />
                          <span className="text-sm text-white/70">{trip.people}</span>
                        </div>
                      </div>

                      <Button variant="ghost" className="w-fit p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent flex items-center gap-2 font-medium">
                        View Itinerary <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-3xl border border-white/5 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Map className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No upcoming trips</h3>
              <p className="text-white/60 mb-6">Time to start planning your next adventure!</p>
              <Link href="/plan">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6">
                   Plan a Trip
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Past Trips */}
        <div>
          <h2 className="text-2xl font-bold text-white font-sora mb-6">Past Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTrips.map(trip => (
              <div key={trip.id} className="glass-card rounded-3xl p-5 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                 <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm font-medium">Image Placeholder</div>
                 </div>
                 <h3 className="text-lg font-bold text-white mb-1">{trip.title}</h3>
                 <p className="text-sm text-white/50 mb-4">{trip.dates}</p>
                 <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-xs text-white/40">{trip.duration}</span>
                    <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded-md">{trip.status}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
