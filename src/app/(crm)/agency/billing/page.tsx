"use client";

import { CreditCard, Download, ExternalLink, ShieldCheck, Clock, CheckCircle2, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockInvoices = [
  { id: "TP-INV-8492", date: "Oct 01, 2026", amount: "₹4,999", plan: "Professional Plan", status: "Paid" },
  { id: "TP-INV-8210", date: "Sep 01, 2026", amount: "₹4,999", plan: "Professional Plan", status: "Paid" },
  { id: "TP-INV-8005", date: "Aug 15, 2026", amount: "₹2,299", plan: "Marketplace Credits (250)", status: "Paid" },
  { id: "TP-INV-7901", date: "Aug 01, 2026", amount: "₹4,999", plan: "Professional Plan", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10 flex flex-col xl:flex-row gap-6">
      
      {/* Main Billing Area */}
      <div className="flex-1 space-y-6">
        
        {/* Header */}
        <div className="border-b border-white/5 pb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Billing & Invoices
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage payment methods and download your TripPilot tax invoices.</p>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#14B8A6]" /> Payment Methods
            </h3>
            <Button className="h-8 text-xs font-bold bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/20 transition-colors">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add New Card
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#020817] border border-[#14B8A6]/30 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  {/* Visa Logo Mock */}
                  <span className="text-[#1A1F71] font-bold italic text-sm">VISA</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">•••• •••• •••• 4242</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">Expires 12/28</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-[#14B8A6]/10 text-[#14B8A6] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Default</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#020817] border border-white/5 rounded-md opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                  {/* Mastercard Logo Mock */}
                  <div className="flex">
                    <div className="w-4 h-4 rounded-full bg-[#EB001B] opacity-80" />
                    <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-80 -ml-1.5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">•••• •••• •••• 8810</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">Expires 09/27</p>
                </div>
              </div>
              <Button className="h-7 px-3 text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors">
                Make Default
              </Button>
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-[#0B1220] border border-white/5 rounded-md overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Invoice History</h3>
            <Button className="h-7 text-[10px] font-bold bg-transparent hover:bg-white/5 text-[#94A3B8] hover:text-white border border-dashed border-white/20 transition-colors">
              Download All (YTD)
            </Button>
          </div>
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-white/[0.02]">
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {mockInvoices.map((inv, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3 px-4 text-[10px] font-mono text-white">{inv.id}</td>
                  <td className="py-3 px-4 text-xs text-[#94A3B8]">{inv.date}</td>
                  <td className="py-3 px-4 text-xs text-white">{inv.plan}</td>
                  <td className="py-3 px-4 text-xs font-bold text-[#14B8A6]">{inv.amount}</td>
                  <td className="py-3 px-4">
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                      <CheckCircle2 className="w-3 h-3" /> Paid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-[#94A3B8] hover:text-white transition-colors" title="Download PDF">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Right Sidebar: Security & Tax */}
      <div className="xl:w-[350px] shrink-0 space-y-6">
        
        {/* Billing Info */}
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-white">Billing Information</h3>
            <button className="text-xs font-bold text-[#14B8A6] hover:text-white transition-colors">Edit</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Company Name</p>
              <p className="text-sm font-bold text-white">Wanderlust Travels Pvt Ltd.</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">GSTIN / Tax ID</p>
              <p className="text-xs font-mono text-white">27AAACW1234D1Z5</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Billing Address</p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Unit 402, Skyline Towers,<br />
                Andheri West, Mumbai, 400053<br />
                Maharashtra, India
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-gradient-to-br from-[#020817] to-[#0B1220] border border-white/5 rounded-md p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-[#10B981]" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Secure Payments</h3>
          <p className="text-[10px] text-[#94A3B8] leading-relaxed mb-4">
            All transactions are 256-bit SSL encrypted and securely processed by Stripe. We do not store your full card details.
          </p>
          <a href="#" className="inline-flex items-center gap-1 text-[10px] font-bold text-[#38BDF8] hover:text-white transition-colors">
            View Security Policy <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
