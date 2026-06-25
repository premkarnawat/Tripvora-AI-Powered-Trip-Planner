"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, MapPin, Calendar, Users, DollarSign, Hotel, Map, Coffee, 
  FileText, Download, ArrowRight, Settings, ChevronDown, Check, 
  ArrowLeft, Info, Percent, ShieldCheck, FileCheck, RefreshCw, 
  Printer, Share2, Phone, Bot, CheckSquare, Compass, Send, Trash2, 
  Plus, AlertCircle, FileSpreadsheet, Layers, ShieldAlert, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- MOCK VENDOR DATA BASE FOR V2.0 ---
const TIER_VENDORS = {
  budget: {
    hotel: { name: "Ibis Styles Bali Legian", cost: 3500, stars: 3, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60" },
    activity: { name: "Self-guided Uluwatu Sunset Walk", cost: 800 },
    transfer: { name: "Private Toyota Avanza (Standard)", cost: 1800 }
  },
  standard: {
    hotel: { name: "Grand Hyatt Bali (Nusa Dua)", cost: 12000, stars: 5, img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&auto=format&fit=crop&q=60" },
    activity: { name: "Private Uluwatu Sunset Tour & Kecak Dance", cost: 4500 },
    transfer: { name: "Private Toyota Innova Crysta", cost: 3000 }
  },
  premium: {
    hotel: { name: "W Bali Seminyak (Marriott)", cost: 24000, stars: 5, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60" },
    activity: { name: "Nusa Penida Snorkeling Speedboat Adventure", cost: 8000 },
    transfer: { name: "Private Toyota Alphard (VIP)", cost: 6000 }
  },
  luxury: {
    hotel: { name: "Umana Bali (LXR Luxury Resorts)", cost: 42000, stars: 5, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=60" },
    activity: { name: "Helicopter Island Flyover & Private Chef Sunset", cost: 28000 },
    transfer: { name: "Private Mercedes-Benz S-Class", cost: 12000 }
  }
};

export default function PackageBuilderPageV2() {
  // Mocks fallback just in case DB is empty for demo purposes
  const [vendorLibrary, setVendorLibrary] = useState<any>({
    hotels: [
      { id: "h-1", name: "Grand Hyatt Bali (Nusa Dua)", cost: 12000, rating: 4.8, desc: "Premium beachfront resort, exclusive contract rates." },
      { id: "h-2", name: "W Bali Seminyak", cost: 24000, rating: 4.9, desc: "Vibrant beachside luxury. 15% margin bonus." },
    ],
    activities: [
      { id: "a-1", name: "Private Uluwatu Sunset Tour & Kecak Dance", cost: 4500, desc: "Includes private guide and reserved VIP seats." },
    ],
    transfers: [
      { id: "t-1", name: "Private Toyota Alphard (VIP)", cost: 6000 },
    ],
    guides: [], meals: [], cruises: [], flights: [], insurance: []
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch('/api/crm/vendors');
        if (res.ok) {
          const data = await res.json();
          if (data.vendors && data.vendors.length > 0) {
            const grouped: any = { hotels: [], activities: [], transfers: [], guides: [], meals: [], cruises: [], flights: [], insurance: [] };
            data.vendors.forEach((v: any) => {
              if (grouped[v.category]) {
                grouped[v.category].push({
                  id: v.id,
                  name: v.name,
                  cost: v.cost_price,
                  selling_price: v.selling_price,
                  rating: v.rating,
                  desc: v.description
                });
              }
            });
            setVendorLibrary(grouped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
      }
    };
    fetchVendors();
  }, []);
  // Steps: 1 = Client Details & Mode, 2 = AI Loader, 3 = Split-screen matching, 4 = Three-Column Quotation Dashboard
  const [step, setStep] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  // Client Details Form State
  const [clientName, setClientName] = useState("Priya Sharma");
  const [clientEmail, setClientEmail] = useState("priya@sharmavacations.in");
  const [clientPhone, setClientPhone] = useState("+91 98765 43210");
  const [destination, setDestination] = useState("Bali, Indonesia");
  const [startDate, setStartDate] = useState("2026-07-15");
  const [endDate, setEndDate] = useState("2026-07-20");
  const [nights, setNights] = useState(5);
  const [members, setMembers] = useState(2);
  const [budget, setBudget] = useState("250000");
  const [travelStyle, setTravelStyle] = useState("Luxury & Leisure");
  const [planningSource, setPlanningSource] = useState("hybrid"); // 'ai' | 'vendor' | 'hybrid'
  const [specialRequirements, setSpecialRequirements] = useState("Beachfront properties, vegetarian dinners, private transfers only.");

  // Quotation Metadata
  const [quoteNumber, setQuoteNumber] = useState("QT-2026-09842");
  const [issueDate, setIssueDate] = useState("2026-06-22");
  const [validTill, setValidTill] = useState("2026-06-29");
  
  // Pipeline State
  const [pipelineState, setPipelineState] = useState("Quotation Sent"); // Sent, Viewed, Replied, Follow Up, Booked, Lost

  // Active Selected Day in Timeline
  const [activeDay, setActiveDay] = useState(1);
  
  // Right side library filter tab in Step 3
  const [matcherTab, setMatcherTab] = useState("hotels");
  
  // PDF Preview Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfPage, setPdfPage] = useState(1);

  // Pricing Model State in Step 4
  const [pricingMode, setPricingMode] = useState("total"); // 'detail' | 'total' | 'fixed'
  
  // Financial Values
  const [marginPercent, setMarginPercent] = useState(20);
  const [desiredProfit, setDesiredProfit] = useState(30000);
  const [isGstEnabled, setIsGstEnabled] = useState(true);
  const [gstPercent, setGstPercent] = useState(5); // 5% standard package tour GST
  const [gstType, setGstType] = useState("split"); // 'split' (CGST/SGST) or 'igst'
  const [gstNumber, setGstNumber] = useState("07AAAAA1111A1Z1");
  const [discountType, setDiscountType] = useState("percentage"); // 'percentage' | 'fixed' | 'festival' | 'coupon'
  const [discountValue, setDiscountValue] = useState(5); // 5% or Flat amount
  
  // Advance payment config
  const [advanceAmount, setAdvanceAmount] = useState(50000);

  // Current Dynamic Components in Itinerary
  const [componentsList, setComponentsList] = useState<any>({
    accommodation: [
      { id: "comp-ac-1", day: "All Nights", name: "AI Recommendation: Ayana Resort Bali", cost: 18000, qty: 5, sellingPrice: 21500, isContract: false }
    ],
    transport: [
      { id: "comp-tr-1", day: "Daily", name: "AI Recommendation: Private Toyota Avanza", cost: 2500, qty: 5, sellingPrice: 3200, isContract: false }
    ],
    activities: [
      { id: "comp-act-1", day: "Day 1", name: "AI Recommendation: Jimbaran Beach Walk", cost: 0, qty: 1, sellingPrice: 0, isContract: false },
      { id: "comp-act-2", day: "Day 2", name: "AI Recommendation: Ubud Art Village & Rice Terraces", cost: 4000, qty: 1, sellingPrice: 5000, isContract: false },
      { id: "comp-act-3", day: "Day 3", name: "AI Recommendation: Nusa Penida Snorkeling", cost: 7500, qty: 1, sellingPrice: 9000, isContract: false }
    ],
    meals: [
      { id: "comp-ml-1", day: "Daily", name: "AI Recommendation: Daily Buffet Breakfast", cost: 1200, qty: 5, sellingPrice: 1500, isContract: false }
    ],
    guides: [],
    insurance: [],
    cruises: [],
    flights: [],
    visa: [
      { id: "comp-vs-1", day: "Pre-departure", name: "Visa on Arrival Assistance", cost: 3000, qty: 2, sellingPrice: 3500, isContract: true }
    ],
    transfers: [
      { id: "comp-at-1", day: "Day 1 & Day 6", name: "Airport transfers VIP meet", cost: 4000, qty: 1, sellingPrice: 5000, isContract: true }
    ],
    misc: []
  });

  const [inclusions, setInclusions] = useState<string[]>([
    "5 Nights Accommodation in selected luxury villa",
    "Private Airport Transfers in VIP Fleet",
    "Daily buffet breakfast at resorts",
    "Private English Speaking Tour Guide assistance",
    "GST and all local Indonesia Taxes included"
  ]);

  const [exclusions, setExclusions] = useState<string[]>([
    "International Airfare tickets",
    "Personal expenses (laundry, telephone calls, minibar)",
    "Travel Insurance coverage",
    "Tips for guides and drivers"
  ]);

  // Initializing Itinerary on load/step 2 trigger
  const generateBaseItinerary = () => {
    // Fills components list based on initial selections
    setComponentsList({
      accommodation: [
        { id: "comp-ac-1", day: "All Nights", name: "AI Recommendation: Ayana Resort Bali", cost: 18000, qty: nights, sellingPrice: 21500, isContract: false }
      ],
      transport: [
        { id: "comp-tr-1", day: "Daily", name: "AI Recommendation: Private Toyota Avanza", cost: 2500, qty: nights, sellingPrice: 3200, isContract: false }
      ],
      activities: [
        { id: "comp-act-1", day: "Day 1", name: "AI Recommendation: Jimbaran Beach Sunset Walk", cost: 1000, qty: 1, sellingPrice: 1500, isContract: false },
        { id: "comp-act-2", day: "Day 2", name: "AI Recommendation: Ubud Art Village & Rice Terraces", cost: 4000, qty: 1, sellingPrice: 5000, isContract: false },
        { id: "comp-act-3", day: "Day 3", name: "AI Recommendation: Nusa Penida Snorkeling", cost: 7500, qty: 1, sellingPrice: 9000, isContract: false },
        { id: "comp-act-4", day: "Day 4", name: "AI Recommendation: Uluwatu Temple Kecak Dance", cost: 3000, qty: 1, sellingPrice: 3800, isContract: false }
      ],
      meals: [
        { id: "comp-ml-1", day: "Daily", name: "AI Recommendation: Daily Buffet Breakfast", cost: 1200, qty: nights, sellingPrice: 1500, isContract: false }
      ],
      guides: [],
      insurance: [],
      cruises: [],
      flights: [],
      visa: [
        { id: "comp-vs-1", day: "Pre-departure", name: "Bali Visa on Arrival Assistance", cost: 3000, qty: members, sellingPrice: 3500, isContract: true }
      ],
      transfers: [
        { id: "comp-at-1", day: "Day 1 & Day 6", name: "Airport Private Transfers VIP", cost: 4000, qty: 1, sellingPrice: 5000, isContract: true }
      ],
      misc: []
    });
  };

  // Step 2 Loader Effect
  useEffect(() => {
    if (step === 2) {
      generateBaseItinerary();
      let progress = 0;
      const texts = [
        "Initializing Travixa AI Core Engine...",
        "Scoping Destination Database & Places API...",
        "Checking signed contracts in Elite Travels Vendor Library...",
        "Balancing margin parameters & final day-wise routing..."
      ];
      setLoadingText(texts[0]);
      
      const interval = setInterval(() => {
        progress += 25;
        setLoadingProgress(progress);
        const textIdx = Math.min(Math.floor(progress / 25), texts.length - 1);
        setLoadingText(texts[textIdx]);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep(3); // Go to Split Screen Matcher
          }, 400);
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Master Financial Pricing Calculator
  const getPricingTotals = () => {
    let totalVendorCost = 0;
    let detailModeSubtotal = 0;

    // Sum up all categories
    Object.keys(componentsList).forEach(cat => {
      componentsList[cat].forEach((item: any) => {
        totalVendorCost += (item.cost || 0) * (item.qty || 1);
        detailModeSubtotal += (item.sellingPrice || 0) * (item.qty || 1);
      });
    });

    let subtotalPrice = 0;
    let profitAmount = 0;

    // Mode calculations
    if (pricingMode === "detail") {
      subtotalPrice = detailModeSubtotal;
      profitAmount = subtotalPrice - totalVendorCost;
    } else if (pricingMode === "total") {
      profitAmount = Math.round(totalVendorCost * (marginPercent / 100));
      subtotalPrice = totalVendorCost + profitAmount;
    } else if (pricingMode === "fixed") {
      profitAmount = desiredProfit;
      subtotalPrice = totalVendorCost + profitAmount;
    }

    // Discount calculations
    let discountAmount = 0;
    if (discountType === "percentage") {
      discountAmount = Math.round(subtotalPrice * (discountValue / 100));
    } else {
      discountAmount = Math.min(discountValue, subtotalPrice);
    }

    const priceAfterDiscount = subtotalPrice - discountAmount;

    // GST calculations
    let gstAmount = 0;
    if (isGstEnabled) {
      gstAmount = Math.round(priceAfterDiscount * (gstPercent / 100));
    }

    const finalCustomerPrice = priceAfterDiscount + gstAmount;
    const outstandingAmount = Math.max(0, finalCustomerPrice - advanceAmount);

    return {
      totalVendorCost,
      subtotalPrice,
      profitAmount,
      discountAmount,
      priceAfterDiscount,
      gstAmount,
      finalCustomerPrice,
      outstandingAmount
    };
  };

  const {
    totalVendorCost,
    subtotalPrice,
    profitAmount,
    discountAmount,
    priceAfterDiscount,
    gstAmount,
    finalCustomerPrice,
    outstandingAmount
  } = getPricingTotals();

  // Smart matching detector
  const getSmartMatchingAlerts = () => {
    const alerts = [];
    // If accommodation is AI
    const acc = componentsList.accommodation[0];
    if (acc && !acc.isContract) {
      alerts.push({
        type: "hotel",
        title: "Replace Stay with Hotel Paradise Seminyak?",
        desc: "Increases profit by ₹700 per night. Contract matches parameters.",
        saving: 700 * nights,
        action: () => handleReplaceComponent("accommodation", acc.id, {
          name: "Hotel Paradise Seminyak (Contract Match)",
          cost: 2800,
          sellingPrice: 3500,
          isContract: true
        })
      });
    }
    // If transport is AI
    const trans = componentsList.transport[0];
    if (trans && !trans.isContract) {
      alerts.push({
        type: "transport",
        title: "Replace Cab with Contract Innova?",
        desc: "Saves ₹300 per day in base cost with a higher traveler rating.",
        saving: 300 * nights,
        action: () => handleReplaceComponent("transport", trans.id, {
          name: "Private Toyota Innova (Contract Match)",
          cost: 2200,
          sellingPrice: 2800,
          isContract: true
        })
      });
    }
    return alerts;
  };

  const smartAlerts = getSmartMatchingAlerts();

  // Component Actions helper
  const handleReplaceComponent = (category: string, id: string, newFields: any) => {
    const updated = componentsList[category].map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          ...newFields
        };
      }
      return item;
    });
    setComponentsList({
      ...componentsList,
      [category]: updated
    });
  };

  const handleAddNewComponent = (category: string) => {
    const newId = `comp-${category}-${Date.now()}`;
    const newComp = {
      id: newId,
      day: "TBD",
      name: "New Custom Vendor Component",
      cost: 1000,
      qty: 1,
      sellingPrice: 1500,
      isContract: true
    };
    setComponentsList({
      ...componentsList,
      [category]: [...componentsList[category], newComp]
    });
  };

  const handleRemoveComponent = (category: string, id: string) => {
    const filtered = componentsList[category].filter((item: any) => item.id !== id);
    setComponentsList({
      ...componentsList,
      [category]: filtered
    });
  };

  // Variant generator in one click
  const applyPackageVariant = (tier: "budget" | "standard" | "premium" | "luxury") => {
    const selection = TIER_VENDORS[tier];
    
    // Update accommodation, activities, and transport to the select tier values
    const updatedAcc = componentsList.accommodation.map((item: any) => ({
      ...item,
      name: selection.hotel.name + ` (${tier.toUpperCase()} TIER)`,
      cost: selection.hotel.cost,
      sellingPrice: Math.round(selection.hotel.cost * 1.25),
      isContract: true
    }));

    const updatedTrans = componentsList.transport.map((item: any) => ({
      ...item,
      name: selection.transfer.name,
      cost: selection.transfer.cost,
      sellingPrice: Math.round(selection.transfer.cost * 1.3),
      isContract: true
    }));

    const updatedAct = componentsList.activities.map((item: any, i: number) => {
      if (i === 1) { // Apply only to active tours
        return {
          ...item,
          name: selection.activity.name,
          cost: selection.activity.cost,
          sellingPrice: Math.round(selection.activity.cost * 1.25),
          isContract: true
        };
      }
      return item;
    });

    setComponentsList({
      ...componentsList,
      accommodation: updatedAcc,
      transport: updatedTrans,
      activities: updatedAct
    });

    // Update margin inputs based on class
    if (tier === "budget") {
      setMarginPercent(10);
      setDesiredProfit(12000);
    } else if (tier === "standard") {
      setMarginPercent(18);
      setDesiredProfit(25000);
    } else if (tier === "premium") {
      setMarginPercent(25);
      setDesiredProfit(55000);
    } else if (tier === "luxury") {
      setMarginPercent(35);
      setDesiredProfit(95000);
    }
  };

  // AI Copilot operations
  const applyCopilotAction = (action: string) => {
    if (action === "find_cheaper") {
      applyPackageVariant("budget");
    } else if (action === "increase_profit") {
      setMarginPercent(prev => Math.min(prev + 5, 50));
    } else if (action === "reduce_budget") {
      setDiscountType("percentage");
      setDiscountValue(10);
    } else if (action === "upgrade_luxury") {
      applyPackageVariant("luxury");
    } else if (action === "honeymoon_version") {
      applyPackageVariant("premium");
      setSpecialRequirements(prev => prev + " Added Honeymoon decorations & Sunset Dinner.");
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-10">
      
      {/* STEP 1: PARAMETERS & MODE SELECTOR */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">AI Package & Proposal Engine V2.0</h1>
              <p className="text-xs text-[#64748B] mt-0.5">Generate, audit margins, match contract rates, and export beautiful client quotations.</p>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Luxury SaaS Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Parameters form */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-widest flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4 text-teal-600" /> Dynamic Proposal Fields
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input 
                      type="text" 
                      value={destination} 
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 pr-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-bold" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Start Date</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">End Date</label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Nights Count</label>
                    <input 
                      type="number" 
                      value={nights} 
                      onChange={(e) => setNights(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Passengers</label>
                    <input 
                      type="number" 
                      value={members} 
                      onChange={(e) => setMembers(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Client Target Budget (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input 
                      type="text" 
                      value={budget} 
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 pr-3 text-xs text-[#0F172A] font-mono focus:outline-none focus:border-teal-500 font-bold" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Travel Style</label>
                  <select 
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium"
                  >
                    <option>Luxury & Leisure</option>
                    <option>Adventure & Explorer</option>
                    <option>Honeymoon Special</option>
                    <option>Corporate Retreat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Client Info & Mode selections */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Contact Data Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#0F172A] mb-4">Client Contact & Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Client Name</label>
                    <input 
                      type="text" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">WhatsApp Phone</label>
                    <input 
                      type="text" 
                      value={clientPhone} 
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Email ID</label>
                    <input 
                      type="email" 
                      value={clientEmail} 
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider mb-1 block">Special Requirements / Notes</label>
                  <textarea 
                    value={specialRequirements} 
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-3 text-xs text-[#0F172A] focus:outline-none focus:border-teal-500 font-medium resize-none"
                  />
                </div>
              </div>

              {/* Mode Selection panel */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#0F172A]">Select Itinerary Planning Source Mode</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* AI Recommended Mode */}
                  <div 
                    onClick={() => setPlanningSource("ai")}
                    className={`border rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between h-44 ${
                      planningSource === "ai" 
                        ? "border-sky-500 bg-sky-50/30 ring-1 ring-sky-500 shadow-sm" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                          <Compass className="w-4 h-4 text-sky-600" />
                        </div>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded">
                          AI First
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] mt-3">AI Recommended Mode</h4>
                      <p className="text-[10px] text-[#64748B] mt-1.5 leading-relaxed">
                        Pulls details dynamically from Google Places, TripAdvisor reviews, and airline/hotel affiliate channels.
                      </p>
                    </div>
                    <span className="text-[10px] text-sky-600 font-bold flex items-center gap-1 mt-2">
                      Best for fast quotations →
                    </span>
                  </div>

                  {/* Agency Vendor Mode */}
                  <div 
                    onClick={() => setPlanningSource("vendor")}
                    className={`border rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between h-44 ${
                      planningSource === "vendor" 
                        ? "border-teal-600 bg-teal-50/20 ring-1 ring-teal-600 shadow-sm" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Hotel className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded">
                          Contracts
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] mt-3">Agency Vendor Mode</h4>
                      <p className="text-[10px] text-[#64748B] mt-1.5 leading-relaxed">
                        Matches stays and experiences 100% against your pre-signed corporate vendor contracts.
                      </p>
                    </div>
                    <span className="text-[10px] text-teal-600 font-bold flex items-center gap-1 mt-2">
                      Best for zero out-of-pocket costs →
                    </span>
                  </div>

                  {/* Hybrid Mode */}
                  <div 
                    onClick={() => setPlanningSource("hybrid")}
                    className={`border rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between h-44 relative overflow-hidden ${
                      planningSource === "hybrid" 
                        ? "border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600 shadow-sm" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white font-extrabold text-[8px] uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                      Recommended
                    </div>
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] mt-3">Hybrid Mode</h4>
                      <p className="text-[10px] text-[#64748B] mt-1.5 leading-relaxed">
                        Pulls base day-wise structure from AI suggestions, then matches and swaps in contract items for maximum margin.
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
                      Best for maximum agency profit →
                    </span>
                  </div>

                </div>
              </div>

              {/* Generate CTA Button */}
              <Button 
                onClick={() => setStep(2)}
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-sm transition-all shadow-[0_4px_14px_rgba(13,148,136,0.3)] flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" /> Generate V2.0 Travel Proposal
              </Button>

            </div>

          </div>
        </div>
      )}

      {/* STEP 2: LOADING CHECKS ANIMATION */}
      {step === 2 && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-teal-600 animate-spin" />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
              <Bot className="w-8 h-8 text-teal-600 animate-pulse" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-[#0F172A]">AI Engine Optimizing Proposals</h3>
            <p className="text-xs text-[#64748B] font-medium animate-pulse">{loadingText}</p>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300 rounded-full" 
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">{loadingProgress}% Complete</span>
        </div>
      )}

      {/* STEP 3: SPLIT-SCREEN VENDOR ASSIGNMENT */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(1)} 
                className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#64748B]" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-[#0F172A]">Step 3: Custom Vendor Assignment</h1>
                <p className="text-xs text-[#64748B] mt-0.5">Optimize profit by swapping AI recommendations with agency contracted rates.</p>
              </div>
            </div>
            <Button 
              onClick={() => setStep(4)} 
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold h-9 text-xs flex items-center gap-1.5"
            >
              Configure Pricing & Quotation <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Smart Vendor Matching alerts banner */}
          {smartAlerts.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold uppercase text-[#64748B] tracking-wider">Smart Vendor Matching Suggestions</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {smartAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex justify-between items-start gap-4 shadow-sm">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded bg-emerald-100 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0F172A]">{alert.title}</h4>
                        <p className="text-[10px] text-slate-600 mt-0.5">{alert.desc}</p>
                        <p className="text-[10px] text-emerald-700 font-bold mt-1">Extra Profit: +₹{alert.saving.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { alert.action(); alert.saving > 0 && alert.action(); }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all shrink-0"
                    >
                      Swap Component
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Split Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
            
            {/* Left Timeline Panel */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] border-b border-slate-100 pb-2">AI Generated Base Timeline</h3>
              
              <div className="space-y-6">
                {Array.from({ length: nights }).map((_, i) => {
                  const dayNum = i + 1;
                  return (
                    <div key={dayNum} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-xs font-extrabold text-teal-700 shrink-0 shadow-sm">
                          D{dayNum}
                        </div>
                        <div className="w-px h-full bg-slate-100 my-2" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-3">
                          <h4 className="text-xs font-bold text-[#0F172A]">Day {dayNum} Overview</h4>
                          
                          {/* Hotel stay detail */}
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-[#0F172A]">🏨 Hotel:</span>
                            <span className="text-slate-500 font-medium">
                              {componentsList.accommodation[0]?.name} (₹{componentsList.accommodation[0]?.cost.toLocaleString('en-IN')})
                            </span>
                          </div>

                          {/* Tour detail */}
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-[#0F172A]">🎟️ Tour:</span>
                            <span className="text-slate-500 font-medium">
                              {componentsList.activities[dayNum - 1]?.name || "Leisure day"}
                            </span>
                          </div>

                          {/* Transport detail */}
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-[#0F172A]">🚗 Cab:</span>
                            <span className="text-slate-500 font-medium">
                              {componentsList.transport[0]?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Vendor Selection Grids */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">Vendor Library Matcher</h3>
                <div className="flex gap-1 overflow-x-auto">
                  {["hotels", "activities", "transfers", "meals", "flights"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMatcherTab(tab)}
                      className={`px-3 py-1 text-[10px] font-bold rounded uppercase transition-colors shrink-0 ${
                        matcherTab === tab 
                          ? "bg-teal-600 text-white" 
                          : "bg-slate-50 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vendor Item Listing */}
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {matcherTab === "hotels" && vendorLibrary.hotels.map((vh: any) => (
                  <div key={vh.id} className="border border-slate-200 hover:border-teal-500 rounded-lg p-3.5 bg-white transition-all shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-[#0F172A]">{vh.name}</h4>
                      <span className="text-[10px] text-[#F59E0B] font-bold">★ {vh.rating}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug">{vh.desc}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-[8px] text-slate-400 font-extrabold uppercase">Base Rate</p>
                        <p className="text-xs font-bold text-[#0F172A] font-mono">₹{vh.cost.toLocaleString('en-IN')}/Night</p>
                      </div>
                      <button
                        onClick={() => {
                          handleReplaceComponent("accommodation", componentsList.accommodation[0].id, {
                            name: vh.name,
                            cost: vh.cost,
                            sellingPrice: Math.round(vh.cost * 1.25),
                            isContract: true
                          });
                          alert(`Replaced accommodation stays with ${vh.name}`);
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-extrabold px-3 py-1.5 rounded uppercase"
                      >
                        Assign To All Nights
                      </button>
                    </div>
                  </div>
                ))}

                {matcherTab === "activities" && vendorLibrary.activities.map((va: any) => (
                  <div key={va.id} className="border border-slate-200 hover:border-teal-500 rounded-lg p-3.5 bg-white transition-all shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-[#0F172A]">{va.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-snug">{va.desc}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-[8px] text-slate-400 font-extrabold uppercase">Contract price</p>
                        <p className="text-xs font-bold text-[#0F172A] font-mono">₹{va.cost.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleReplaceComponent("activities", componentsList.activities[0].id, {
                            name: va.name,
                            cost: va.cost,
                            sellingPrice: Math.round(va.cost * 1.3),
                            isContract: true
                          });
                          alert(`Assigned tour activity on timeline`);
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-extrabold px-3 py-1.5 rounded uppercase"
                      >
                        Swap Daily Activity
                      </button>
                    </div>
                  </div>
                ))}

                {matcherTab === "transfers" && vendorLibrary.transfers.map((vt: any) => (
                  <div key={vt.id} className="border border-slate-200 hover:border-teal-500 rounded-lg p-3.5 bg-white transition-all shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">{vt.name}</h4>
                      <p className="text-xs font-bold text-[#0F172A] font-mono mt-1">₹{vt.cost.toLocaleString('en-IN')}/Day</p>
                    </div>
                    <button
                      onClick={() => {
                        handleReplaceComponent("transport", componentsList.transport[0].id, {
                          name: vt.name,
                          cost: vt.cost,
                          sellingPrice: Math.round(vt.cost * 1.25),
                          isContract: true
                        });
                        alert(`Assigned VIP transport vehicle`);
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-extrabold px-3 py-1.5 rounded uppercase"
                    >
                      Assign Transport
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STEP 4: THREE COLUMN BUILDER & PRICING DASHBOARD */}
      {step === 4 && (
        <div className="space-y-6">
          
          {/* Main Top Actions Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(3)} 
                className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#64748B]" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-[#0F172A]">{nights} Nights Luxury {destination} Retreat</h1>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                    QUOTATION V2.0
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                    Quote ID: <strong className="text-[#0F172A]">{quoteNumber}</strong> • Client: <strong className="text-[#0F172A]">{clientName}</strong>
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={async () => {
                  try {
                    setLoadingText("Saving package to Supabase...");
                    const res = await fetch('/api/crm/packages', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: `${clientName} - ${destination}`,
                        destination,
                        start_date: startDate,
                        end_date: endDate,
                        nights,
                        budget: finalCustomerPrice, // target budget saved
                        total_amount: finalCustomerPrice,
                        pricing_metadata: {
                          mode: pricingMode,
                          gstType,
                          discountType,
                          discountValue
                        },
                        components: [
                          ...(componentsList.accommodation || []).map((h: any) => ({ category: 'accommodation', vendor_id: h.id, title: h.name, cost: h.cost, selling_price: h.sellingPrice || h.cost, qty: nights })),
                          ...(componentsList.activities || []).map((a: any) => ({ category: 'activity', vendor_id: a.id, title: a.name, cost: a.cost, selling_price: a.sellingPrice || a.cost, qty: 1 })),
                          ...(componentsList.transport || []).map((t: any) => ({ category: 'transport', vendor_id: t.id, title: t.name, cost: t.cost, selling_price: t.sellingPrice || t.cost, qty: 1 }))
                        ]
                      })
                    });
                    if (res.ok) {
                      setIsPdfModalOpen(true);
                    } else {
                      alert("Error saving package");
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="h-9 px-4 text-xs font-bold bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-200 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" /> Save & Preview PDF
              </Button>
              <Button 
                onClick={() => {
                  const encoded = encodeURIComponent(`Hi ${clientName}, here is the customized travel package for ${destination} we discussed. Total package cost is ₹${finalCustomerPrice.toLocaleString('en-IN')}. Let us know your thoughts!`);
                  window.open(`https://wa.me/?text=${encoded}`, "_blank");
                }}
                className="h-9 px-4 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white border-none shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Send via WhatsApp
              </Button>
            </div>
          </div>

          {/* Three Column Builder V2.0 Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: LEFT PANEL - Client & Summary Details (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Trip metadata */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider border-b border-slate-100 pb-2">Proposal Overview</h3>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[9px] font-extrabold text-[#64748B] uppercase block">Quote Number</label>
                    <input 
                      type="text" 
                      value={quoteNumber} 
                      onChange={(e) => setQuoteNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-[#0F172A] font-bold focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-extrabold text-[#64748B] uppercase block">Issue Date</label>
                      <input 
                        type="date" 
                        value={issueDate} 
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-[#64748B] uppercase block">Valid Till</label>
                      <input 
                        type="date" 
                        value={validTill} 
                        onChange={(e) => setValidTill(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-[#0F172A]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold text-[#64748B] uppercase block">Client Name</label>
                    <p className="font-bold text-[#0F172A]">{clientName}</p>
                    <p className="text-[10px] text-slate-500">{clientEmail}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold text-[#64748B] uppercase block">Travel Dates</label>
                    <p className="font-bold text-[#0F172A]">{startDate} to {endDate}</p>
                    <p className="text-[10px] text-slate-500">({nights} Nights / {nights + 1} Days)</p>
                  </div>
                </div>
              </div>

              {/* Conversion Pipeline Tracking */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider border-b border-slate-100 pb-2">Booking Conversion Status</h3>
                <div>
                  <select 
                    value={pipelineState} 
                    onChange={(e) => setPipelineState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs font-bold text-[#0F172A]"
                  >
                    <option>Quotation Sent</option>
                    <option>Quotation Viewed</option>
                    <option>Customer Replied</option>
                    <option>Follow Up Sent</option>
                    <option>Booked</option>
                    <option>Lost</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    pipelineState === "Booked" ? "bg-emerald-500" : pipelineState === "Lost" ? "bg-rose-500" : "bg-teal-500"
                  }`} />
                  <span className="text-[10px] text-[#64748B] font-bold">Conversion pipeline updated</span>
                </div>
              </div>

            </div>

            {/* COLUMN 2: CENTER PANEL - Package Components Detail List (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Components detailed builder list */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider">Package Quote Components</h3>
                  <span className="text-[10px] text-slate-400 font-medium">Verify costs below</span>
                </div>

                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  
                  {/* Category lists dynamically rendered */}
                  {Object.keys(componentsList).map((category) => {
                    const list = componentsList[category];
                    if (list.length === 0) return null;
                    return (
                      <div key={category} className="space-y-2 border-b border-slate-100 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                            {category}
                          </span>
                          <button 
                            onClick={() => handleAddNewComponent(category)}
                            className="text-[9px] text-[#64748B] hover:text-teal-600 font-bold flex items-center gap-0.5"
                          >
                            + Add Item
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {list.map((item: any) => (
                            <div key={item.id} className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 relative">
                              <button
                                onClick={() => handleRemoveComponent(category, item.id)}
                                className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              
                              <input 
                                type="text"
                                value={item.name}
                                onChange={(e) => handleReplaceComponent(category, item.id, { name: e.target.value })}
                                className="w-[85%] bg-transparent border-b border-transparent hover:border-slate-200 focus:border-teal-500 font-bold text-xs text-[#0F172A] focus:outline-none"
                              />

                              <div className="grid grid-cols-3 gap-2 pt-1.5">
                                <div>
                                  <label className="text-[8px] text-slate-400 font-extrabold uppercase">Cost (Internal)</label>
                                  <input 
                                    type="number"
                                    value={item.cost}
                                    onChange={(e) => handleReplaceComponent(category, item.id, { cost: Number(e.target.value) })}
                                    className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-[#0F172A] font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-[8px] text-slate-400 font-extrabold uppercase">Qty / Nights</label>
                                  <input 
                                    type="number"
                                    value={item.qty}
                                    onChange={(e) => handleReplaceComponent(category, item.id, { qty: Number(e.target.value) })}
                                    className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-[#0F172A] font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="text-[8px] text-slate-400 font-extrabold uppercase">Sell Price</label>
                                  <input 
                                    type="number"
                                    value={item.sellingPrice}
                                    onChange={(e) => handleReplaceComponent(category, item.id, { sellingPrice: Number(e.target.value) })}
                                    className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-[#0F172A] font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Inclusions</h4>
                    <div className="space-y-1 text-[10px] text-slate-600">
                      {inclusions.map((inc, index) => (
                        <div key={index} className="flex gap-1 items-start">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider">Exclusions</h4>
                    <div className="space-y-1 text-[10px] text-slate-600">
                      {exclusions.map((exc, index) => (
                        <div key={index} className="flex gap-1 items-start">
                          <span className="text-rose-500 font-bold">✕</span>
                          <span>{exc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* COLUMN 3: RIGHT PANEL - Financial Calculations & Pricing Engine (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Costing Engine Selector */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider border-b border-slate-100 pb-2">Pricing Strategy Engine</h3>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPricingMode("detail")}
                    className={`py-2 rounded text-[10px] font-bold border transition-colors ${
                      pricingMode === "detail" 
                        ? "bg-teal-600 text-white border-teal-600" 
                        : "bg-slate-50 text-[#64748B] border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Detail Cost
                  </button>
                  <button
                    onClick={() => setPricingMode("total")}
                    className={`py-2 rounded text-[10px] font-bold border transition-colors ${
                      pricingMode === "total" 
                        ? "bg-teal-600 text-white border-teal-600" 
                        : "bg-slate-50 text-[#64748B] border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Total Margin
                  </button>
                  <button
                    onClick={() => setPricingMode("fixed")}
                    className={`py-2 rounded text-[10px] font-bold border transition-colors ${
                      pricingMode === "fixed" 
                        ? "bg-teal-600 text-white border-teal-600" 
                        : "bg-slate-50 text-[#64748B] border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Fixed Profit
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  
                  {pricingMode === "total" && (
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-[#0F172A]">Target Margin:</span>
                        <span className="font-bold text-teal-600">{marginPercent}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="50" 
                        value={marginPercent} 
                        onChange={(e) => setMarginPercent(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      />
                    </div>
                  )}

                  {pricingMode === "fixed" && (
                    <div>
                      <label className="text-[9px] font-extrabold text-[#64748B] uppercase block mb-1">Desired Profit Target (₹)</label>
                      <input 
                        type="number" 
                        value={desiredProfit} 
                        onChange={(e) => setDesiredProfit(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-[#0F172A] font-bold font-mono"
                      />
                    </div>
                  )}

                  {pricingMode === "detail" && (
                    <div className="bg-sky-50 text-sky-700 text-[10px] p-2.5 rounded border border-sky-100 flex gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>Detail Wise pricing reads the direct selling prices configured on each component.</span>
                    </div>
                  )}

                </div>
              </div>

              {/* GST Engine Widget */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider">GST Tax Configurator</h4>
                  <input 
                    type="checkbox" 
                    checked={isGstEnabled} 
                    onChange={(e) => setIsGstEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 accent-teal-600 cursor-pointer"
                  />
                </div>

                {isGstEnabled && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[8px] text-slate-400 font-extrabold uppercase">GST Percentage (%)</label>
                        <select 
                          value={gstPercent} 
                          onChange={(e) => setGstPercent(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-[#0F172A]"
                        >
                          <option value="5">5% (Package Tour)</option>
                          <option value="18">18% (Service Tax)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] text-slate-400 font-extrabold uppercase">GST Type</label>
                        <select 
                          value={gstType} 
                          onChange={(e) => setGstType(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-[#0F172A]"
                        >
                          <option value="split">Split (CGST + SGST)</option>
                          <option value="igst">IGST (Inter-state)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[8px] text-slate-400 font-extrabold uppercase">Agency GSTIN</label>
                      <input 
                        type="text" 
                        value={gstNumber} 
                        onChange={(e) => setGstNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-mono text-[#0F172A]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Engine Widget */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider">Discount Campaigns</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] text-slate-400 font-extrabold uppercase">Type</label>
                    <select 
                      value={discountType} 
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-[#0F172A]"
                    >
                      <option value="percentage">Percentage %</option>
                      <option value="fixed">Flat Discount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-400 font-extrabold uppercase">Value</label>
                    <input 
                      type="number" 
                      value={discountValue} 
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Profit Dashboard */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider border-b border-slate-100 pb-2">Profit Dashboard</h4>
                
                <div className="space-y-2 text-xs font-medium">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Actual Vendor Cost:</span>
                    <span className="font-mono text-[#0F172A]">₹{totalVendorCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Target Quote Subtotal:</span>
                    <span className="font-mono text-[#0F172A]">₹{subtotalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Markup Profit Margin:</span>
                    <span className="font-mono text-[#0F172A] font-bold">₹{profitAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Campaign Discount:</span>
                    <span className="font-mono text-rose-600">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>

                  {isGstEnabled && (
                    <div className="bg-slate-50 p-2 rounded text-[10px] space-y-1 text-slate-500 border border-slate-100">
                      {gstType === "split" ? (
                        <>
                          <div className="flex justify-between">
                            <span>CGST Tax ({(gstPercent/2)}%):</span>
                            <span className="font-mono text-slate-700">₹{(gstAmount / 2).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SGST Tax ({(gstPercent/2)}%):</span>
                            <span className="font-mono text-slate-700">₹{(gstAmount / 2).toLocaleString('en-IN')}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span>IGST Tax ({gstPercent}%):</span>
                          <span className="font-mono text-slate-700">₹{gstAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-extrabold text-[#0F172A] pt-2 border-t border-slate-100">
                    <span>Final Traveler Price:</span>
                    <span className="font-mono text-teal-600 text-lg">₹{finalCustomerPrice.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-slate-100 pt-2 grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-slate-400 block uppercase text-[8px]">Advance Required</span>
                      <input 
                        type="number" 
                        value={advanceAmount} 
                        onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-bold font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase text-[8px]">Outstanding</span>
                      <span className="font-mono font-bold text-slate-700 block mt-1">₹{outstandingAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Variants generation widget */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider">Generate Package Tier Variants</h4>
                <div className="grid grid-cols-4 gap-1.5">
                  <button 
                    onClick={() => applyPackageVariant("budget")}
                    className="p-1 border border-slate-200 hover:border-teal-500 rounded text-[9px] font-bold text-center bg-slate-50 hover:bg-white text-[#0F172A]"
                  >
                    Budget
                  </button>
                  <button 
                    onClick={() => applyPackageVariant("standard")}
                    className="p-1 border border-slate-200 hover:border-teal-500 rounded text-[9px] font-bold text-center bg-slate-50 hover:bg-white text-[#0F172A]"
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => applyPackageVariant("premium")}
                    className="p-1 border border-slate-200 hover:border-teal-500 rounded text-[9px] font-bold text-center bg-slate-50 hover:bg-white text-[#0F172A]"
                  >
                    Premium
                  </button>
                  <button 
                    onClick={() => applyPackageVariant("luxury")}
                    className="p-1 border border-slate-200 hover:border-teal-500 rounded text-[9px] font-bold text-center bg-slate-50 hover:bg-white text-[#0F172A]"
                  >
                    Luxury
                  </button>
                </div>
              </div>

              {/* AI Copilot Widget Controls inside right pane */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-4 h-4 text-teal-600" /> AI Package Copilot V2
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => applyCopilotAction("find_cheaper")}
                    className="p-2 border border-slate-200 rounded text-[9px] font-bold text-left hover:bg-slate-50 transition-all text-[#0F172A]"
                  >
                    📉 Find Cheaper Stays
                  </button>
                  <button 
                    onClick={() => applyCopilotAction("upgrade_luxury")}
                    className="p-2 border border-slate-200 rounded text-[9px] font-bold text-left hover:bg-slate-50 transition-all text-[#0F172A]"
                  >
                    💎 Upgrade To Luxury
                  </button>
                  <button 
                    onClick={() => applyCopilotAction("increase_profit")}
                    className="p-2 border border-slate-200 rounded text-[9px] font-bold text-left hover:bg-slate-50 transition-all text-[#0F172A]"
                  >
                    📈 Target Extra profit
                  </button>
                  <button 
                    onClick={() => applyCopilotAction("honeymoon_version")}
                    className="p-2 border border-slate-200 rounded text-[9px] font-bold text-left hover:bg-slate-50 transition-all text-[#0F172A]"
                  >
                    ❤️ Honeymoon Edition
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MULTI-PAGE LUXURY COVER PROPOSAL PREVIEW MODAL */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white font-sans">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold">15-Page Luxury Proposal Preview Builder</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">Page {pdfPage} of 15</span>
                <button 
                  onClick={() => setIsPdfModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Slide Pagination Toolbar */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-2.5 flex items-center justify-between text-white font-sans">
              <div className="flex gap-1 overflow-x-auto py-1 max-w-[70%]">
                {Array.from({ length: 15 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPdfPage(idx + 1)}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                      pdfPage === idx + 1 ? "bg-teal-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPdfPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded"
                >
                  Prev
                </button>
                <button 
                  onClick={() => setPdfPage(prev => Math.min(15, prev + 1))}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#FAFBFD] custom-scrollbar flex items-center justify-center">
              
              {/* PDF Document Container */}
              <div className="bg-white border border-slate-200 rounded shadow-md w-full max-w-2xl min-h-[500px] p-8 text-slate-800 font-sans flex flex-col justify-between relative overflow-hidden">
                
                {/* PAGE 1: LUXURY COVER */}
                {pdfPage === 1 && (
                  <div className="space-y-12 flex-1 flex flex-col justify-between pt-4">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded">
                        <Award className="w-4 h-4 text-teal-400" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest">Elite Travels Concierge</span>
                      </div>
                      <h1 className="text-3xl font-black tracking-tight text-slate-900 pt-4">LUXURY {destination.toUpperCase()} RETREAT</h1>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{nights} Nights / {nights + 1} Days Bespoke Itinerary</p>
                    </div>

                    <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200">
                      <img 
                        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60" 
                        alt={destination}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 text-xs text-slate-600">
                      <div>
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase">PREPARED FOR</p>
                        <p className="font-bold text-slate-900 mt-1">{clientName}</p>
                        <p>{clientEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase">PROPOSAL METADATA</p>
                        <p className="font-bold text-slate-900 mt-1">Quote: {quoteNumber}</p>
                        <p>Valid Till: {validTill}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 2: TRIP OVERVIEW */}
                {pdfPage === 2 && (
                  <div className="space-y-6 flex-1 pt-4">
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">02 • Proposal Overview</h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Thank you for choosing Elite Travels. We are delighted to present this customized travel quotation for {destination}. This bespoke tour is configured for {members} travelers, focusing on luxury, private logistics, and unique local experiences.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-100">
                      <div className="space-y-2 text-xs">
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase">Travel Parameters</p>
                        <p className="text-[#0F172A]"><strong>Duration:</strong> {nights} Nights / {nights + 1} Days</p>
                        <p className="text-[#0F172A]"><strong>Style:</strong> {travelStyle}</p>
                        <p className="text-[#0F172A]"><strong>Guest Count:</strong> {members} Passengers</p>
                      </div>
                      <div className="space-y-2 text-xs">
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase">Trip Highlights</p>
                        <p className="text-slate-600">✓ Dedicated Private Cab Driver</p>
                        <p className="text-slate-600">✓ Luxury Beachfront Villa stays</p>
                        <p className="text-slate-600">✓ Island Snorkeling Cruise VIP</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 3-8: DAY WISE ITINERARY */}
                {pdfPage >= 3 && pdfPage <= 8 && (
                  <div className="space-y-6 flex-1 pt-4">
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
                      0{pdfPage} • Day {pdfPage - 2} Timeline
                    </h2>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs font-medium flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" /> {destination} Local Guide Routing
                      </span>
                      <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        ☀️ Sunny 28°C
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-extrabold uppercase text-slate-400">Morning Schedule</p>
                        <p className="text-xs text-slate-700">Breakfast buffet at the resort followed by our private driver pickup.</p>
                      </div>
                      <div className="space-y-2 border-l-2 border-teal-600 pl-3">
                        <p className="text-[10px] font-extrabold uppercase text-teal-600">Afternoon Tour Experience</p>
                        <p className="text-xs font-bold text-slate-900">
                          {componentsList.activities[pdfPage - 3]?.name || "Local scenic walks & temple tours with private guide."}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Enjoy personal guidance, entry ticketing matches, and air-conditioned transit.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-extrabold uppercase text-slate-400">Evening stay</p>
                        <p className="text-xs text-slate-700">Dinner overlooking sunset views. Overnight stay at the villa.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 9: ACCOMMODATION DETAILS */}
                {pdfPage === 9 && (
                  <div className="space-y-6 flex-1 pt-4">
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">09 • Accommodation Stays</h2>
                    
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm space-y-3">
                      <div className="w-full h-32 bg-slate-100 overflow-hidden relative">
                        <img 
                          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&auto=format&fit=crop&q=60" 
                          alt="Hotel"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="text-xs font-bold text-[#0F172A]">{componentsList.accommodation[0]?.name}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Beachfront luxury property. Deluxe King Ocean view villa with private pool access, daily buffet breakfasts, and spa resort credits.
                        </p>
                        <div className="flex gap-2 pt-2 text-[9px] font-bold text-teal-600">
                          <span>✓ Wi-Fi</span>
                          <span>✓ Pool</span>
                          <span>✓ Gym</span>
                          <span>✓ Ocean View</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 10: TRANSPORT DETAILS */}
                {pdfPage === 10 && (
                  <div className="space-y-6 flex-1 pt-4">
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">10 • Transport & Cabs</h2>
                    
                    <div className="space-y-4 text-xs">
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">{componentsList.transport[0]?.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Dedicated Air-Conditioned vehicle with private chauffeur driver.</p>
                        </div>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                          VIP Service
                        </span>
                      </div>

                      <div className="border border-slate-100 p-4 rounded space-y-2">
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase">Service Scope</p>
                        <p className="text-slate-600">✓ All toll charges and driver allowance included</p>
                        <p className="text-slate-600">✓ Available 10 hours daily for regional sightseeing</p>
                        <p className="text-slate-600">✓ Direct Airport pickups & drops</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 11: BUDGET SUMMARY (NO INTERNAL COSTS SHOWN) */}
                {pdfPage === 11 && (
                  <div className="space-y-6 flex-1 pt-4">
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">11 • Pricing Summary Invoice</h2>
                    
                    <div className="space-y-3">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                            <th className="py-2">Description</th>
                            <th className="py-2 text-right">Units</th>
                            <th className="py-2 text-right">Total Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          <tr>
                            <td className="py-2">Accommodations stay & villas</td>
                            <td className="py-2 text-right">{nights} Nights</td>
                            <td className="py-2 text-right font-bold text-slate-800">Included</td>
                          </tr>
                          <tr>
                            <td className="py-2">Sightseeing tours & entries</td>
                            <td className="py-2 text-right">Included</td>
                            <td className="py-2 text-right font-bold text-slate-800">Included</td>
                          </tr>
                          <tr>
                            <td className="py-2">Private chauffeur transport logistics</td>
                            <td className="py-2 text-right">Daily</td>
                            <td className="py-2 text-right font-bold text-slate-800">Included</td>
                          </tr>
                          {isGstEnabled && (
                            <tr>
                              <td className="py-2">GST Tax ({gstPercent}%)</td>
                              <td className="py-2 text-right">Standard</td>
                              <td className="py-2 text-right font-mono">₹{gstAmount.toLocaleString('en-IN')}</td>
                            </tr>
                          )}
                          <tr className="bg-slate-50 font-bold border-t border-slate-200">
                            <td className="py-3 px-2 text-sm text-[#0F172A]">Final Package Quote:</td>
                            <td colSpan={2} className="py-3 px-2 text-right text-sm text-teal-700 font-mono">
                              ₹{finalCustomerPrice.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="text-[9px] text-slate-400 italic">Note: Internal margins and cost breakdowns are withheld for privacy.</p>
                    </div>
                  </div>
                )}

                {/* PAGE 12: INCLUSIONS & POLICIES */}
                {pdfPage === 12 && (
                  <div className="space-y-4 flex-1 pt-4">
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">12 • Terms & Inclusions</h2>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                      <div className="space-y-2">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase">Package Includes</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          {inclusions.slice(0, 4).map((inc, index) => (
                            <li key={index}>{inc}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase">Package Excludes</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          {exclusions.slice(0, 4).map((exc, index) => (
                            <li key={index}>{exc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 13: PAYMENT SCHEDULE */}
                {pdfPage === 13 && (
                  <div className="space-y-6 flex-1 pt-4">
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">13 • Payment Schedule</h2>
                    
                    <div className="grid grid-cols-2 gap-6 items-center">
                      <div className="space-y-3 text-xs">
                        <div className="border-l-2 border-teal-600 pl-3">
                          <p className="font-bold text-slate-900">Advance Deposit</p>
                          <p className="font-mono text-slate-600 font-bold mt-1">₹{advanceAmount.toLocaleString('en-IN')} (Required now)</p>
                        </div>
                        <div className="border-l-2 border-slate-300 pl-3">
                          <p className="font-bold text-slate-900">Outstanding Balance</p>
                          <p className="font-mono text-slate-600 font-bold mt-1">₹{outstandingAmount.toLocaleString('en-IN')} (Due 7 days before travel)</p>
                        </div>
                      </div>
                      
                      {/* Mock QR Code */}
                      <div className="border border-slate-200 rounded p-3 text-center bg-slate-50 space-y-2 flex flex-col items-center">
                        <div className="w-24 h-24 bg-white border border-slate-300 flex items-center justify-center shadow-inner relative">
                          {/* QR Code Graphic Mock */}
                          <div className="absolute inset-2 border-2 border-slate-950 flex flex-wrap p-1">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div key={i} className={`w-5 h-5 ${i % 3 === 0 ? "bg-slate-900" : "bg-transparent"}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Scan to Pay via UPI</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 14: SIGNATURE PAGE */}
                {pdfPage === 14 && (
                  <div className="space-y-8 flex-1 pt-4 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">14 • Signatures & Approval</h2>
                      <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                        Please review the package details, inclusions, exclusions, and payment timeline above. Stash or sign digitally below to conclude the booking agreement.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8">
                      <div className="border-t border-slate-300 pt-4 text-xs space-y-2">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase">AGENCY SIGNATURE & STAMP</p>
                        <div className="h-10 flex items-center justify-start italic text-teal-600 font-serif font-bold text-sm">
                          Elite Travels Pvt. Ltd.
                        </div>
                        <span className="text-[9px] text-slate-400">Authorized Signatory</span>
                      </div>
                      
                      <div className="border-t border-slate-300 pt-4 text-xs space-y-2">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase">CUSTOMER ACCEPTANCE SIGNATURE</p>
                        <div className="h-10 border border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400 text-[10px]">
                          Sign Digitally on WhatsApp Proposal Link
                        </div>
                        <span className="text-[9px] text-slate-400">Guest Principal: {clientName}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAGE 15: THANK YOU / WATERMARK */}
                {pdfPage === 15 && (
                  <div className="text-center space-y-8 flex-1 flex flex-col justify-center items-center pt-4">
                    <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center">
                      <HeartIcon className="w-6 h-6 text-teal-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-xl font-black text-slate-900">Thank You For Choosing Us</h2>
                      <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                        We look forward to hosting your luxury dream escape in {destination}. Reach out directly for any customizations.
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-6 w-full max-w-sm">
                      <p><strong>Website:</strong> www.elitetravels.in</p>
                      <p><strong>Support Phone:</strong> {clientPhone}</p>
                      <p><strong>Email Support:</strong> concierge@elitetravels.in</p>
                    </div>
                  </div>
                )}

                {/* PDF FOOTER */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-auto">
                  <span>Elite Travels Proposal</span>
                  <span>Powered by Travixa</span>
                </div>

              </div>

            </div>

            {/* Modal Footer controls */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-2 font-sans">
              <Button 
                onClick={() => setIsPdfModalOpen(false)}
                className="h-8 text-xs bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-300"
              >
                Close
              </Button>
              <Button 
                onClick={() => window.print()}
                className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white border-none flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Download / Print Quotation Proposal
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

function HeartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
