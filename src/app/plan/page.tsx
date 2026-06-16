"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Sparkles, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PlanPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen pb-20">
      <PageHeader 
        title="AI Trip Planner" 
        description="Let our advanced AI craft the perfect itinerary for your next adventure."
        icon={Sparkles}
      />
      
      <div className="max-w-[800px] mx-auto px-4 md:px-8 mt-8">
        
        <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            {/* Progress */}
            <div className="flex items-center justify-between mb-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-primary text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                    {i}
                  </div>
                </div>
              ))}
              <div className="absolute top-5 left-8 right-8 h-[2px] bg-white/5 -z-10">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
              </div>
            </div>

            {/* Step Content placeholder */}
            <div className="min-h-[300px]">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2">Where do you want to go?</h3>
                  <p className="text-white/60 mb-6">Enter a city, country, or region.</p>
                  <input 
                    type="text" 
                    placeholder="e.g., Paris, Japan, Amalfi Coast" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                  />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2">When are you traveling?</h3>
                  <p className="text-white/60 mb-6">Select your dates or duration.</p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="text-white font-medium mb-1">Exact Dates</div>
                        <div className="text-white/50 text-sm">I know when I'm going</div>
                     </div>
                     <div className="bg-white/5 border border-primary/50 bg-primary/5 rounded-2xl p-6 text-center cursor-pointer transition-colors shadow-[0_0_20px_rgba(56,189,248,0.1)]">
                        <div className="text-white font-medium mb-1">Flexible Dates</div>
                        <div className="text-white/50 text-sm">Recommend best time</div>
                     </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2">What is your budget?</h3>
                  <p className="text-white/60 mb-6">This helps us recommend the right places.</p>
                  <div className="flex flex-col gap-3">
                     {['Budget (₹5,000 - ₹20,000)', 'Moderate (₹20,000 - ₹50,000)', 'Luxury (₹50,000+)'].map(b => (
                        <div key={b} className="bg-white/5 border border-white/10 rounded-xl p-4 text-white hover:bg-white/10 transition-colors cursor-pointer">
                          {b}
                        </div>
                     ))}
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 relative">
                     <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                     <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Generating Your Itinerary</h3>
                  <p className="text-white/60">Our AI is crunching millions of data points to craft your perfect trip...</p>
                </div>
              )}
            </div>

            {/* Navigation */}
            {step < 4 && (
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(Math.max(1, step - 1))}
                  className={step === 1 ? 'invisible' : 'text-white/60 hover:text-white'}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(Math.min(4, step + 1))}
                  className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 flex items-center gap-2"
                >
                  {step === 3 ? 'Generate Trip' : 'Continue'}
                  {step < 3 && <Navigation className="w-4 h-4 rotate-90" />}
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
