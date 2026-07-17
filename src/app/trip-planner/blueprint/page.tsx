"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Check, MapPin, Cloud, Sun, Utensils, Hotel, Train, Star, 
  AlertTriangle, Sparkles, ChevronRight, ArrowLeft, Clock, 
  DollarSign, Users, Heart, Compass, ThermometerSun, Sunrise, Sunset, Shield, Plus, Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlueprintPage() {
  const router = useRouter();
  const [blueprint, setBlueprint] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("tripvora_blueprint");
    if (data) {
      try {
        setBlueprint(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse blueprint", e);
        router.push("/trip-planner");
      }
    } else {
      router.push("/trip-planner");
    }
  }, [router]);

  if (!blueprint) return null;

  const handleToggleSelection = (category: 'attractions' | 'restaurants' | 'hotels', id: string) => {
    const updated = { ...blueprint };
    if (category === 'hotels') {
      updated.hotels = updated.hotels.map((h: any) => ({ ...h, isSelected: h.id === id }));
    } else {
      updated[category] = updated[category].map((item: any) => 
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      );
    }
    setBlueprint(updated);
  };

  const handleGenerate = () => {
    localStorage.setItem("tripvora_blueprint", JSON.stringify(blueprint));
    router.push("/trip-planner/generating");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans pb-32">
      {/* Navbar / Header */}
      <div className="sticky top-0 z-40 bg-[#050816]/80 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/trip-planner")} className="flex items-center text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="font-sora font-bold text-lg">Trip Blueprint</div>
          <div className="w-16"></div> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* 1. Hero Section */}
        <section className="relative h-64 rounded-[32px] overflow-hidden">
          <img 
            src={blueprint.heroImage || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"} 
            alt={blueprint.destination.primaryHub.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl md:text-5xl font-black font-sora mb-2">{blueprint.destination.primaryHub.name}</h1>
            <p className="text-slate-300 text-lg">
              {blueprint.userPreferences.duration.days || 3} Days • {blueprint.userPreferences.travelType}
            </p>
          </div>
        </section>

        {/* 12. Warnings Panel */}
        {blueprint.warnings?.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold font-sora flex items-center"><AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" /> Attention Needed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blueprint.warnings.map((w: any, idx: number) => (
                <div key={idx} className={`p-4 rounded-xl border ${
                  w.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                  w.severity === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <h3 className={`font-bold mb-1 ${
                    w.severity === 'critical' ? 'text-red-400' :
                    w.severity === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>{w.title}</h3>
                  <p className="text-sm text-slate-300 mb-2">{w.message}</p>
                  {w.suggestion && <p className="text-xs text-slate-400 font-medium">Suggestion: {w.suggestion}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. AI Understanding Summary */}
        <section>
          <h2 className="text-2xl font-bold font-sora mb-6">AI Trip Understanding</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center">
              <Check className="w-5 h-5 text-teal-400 mr-3 shrink-0" />
              <div><div className="text-xs text-slate-400">Budget</div><div className="font-medium">₹{blueprint.userPreferences.budget}</div></div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center">
              <Check className="w-5 h-5 text-teal-400 mr-3 shrink-0" />
              <div><div className="text-xs text-slate-400">Pace</div><div className="font-medium capitalize">{blueprint.userPreferences.pace}</div></div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center">
              <Check className="w-5 h-5 text-teal-400 mr-3 shrink-0" />
              <div><div className="text-xs text-slate-400">Food</div><div className="font-medium capitalize">{blueprint.userPreferences.foodPreference?.[0] || 'Any'}</div></div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center">
              <Check className="w-5 h-5 text-teal-400 mr-3 shrink-0" />
              <div><div className="text-xs text-slate-400">Interests</div><div className="font-medium truncate">{blueprint.userPreferences.interests.join(", ")}</div></div>
            </div>
          </div>
        </section>

        {/* 4. Weather Preview */}
        {blueprint.weather?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-sora mb-6">Weather Forecast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {blueprint.weather.map((day: any, idx: number) => (
                <div key={idx} className={`snap-start min-w-[200px] p-4 rounded-2xl border ${!day.isOutdoorSafe ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="text-sm font-bold mb-2">Day {day.day} <span className="text-slate-400 font-normal">({day.date})</span></div>
                  <div className="flex items-center gap-3 mb-3">
                    <ThermometerSun className="w-8 h-8 text-yellow-400" />
                    <div>
                      <div className="text-xl font-bold">{day.temperatureMax}°</div>
                      <div className="text-xs text-slate-400">{day.description}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 border-t border-white/10 pt-3">
                    <div className="flex items-center"><Cloud className="w-3 h-3 mr-1"/> {day.rainProbability}% Rain</div>
                    <div className="flex items-center"><Sunrise className="w-3 h-3 mr-1"/> {day.sunrise}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Discovered Attractions */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-sora">Discovered Attractions</h2>
            <div className="text-sm text-slate-400">{blueprint.attractions.filter((a:any) => a.isSelected).length} Selected</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blueprint.attractions.map((attr: any) => (
              <div key={attr.id} className={`group relative rounded-2xl overflow-hidden border transition-all ${attr.isSelected ? 'border-teal-500/50 bg-teal-500/5' : 'border-white/10 bg-white/5 grayscale-[50%]'}`}>
                <div className="h-40 bg-slate-800 relative">
                  {attr.imageUrl && <img src={attr.imageUrl} className="w-full h-full object-cover opacity-80" alt={attr.name} />}
                  <button 
                    onClick={() => handleToggleSelection('attractions', attr.id)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-colors ${
                      attr.isSelected ? 'bg-teal-500 text-white border-teal-400' : 'bg-black/50 text-slate-300 border-white/20'
                    }`}
                  >
                    {attr.isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                  {attr.clusterId && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-teal-300">
                      {blueprint.clusters.find((c:any) => c.id === attr.clusterId)?.name || 'Local'}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{attr.name}</h3>
                  <div className="flex items-center text-xs text-slate-400 gap-3">
                    <span className="flex items-center"><Star className="w-3 h-3 text-yellow-400 mr-1"/> {attr.rating} ({attr.userRatingsTotal})</span>
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {attr.distanceKm?.toFixed(1)} km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Hotels */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-sora">Accommodation</h2>
            <div className="text-sm text-slate-400">Choose your base</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blueprint.hotels.map((hotel: any) => (
              <div key={hotel.id} 
                onClick={() => handleToggleSelection('hotels', hotel.id)}
                className={`cursor-pointer rounded-2xl p-4 flex gap-4 border transition-all ${
                  hotel.isSelected ? 'border-teal-500 bg-teal-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                  {hotel.imageUrl ? <img src={hotel.imageUrl} className="w-full h-full object-cover" alt={hotel.name} /> : <Hotel className="w-10 h-10 m-7 text-slate-500" />}
                </div>
                <div className="flex-1 py-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold">{hotel.name}</h3>
                    {hotel.isSelected && <Check className="w-5 h-5 text-teal-400" />}
                  </div>
                  <div className="flex items-center text-xs text-slate-400 gap-3 mb-2">
                    <span className="flex items-center"><Star className="w-3 h-3 text-yellow-400 mr-1"/> {hotel.rating}</span>
                    <span className="px-1.5 py-0.5 bg-slate-800 rounded">{hotel.tierLabel}</span>
                  </div>
                  <div className="text-teal-400 font-bold text-sm">~₹{hotel.estimatedPricePerNight} <span className="text-slate-500 text-xs font-normal">/ night</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Restaurants */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-sora">Dining Recommendations</h2>
            <div className="text-sm text-slate-400">{blueprint.restaurants.filter((r:any) => r.isSelected).length} Selected</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {blueprint.restaurants.slice(0,9).map((rest: any) => (
              <div key={rest.id} className={`rounded-2xl p-3 flex gap-3 border transition-all ${
                rest.isSelected ? 'border-teal-500/30 bg-teal-500/5' : 'border-white/10 bg-white/5 grayscale-[50%]'
              }`}>
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                  {rest.imageUrl ? <img src={rest.imageUrl} className="w-full h-full object-cover" alt={rest.name} /> : <Utensils className="w-8 h-8 m-4 text-slate-500" />}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-sm line-clamp-1">{rest.name}</h3>
                  <div className="text-xs text-slate-400 mb-1">{rest.cuisine} • {Array(rest.priceLevel || 2).fill('₹').join('')}</div>
                  <div className="flex items-center text-[10px] text-yellow-400"><Star className="w-3 h-3 mr-1"/> {rest.rating}</div>
                </div>
                <button onClick={() => handleToggleSelection('restaurants', rest.id)} className="self-center p-2 text-slate-400 hover:text-white">
                  {rest.isSelected ? <Check className="w-5 h-5 text-teal-400" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        </section>
        
        {/* 10. Budget Preview */}
        <section>
          <h2 className="text-2xl font-bold font-sora mb-6">Budget Overview</h2>
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
              <div>
                <div className="text-sm text-slate-400 mb-1">Total Budget</div>
                <div className="text-4xl font-black font-sora">₹{blueprint.budgetPreview.totalBudget.toLocaleString()}</div>
              </div>
              <div className="flex-1 max-w-md w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Planned: ₹{blueprint.budgetPreview.totalPlanned.toLocaleString()}</span>
                  <span className={`${blueprint.budgetPreview.remaining < 0 ? 'text-red-400' : 'text-teal-400'} font-bold`}>
                    {blueprint.budgetPreview.remaining < 0 ? 'Over Budget' : `Remaining: ₹${blueprint.budgetPreview.remaining.toLocaleString()}`}
                  </span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-500" style={{ width: `${(blueprint.budgetPreview.breakdown.accommodation.total / blueprint.budgetPreview.totalBudget) * 100}%` }}></div>
                  <div className="h-full bg-teal-500" style={{ width: `${(blueprint.budgetPreview.breakdown.food.total / blueprint.budgetPreview.totalBudget) * 100}%` }}></div>
                  <div className="h-full bg-purple-500" style={{ width: `${(blueprint.budgetPreview.breakdown.transport.total / blueprint.budgetPreview.totalBudget) * 100}%` }}></div>
                  <div className="h-full bg-yellow-500" style={{ width: `${(blueprint.budgetPreview.breakdown.activities.total / blueprint.budgetPreview.totalBudget) * 100}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
              <div>
                <div className="flex items-center text-xs text-slate-400 mb-1"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>Hotel</div>
                <div className="font-bold">₹{blueprint.budgetPreview.breakdown.accommodation.total.toLocaleString()}</div>
              </div>
              <div>
                <div className="flex items-center text-xs text-slate-400 mb-1"><div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>Food</div>
                <div className="font-bold">₹{blueprint.budgetPreview.breakdown.food.total.toLocaleString()}</div>
              </div>
              <div>
                <div className="flex items-center text-xs text-slate-400 mb-1"><div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>Transport</div>
                <div className="font-bold">₹{blueprint.budgetPreview.breakdown.transport.total.toLocaleString()}</div>
              </div>
              <div>
                <div className="flex items-center text-xs text-slate-400 mb-1"><div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>Activities</div>
                <div className="font-bold">₹{blueprint.budgetPreview.breakdown.activities.total.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050816] via-[#050816]/90 to-transparent z-50">
        <div className="max-w-6xl mx-auto flex justify-end">
          <Button 
            onClick={handleGenerate}
            className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-[#050816] font-bold h-14 px-8 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.3)] text-lg border-none"
          >
            <Check className="w-5 h-5 mr-2" />
            Generate My Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
}
