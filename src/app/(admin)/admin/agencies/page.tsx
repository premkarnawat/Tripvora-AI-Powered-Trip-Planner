"use client";

import { motion } from "framer-motion";
import { Building, CheckCircle2, XCircle, Search, MoreVertical, Ban, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAgenciesPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-sora">
            Agency Management
          </h1>
          <p className="text-white/60 mt-2">Approve, suspend, and manage B2B agency accounts.</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button className="text-purple-400 font-bold border-b-2 border-purple-400 pb-2 whitespace-nowrap">All Agencies (342)</button>
            <button className="text-white/50 hover:text-white font-medium pb-2 whitespace-nowrap">Pending Approval (12)</button>
            <button className="text-white/50 hover:text-white font-medium pb-2 whitespace-nowrap">Suspended (4)</button>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search agencies..." 
              className="w-full bg-[#121824] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-widest">
                <th className="py-4 px-4 font-normal">Agency Name</th>
                <th className="py-4 px-4 font-normal">Contact</th>
                <th className="py-4 px-4 font-normal">Plan</th>
                <th className="py-4 px-4 font-normal">Status</th>
                <th className="py-4 px-4 font-normal">Revenue Generated</th>
                <th className="py-4 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "Wanderlust Inc.", contact: "sarah@wanderlust.com", plan: "Pro Tier", status: "Active", rev: "$45,200" },
                { name: "Global Explorers", contact: "info@globalxp.net", plan: "Basic Tier", status: "Active", rev: "$12,400" },
                { name: "Luxury Escapes Co.", contact: "ceo@luxuryescapes.com", plan: "Pro Tier", status: "Pending", rev: "$0" },
                { name: "Budget Travels", contact: "admin@budget.io", plan: "Free Tier", status: "Suspended", rev: "$450" },
              ].map((agency, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-white text-sm whitespace-nowrap">{agency.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-white/70 whitespace-nowrap">{agency.contact}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-bold text-white/80">
                      {agency.plan}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                      agency.status === "Active" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      agency.status === "Pending" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {agency.status === "Active" && <CheckCircle2 className="w-3 h-3" />}
                      {agency.status === "Pending" && <Activity className="w-3 h-3" />}
                      {agency.status === "Suspended" && <Ban className="w-3 h-3" />}
                      {agency.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-white whitespace-nowrap">{agency.rev}</td>
                  <td className="py-4 px-4 text-right">
                    {agency.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <button className="w-8 h-8 rounded bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white flex items-center justify-center transition-colors">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button className="w-8 h-8 rounded bg-white/5 text-white/50 hover:bg-white/10 hover:text-white flex items-center justify-center ml-auto transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
