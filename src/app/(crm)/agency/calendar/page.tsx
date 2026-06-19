"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter, Calendar as CalendarIcon, MapPin, Clock, DollarSign, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockEvents = [
  { id: 1, title: "Smith Family Tokyo Departure", date: 15, type: "Departure", color: "bg-[#14B8A6]", time: "08:00 AM" },
  { id: 2, title: "Acme Retreat Payment Due", date: 15, type: "Payment", color: "bg-[#EF4444]", time: "11:59 PM" },
  { id: 3, title: "Call Rahul Verma", date: 17, type: "Follow-up", color: "bg-[#38BDF8]", time: "02:00 PM" },
  { id: 4, title: "Jenkins Honeymoon Ends", date: 22, type: "Return", color: "bg-purple-500", time: "10:00 AM" },
  { id: 5, title: "Delta Team Offsite", date: 24, type: "Departure", color: "bg-[#14B8A6]", time: "06:30 AM" },
];

export default function CalendarPage() {
  const [view, setView] = useState("month");

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10 flex gap-6">
      
      {/* Left Sidebar (Mini Calendar & Filters) */}
      <div className="w-64 shrink-0 space-y-6 hidden lg:block">
        <Button className="w-full h-9 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
          <Plus className="w-3.5 h-3.5 mr-1" /> New Event
        </Button>

        {/* Mini Calendar Placeholder */}
        <div className="bg-[#0B1220] p-4 rounded-md border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-white">October 2026</span>
            <div className="flex gap-1">
              <button className="text-[#94A3B8] hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
              <button className="text-[#94A3B8] hover:text-white"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} className="text-[10px] font-bold text-[#94A3B8]">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Generating mock days */}
            {Array.from({length: 31}).map((_, i) => (
              <div key={i} className={`text-xs p-1 rounded-sm cursor-pointer hover:bg-white/10 ${i+1 === 15 ? 'bg-[#14B8A6] text-[#0F172A] font-bold' : 'text-white'}`}>
                {i+1}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-2">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-1 mb-3">Calendars</p>
          <FilterToggle label="Departures & Returns" color="bg-[#14B8A6]" active />
          <FilterToggle label="Payments Due" color="bg-[#EF4444]" active />
          <FilterToggle label="Customer Follow-ups" color="bg-[#38BDF8]" active />
          <FilterToggle label="Internal Meetings" color="bg-[#F59E0B]" active />
        </div>
      </div>

      {/* Main Calendar View */}
      <div className="flex-1 space-y-4">
        {/* Header Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B1220] p-3 rounded-md border border-white/5 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">October 2026</h2>
            <div className="flex gap-1">
              <button className="p-1.5 rounded hover:bg-white/5 text-[#94A3B8] hover:text-white transition-colors border border-transparent hover:border-white/10"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1.5 rounded hover:bg-white/5 text-[#94A3B8] hover:text-white transition-colors border border-transparent hover:border-white/10"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <Button className="h-7 px-3 text-xs font-bold bg-[#020817] hover:bg-white/5 text-white border border-white/10">Today</Button>
          </div>

          <div className="flex bg-[#020817] p-1 rounded-md border border-white/10 h-8">
            <button onClick={() => setView("month")} className={`px-2.5 rounded text-xs font-bold transition-colors ${view === "month" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}>Month</button>
            <button onClick={() => setView("week")} className={`px-2.5 rounded text-xs font-bold transition-colors ${view === "week" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}>Week</button>
            <button onClick={() => setView("agenda")} className={`px-2.5 rounded text-xs font-bold transition-colors ${view === "agenda" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}>Agenda</button>
          </div>
        </div>

        {/* View Content */}
        {view === "month" && <MonthGrid />}
        {view === "agenda" && <AgendaView />}
        {/* Week view placeholder points back to month for now */}
        {view === "week" && <MonthGrid />}
      </div>
    </div>
  );
}

function MonthGrid() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Generate 35 cells for a standard month grid
  const cells = Array.from({length: 35});
  
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden flex flex-col h-[70vh]">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
        {days.map(d => (
          <div key={d} className="py-2 text-center text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest border-r border-white/5 last:border-r-0">
            {d}
          </div>
        ))}
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-7 flex-1">
        {cells.map((_, i) => {
          const dateNum = i - 3; // Offset to start month correctly
          const isCurrentMonth = dateNum > 0 && dateNum <= 31;
          const displayDate = isCurrentMonth ? dateNum : '';
          const isToday = displayDate === 15;
          
          // Find events for this day
          const dayEvents = mockEvents.filter(e => e.date === displayDate);

          return (
            <div key={i} className={`border-b border-r border-white/5 p-1.5 last:border-r-0 hover:bg-white/[0.02] transition-colors relative group ${!isCurrentMonth ? 'bg-white/[0.01]' : ''}`}>
              <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-[#14B8A6] text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                {displayDate}
              </span>
              
              <div className="space-y-1">
                {dayEvents.map(ev => (
                  <div key={ev.id} className={`${ev.color}/10 border border-${ev.color.replace('bg-','')}/20 rounded px-1.5 py-0.5 text-[9px] font-bold text-${ev.color.replace('bg-','')} truncate cursor-pointer hover:opacity-80`} title={`${ev.time} - ${ev.title}`}>
                    {ev.time} {ev.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaView() {
  return (
    <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden p-6 min-h-[70vh]">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Day 1 */}
        <div className="relative pl-8 border-l border-white/10 space-y-4 pb-8">
          <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-[#14B8A6] ring-4 ring-[#0B1220]" />
          <h3 className="text-lg font-bold text-white mb-4">Today, Oct 15</h3>
          
          <div className="bg-[#020817] border border-white/5 rounded-md p-4 hover:border-[#14B8A6]/30 transition-colors">
            <div className="flex gap-4">
              <div className="w-12 text-center shrink-0">
                <p className="text-sm font-bold text-white">08:00</p>
                <p className="text-[10px] text-[#94A3B8] font-bold">AM</p>
              </div>
              <div className="w-1 w-full max-w-[4px] bg-[#14B8A6] rounded-full shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#14B8A6] mb-1">Smith Family Tokyo Departure</h4>
                <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> NRT Airport</span>
                  <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> 10 Days Trip</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#020817] border border-white/5 rounded-md p-4 hover:border-[#EF4444]/30 transition-colors">
            <div className="flex gap-4">
              <div className="w-12 text-center shrink-0">
                <p className="text-sm font-bold text-white">11:59</p>
                <p className="text-[10px] text-[#94A3B8] font-bold">PM</p>
              </div>
              <div className="w-1 w-full max-w-[4px] bg-[#EF4444] rounded-full shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#EF4444] mb-1">Acme Retreat Payment Due</h4>
                <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ₹22,50,000 Remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day 2 */}
        <div className="relative pl-8 border-l border-white/10 space-y-4">
          <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-white/20 ring-4 ring-[#0B1220]" />
          <h3 className="text-lg font-bold text-white mb-4">Thursday, Oct 17</h3>
          
          <div className="bg-[#020817] border border-white/5 rounded-md p-4 hover:border-[#38BDF8]/30 transition-colors">
            <div className="flex gap-4">
              <div className="w-12 text-center shrink-0">
                <p className="text-sm font-bold text-white">02:00</p>
                <p className="text-[10px] text-[#94A3B8] font-bold">PM</p>
              </div>
              <div className="w-1 w-full max-w-[4px] bg-[#38BDF8] rounded-full shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#38BDF8] mb-1">Call Rahul Verma</h4>
                <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Discuss Maldives Itinerary</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function FilterToggle({ label, color, active }: any) {
  return (
    <label className="flex items-center gap-3 px-1 py-1.5 cursor-pointer group">
      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${active ? `${color} border-transparent` : 'border-white/20 group-hover:border-white/40'}`}>
        {active && <svg className="w-3 h-3 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="text-xs text-[#94A3B8] font-medium group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}
