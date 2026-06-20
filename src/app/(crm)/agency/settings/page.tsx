"use client";

import { useState } from "react";
import { User, Phone, MapPin, Briefcase, Mail, Shield, Key, FileText, ArrowRight, CheckCircle2, DollarSign, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Business Settings
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage your agency profile, branding, and billing.</p>
        </div>
        <div className="flex bg-[#0B1220] p-1 rounded-md border border-white/10">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === "profile" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}
          >
            Business Profile
          </button>
          <button 
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === "billing" ? "bg-white/10 text-white" : "text-[#94A3B8] hover:text-white"}`}
          >
            Billing & Subscription
          </button>
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          
          {/* SECTION 1: Agency Information */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#14B8A6]" /> Agency Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Agency Name" value="Elite Travels" />
              <InputField label="Owner Name" value="David Smith" />
              <InputField label="GST Number" value="22AAAAA0000A1Z5" />
              <InputField label="PAN Number" value="ABCDE1234F" />
              <div className="md:col-span-2">
                <InputField label="Business Address" value="123 Corporate Tower, Cyber City, Gurugram" />
              </div>
              <InputField label="Website" value="www.elitetravels.in" />
              <div className="md:col-span-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Description</label>
                  <textarea rows={3} className="w-full bg-[#020817] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#38BDF8]" defaultValue="Premium travel agency specializing in corporate retreats and luxury honeymoons." />
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="h-8 text-xs font-bold bg-white/10 hover:bg-white/20 text-white">Save Changes</Button>
            </div>
          </div>

          {/* SECTION 2: Contact Information */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-[#38BDF8]" /> Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Phone Number" value="+91 98765 43210" />
              <InputField label="WhatsApp Number" value="+91 98765 43210" />
              <InputField label="Email Address" value="hello@elitetravels.in" />
              <InputField label="Emergency Contact" value="+91 99999 88888" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="h-8 text-xs font-bold bg-white/10 hover:bg-white/20 text-white">Save Changes</Button>
            </div>
          </div>

          {/* SECTION 3: Branding */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-400" /> Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2 block">Agency Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-[#020817] border border-white/10 flex items-center justify-center font-bold text-xl">ET</div>
                  <Button className="h-8 text-xs bg-white/5 hover:bg-white/10 text-white">Upload New</Button>
                </div>
              </div>
              <div className="space-y-4">
                <InputField label="Primary Brand Color (Hex)" value="#14B8A6" />
                <InputField label="Secondary Color (Hex)" value="#0F172A" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="h-8 text-xs font-bold bg-white/10 hover:bg-white/20 text-white">Save Changes</Button>
            </div>
          </div>

          {/* SECTION 4: WhatsApp Automation */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#10B981]" /> WhatsApp Automation</h3>
            <div className="flex items-center justify-between p-4 bg-[#020817] border border-[#10B981]/20 rounded-md">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-0.5">Connected Number</p>
                  <p className="text-sm text-white font-bold">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded border border-[#10B981]/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
                <Button className="h-8 text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10">Test Message</Button>
                <Button className="h-8 text-xs font-bold bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10">Disconnect</Button>
              </div>
            </div>
          </div>

          {/* SECTION 5: Security */}
          <div className="bg-[#0B1220] border border-white/5 rounded-md p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[#F59E0B]" /> Security</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 border border-white/5 rounded bg-[#020817]">
                <div>
                  <p className="text-sm font-bold text-white">Account Password</p>
                  <p className="text-xs text-[#94A3B8]">Last changed 3 months ago</p>
                </div>
                <Button className="h-8 text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10">Change Password</Button>
              </div>
              <div className="flex items-center justify-between p-3 border border-white/5 rounded bg-[#020817]">
                <div>
                  <p className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-[#94A3B8]">Protect your account with an extra layer of security</p>
                </div>
                <Button className="h-8 text-xs font-bold bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20">Enable 2FA</Button>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          {/* SECTION 6: Billing & Subscription */}
          <div className="bg-[#0B1220] border border-[#38BDF8]/30 rounded-md p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8]/5 rounded-full blur-[50px] pointer-events-none" />
            
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 relative z-10"><DollarSign className="w-4 h-4 text-[#38BDF8]" /> Current Plan</h3>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  TripPilot Pro
                  <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                </h2>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-xl font-bold text-white">₹2,999</span>
                  <span className="text-xs text-[#94A3B8] mb-0.5">/month</span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-2">Next renewal date: <span className="font-bold text-white">15 November 2026</span></p>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button className="h-9 font-bold bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0F172A] border-none shadow-[0_0_15px_rgba(56,189,248,0.3)] w-full">
                  Upgrade Plan <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
                <Button className="h-9 font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 w-full">
                  Manage Subscription
                </Button>
              </div>
            </div>

            <div className="bg-[#020817] border border-white/5 rounded-md p-5 relative z-10">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4">Features Included</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <FeatureItem text="Lead Management" />
                <FeatureItem text="AI Package Builder" />
                <FeatureItem text="Quotation Builder" />
                <FeatureItem text="WhatsApp Automation" />
                <FeatureItem text="Trip Management" />
                <FeatureItem text="Vendor Library" />
                <FeatureItem text="Revenue Dashboard" />
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <h3 className="text-sm font-bold text-white mb-4">Recent Invoices</h3>
              <div className="space-y-2">
                <InvoiceItem date="15 Oct 2026" amount="₹2,999" status="Paid" id="INV-2026-10" />
                <InvoiceItem date="15 Sep 2026" amount="₹2,999" status="Paid" id="INV-2026-09" />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function InputField({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{label}</label>
      <input type="text" className="bg-[#020817] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors" defaultValue={value} />
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
      <span className="text-xs text-white">{text}</span>
    </div>
  );
}

function InvoiceItem({ date, amount, status, id }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#020817] border border-white/5 rounded hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <FileText className="w-4 h-4 text-[#94A3B8]" />
        <div>
          <p className="text-xs font-bold text-white">{date}</p>
          <p className="text-[10px] text-[#94A3B8]">{id}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-white">{amount}</span>
        <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">{status}</span>
        <button className="text-[10px] font-bold text-[#38BDF8] hover:underline">Download</button>
      </div>
    </div>
  );
}

// Ensure MessageSquare is exported or imported from lucide-react above (it is)
