"use client";

import { useState } from "react";
import { CheckSquare, Calendar as CalendarIcon, Clock, Phone, FileText, Plus, Search, Filter, MessageCircle, AlertCircle, CheckCircle2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockTasks = [
  { id: "T-091", title: "Follow up on Maldives quote", type: "Follow-up", due: "Today, 2:00 PM", relatedTo: "Priya Sharma (Lead)", status: "Pending", priority: "High" },
  { id: "T-092", title: "Collect 50% advance payment", type: "Payment", due: "Today, 5:00 PM", relatedTo: "Acme Corp Retreat", status: "Overdue", priority: "Urgent" },
  { id: "T-088", title: "Call for Europe itinerary feedback", type: "Call", due: "Tomorrow, 11:00 AM", relatedTo: "Rahul Verma", status: "Pending", priority: "Medium" },
  { id: "T-085", title: "Send visa documents checklist", type: "Trip Task", due: "Tomorrow, 4:00 PM", relatedTo: "David Smith", status: "Pending", priority: "Medium" },
  { id: "T-070", title: "Welcome message & onboarding", type: "Customer Task", due: "Yesterday", relatedTo: "Sarah Jenkins", status: "Completed", priority: "Low" },
];

export default function TasksPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10 flex gap-6">
      
      {/* Left Sidebar (Filters) */}
      <div className="w-64 shrink-0 space-y-6 hidden lg:block">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <CheckSquare className="w-5 h-5 text-[#14B8A6]" /> My Tasks
          </h2>
          <Button className="w-full h-9 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm mb-6">
            <Plus className="w-3.5 h-3.5 mr-1" /> Create Task
          </Button>
        </div>

        <div className="space-y-1">
          <FilterLink label="All Tasks" count={24} active />
          <FilterLink label="Today" count={8} />
          <FilterLink label="Upcoming" count={12} />
          <FilterLink label="Overdue" count={4} warning />
          <FilterLink label="Completed" count={142} />
        </div>

        <div className="pt-4 border-t border-white/5 space-y-1">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-3 mb-2">Categories</p>
          <FilterLink label="Follow-ups" icon={MessageCircle} />
          <FilterLink label="Calls" icon={Phone} />
          <FilterLink label="Payments" icon={DollarSign} />
          <FilterLink label="Trip Tasks" icon={FileText} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center border-b border-white/5 pb-4">
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#14B8A6]" /> Tasks
          </h2>
          <Button className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> New
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center bg-[#0B1220] p-3 rounded-md border border-white/5">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full bg-[#020817] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="flex bg-[#020817] p-1 rounded-md border border-white/10 h-8">
            <button className="px-2.5 rounded bg-white/10 text-white text-xs font-bold">List</button>
            <button className="px-2.5 rounded text-[#94A3B8] hover:text-white text-xs font-bold">Kanban</button>
            <button className="px-2.5 rounded text-[#94A3B8] hover:text-white text-xs font-bold">Calendar</button>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
          <div className="divide-y divide-white/[0.02]">
            {mockTasks.map((task, i) => (
              <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors group flex items-start gap-4">
                <button className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.status === 'Completed' ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]' : 'border-white/20 hover:border-[#14B8A6] text-transparent hover:text-[#14B8A6]'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`text-sm font-bold transition-colors ${task.status === 'Completed' ? 'text-[#94A3B8] line-through' : 'text-white group-hover:text-[#38BDF8]'}`}>
                      {task.title}
                    </h3>
                    <PriorityChip priority={task.priority} />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                      <TaskIcon type={task.type} /> {task.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" /> {task.relatedTo}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${task.status === 'Overdue' ? 'text-[#EF4444]' : 'text-[#14B8A6]'}`}>
                      <Clock className="w-3.5 h-3.5" /> {task.due}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterLink({ label, count, active, warning, icon: Icon }: any) {
  return (
    <button className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-xs font-bold ${active ? 'bg-[#14B8A6]/10 text-[#14B8A6]' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}>
      <span className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full ${warning ? 'bg-[#EF4444]/20 text-[#EF4444]' : active ? 'bg-[#14B8A6]/20 text-[#14B8A6]' : 'bg-white/5 text-[#94A3B8]'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function TaskIcon({ type }: { type: string }) {
  switch (type) {
    case 'Call': return <Phone className="w-3.5 h-3.5" />;
    case 'Payment': return <DollarSign className="w-3.5 h-3.5" />;
    case 'Follow-up': return <MessageCircle className="w-3.5 h-3.5" />;
    default: return <FileText className="w-3.5 h-3.5" />;
  }
}

function PriorityChip({ priority }: { priority: string }) {
  if (priority === 'Urgent') return <span className="flex items-center gap-1 text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded border border-[#EF4444]/20"><AlertCircle className="w-3 h-3" /> Urgent</span>;
  if (priority === 'High') return <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">High</span>;
  if (priority === 'Medium') return <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">Medium</span>;
  return <span className="text-[10px] font-bold text-[#94A3B8] bg-white/5 px-2 py-0.5 rounded border border-white/10">Low</span>;
}
