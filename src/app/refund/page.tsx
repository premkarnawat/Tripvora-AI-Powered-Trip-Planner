import React from "react";
import Link from "next/link";
import { RefreshCcw, ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4 font-sans relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
            <RefreshCcw className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-sora tracking-tight">Refund Policy</h1>
            <p className="text-teal-400 font-bold mt-2">Effective Date: October 2024</p>
          </div>
        </div>

        <div className="bg-[#0A0F1D]/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-8 md:p-12 space-y-8 text-white/70 leading-relaxed font-medium">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-sora">1. Subscription Plans</h2>
            <p>
              TripPilot offers various subscription plans (Pro, Agency, Enterprise). If you are not satisfied with your subscription, you may request a full refund within 14 days of your initial purchase.
            </p>
            <p>
              After the 14-day period, we do not offer refunds for any subscription fees. You may cancel your subscription at any time, and you will continue to have access to the service through the end of your billing period.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-sora">2. Affiliate Bookings</h2>
            <p>
              TripPilot does not process payments for flights, hotels, or external activities. All transactions made through our affiliate partners (e.g., Booking.com, Skyscanner) are governed by the respective partner's refund and cancellation policies.
            </p>
            <p>
              If you need a refund for a travel booking, you must contact the airline, hotel, or booking platform directly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-sora">3. How to Request a Refund</h2>
            <p>
              To request a refund for a TripPilot SaaS subscription, please contact our support team at <span className="text-white font-bold">billing@trippilot.ai</span> with your account details and reason for cancellation.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
