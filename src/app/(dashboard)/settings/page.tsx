"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Lock, Bell, Globe, Camera, Trash2, ShieldAlert, Check, Plus, 
  AlertTriangle, Eye, EyeOff, Save, Trash, Shield, Info
} from "lucide-react";

// Popular destinations for the select grid
const popularDestinations = [
  "Goa", "Bali", "Paris", "Tokyo", "Maldives", "London", "Rome", "Dubai", "Swiss Alps", "Kyoto"
];

// Travel styles
const travelStyles = [
  { id: "adventure", label: "Adventure" },
  { id: "luxury", label: "Luxury" },
  { id: "nature", label: "Nature" },
  { id: "culture", label: "Culture" },
  { id: "shopping", label: "Shopping" },
  { id: "nightlife", label: "Nightlife" },
  { id: "workation", label: "Workation" },
  { id: "honeymoon", label: "Honeymoon" },
  { id: "family", label: "Family Friendly" }
];

// Food preferences
const foodPrefs = [
  { id: "veg", label: "Vegetarian" },
  { id: "nonveg", label: "Non-Vegetarian" },
  { id: "seafood", label: "Seafood" },
  { id: "vegan", label: "Vegan" }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security" | "notifications">("profile");
  
  const [profile, setProfile] = useState({
    firstName: "Prem",
    lastName: "Karnawat",
    email: "prem@example.com",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
  });

  useEffect(() => {
    async function loadAuthProfile() {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || "Traveler";
        const parts = fullName.split(' ');
        setProfile(prev => ({
          ...prev,
          firstName: parts[0] || "Prem",
          lastName: parts.slice(1).join(' ') || "Karnawat",
          email: user.email || prev.email
        }));
      }
    }
    loadAuthProfile();
  }, []);

  // User input for new destination tags
  const [destinationInput, setDestinationInput] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(["Goa", "Bali", "Paris"]);

  // Preferences States
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["adventure", "luxury", "nature"]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>(["veg", "seafood"]);

  // Security States
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Notification / Privacy Toggles
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    whatsappAlerts: true,
    aiRecommendation: true
  });
  
  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    shareTrips: true,
    personalizedAds: false
  });

  // Save changes visual trigger
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Settings updated successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddDestination = () => {
    if (destinationInput.trim() && !selectedDestinations.includes(destinationInput.trim())) {
      setSelectedDestinations([...selectedDestinations, destinationInput.trim()]);
      setDestinationInput("");
    }
  };

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleFood = (id: string) => {
    setSelectedFoods(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const triggerAvatarUpload = () => {
    // Simulate photo upload by picking a random cool traveler avatar
    const randomAvatars = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
    ];
    const newAvatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
    setProfile(prev => ({ ...prev, avatar: newAvatar }));
    setToastMessage("Avatar photo updated!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const removeAvatar = () => {
    setProfile(prev => ({ ...prev, avatar: "" }));
    setToastMessage("Avatar removed.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-16">
      
      {/* Title Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <span className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest bg-[#14B8A6]/10 px-3 py-1 rounded-full">
          Preferences & Account
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] font-sora mt-2 tracking-tight">
          Profile Settings
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Customize your traveler profile, preferences, and assistant configurations.
        </p>
      </motion.div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-1">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === "profile" 
                ? "bg-[#14B8A6] text-white shadow-md shadow-[#14B8A6]/20" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
            }`}
          >
            <User className="w-4 h-4" /> Account Information
          </button>
          
          <button 
            onClick={() => setActiveTab("preferences")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === "preferences" 
                ? "bg-[#14B8A6] text-white shadow-md shadow-[#14B8A6]/20" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
            }`}
          >
            <Globe className="w-4 h-4" /> Travel Preferences
          </button>
          
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === "security" 
                ? "bg-[#14B8A6] text-white shadow-md shadow-[#14B8A6]/20" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
            }`}
          >
            <Lock className="w-4 h-4" /> Security & Danger Zone
          </button>

          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === "notifications" 
                ? "bg-[#14B8A6] text-white shadow-md shadow-[#14B8A6]/20" 
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
            }`}
          >
            <Bell className="w-4 h-4" /> Alerts & Privacy
          </button>
        </div>

        {/* Right Side Settings Panel */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Profile */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A] font-sora">Account Information</h3>
                    <p className="text-xs text-[#64748B]">Update your public avatar, contact phone and core contact details.</p>
                  </div>

                  {/* Avatar Uploader */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="relative group cursor-pointer" onClick={triggerAvatarUpload}>
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#14B8A6] bg-slate-200 flex items-center justify-center">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-[#0F172A]/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-start gap-2">
                      <h4 className="text-xs font-bold text-[#0F172A]">Avatar Photo</h4>
                      <p className="text-[10px] text-[#64748B] text-center sm:text-left">JPG or PNG. Max size 2MB.</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button 
                          onClick={triggerAvatarUpload}
                          className="px-3 py-1.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Upload Photo
                        </button>
                        {profile.avatar && (
                          <button 
                            onClick={removeAvatar}
                            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inputs Form */}
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">First Name</label>
                        <input 
                          type="text" 
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#14B8A6] transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Last Name</label>
                        <input 
                          type="text" 
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#14B8A6] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Email Address</label>
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#14B8A6] transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#14B8A6] transition-colors"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button 
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        <Save className="w-4 h-4" /> Save Account Info
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Tab 2: Preferences */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A] font-sora">Travel Preferences</h3>
                    <p className="text-xs text-[#64748B]">These inputs guide the AI travel copilot to tailor recommendations directly for you.</p>
                  </div>

                  {/* Preferred Destinations Tag System */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Preferred Destinations</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl min-h-[50px] items-center">
                      {selectedDestinations.map(dest => (
                        <span 
                          key={dest} 
                          className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-[#0F172A]"
                        >
                          {dest}
                          <button 
                            onClick={() => setSelectedDestinations(selectedDestinations.filter(d => d !== dest))}
                            className="text-[#64748B] hover:text-[#DC2626] text-xs font-bold ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {selectedDestinations.length === 0 && (
                        <span className="text-xs text-slate-400 italic">No destinations selected. Add some below.</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type destination and click add..." 
                        value={destinationInput}
                        onChange={(e) => setDestinationInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddDestination(); } }}
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#14B8A6] transition-colors"
                      />
                      <button 
                        type="button"
                        onClick={handleAddDestination}
                        className="px-4 py-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>

                    {/* Popular Quick Add Destinations */}
                    <div className="pt-2">
                      <p className="text-[10px] text-[#64748B] mb-2 font-bold uppercase tracking-wider">Quick Suggestions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {popularDestinations.map(dest => {
                          const isAlreadySelected = selectedDestinations.includes(dest);
                          return (
                            <button
                              key={dest}
                              type="button"
                              disabled={isAlreadySelected}
                              onClick={() => setSelectedDestinations([...selectedDestinations, dest])}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                                isAlreadySelected 
                                  ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" 
                                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 active:border-[#14B8A6]"
                              }`}
                            >
                              + {dest}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Travel Styles Preferences Grid */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Travel Styles & Vibe (Multi-select Grid)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {travelStyles.map(style => {
                        const active = selectedStyles.includes(style.id);
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => toggleStyle(style.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                              active 
                                ? "bg-[#14B8A6]/10 border-[#14B8A6] text-[#0F172A] font-extrabold" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span className="text-xs font-semibold">{style.label}</span>
                            {active ? (
                              <span className="w-4 h-4 rounded-full bg-[#14B8A6] flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </span>
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-200 bg-slate-50"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Food Preferences Section */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Food & Dietary Preferences
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {foodPrefs.map(food => {
                        const active = selectedFoods.includes(food.id);
                        return (
                          <button
                            key={food.id}
                            type="button"
                            onClick={() => toggleFood(food.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                              active 
                                ? "bg-[#14B8A6]/10 border-[#14B8A6] text-[#0F172A] font-extrabold" 
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span className="text-xs font-semibold">{food.label}</span>
                            {active ? (
                              <span className="w-4 h-4 rounded-full bg-[#14B8A6] flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </span>
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-200 bg-slate-50"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      <Save className="w-4 h-4" /> Save Preferences
                    </button>
                  </div>

                </motion.div>
              )}

              {/* Tab 3: Security & Danger Zone */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A] font-sora">Security & Password</h3>
                    <p className="text-xs text-[#64748B]">Manage your credentials and authenticate account modifications.</p>
                  </div>

                  {/* Password Form */}
                  <form onSubmit={handleSave} className="space-y-4 max-w-md">
                    <div className="relative">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showCurrent ? "text" : "password"}
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#14B8A6] pr-10 transition-colors"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">New Password</label>
                      <div className="relative">
                        <input 
                          type={showNew ? "text" : "password"}
                          value={passwords.newPass}
                          onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                          placeholder="Min 8 characters"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#14B8A6] pr-10 transition-colors"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 block">Confirm New Password</label>
                      <input 
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        placeholder="Confirm password"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#14B8A6] transition-colors"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                    >
                      Update Password
                    </button>
                  </form>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t border-slate-200">
                    <div className="p-5 rounded-2xl bg-red-50 border border-red-200">
                      <div className="flex gap-3">
                        <ShieldAlert className="w-5 h-5 text-[#EF4444] shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-[#991B1B]">Danger Zone</h4>
                          <p className="text-[11px] text-[#B91C1C] mt-1">
                            Once you delete your traveler profile, all saved itineraries, subscription benefits, and vault assets will be permanently removed.
                          </p>
                          <button 
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="mt-3 px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1"
                          >
                            <Trash className="w-3.5 h-3.5" /> Delete My Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Tab 4: Notifications & Privacy */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A] font-sora">Alerts & Privacy</h3>
                    <p className="text-xs text-[#64748B]">Manage channels of communication and profile exposure criteria.</p>
                  </div>

                  {/* Notification Channels */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5 text-[#14B8A6]" /> Notification Channels
                    </h4>
                    <div className="space-y-3 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">Email Alerts</p>
                          <p className="text-[10px] text-[#64748B]">Receive itinerary drafts, hotel bookings and receipt updates via email.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notifications.emailAlerts}
                          onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                          className="w-8 h-4 bg-slate-200 checked:bg-[#14B8A6] rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:w-3 after:h-3 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-4 after:transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">SMS Updates</p>
                          <p className="text-[10px] text-[#64748B]">Receive flight delays, emergency alerts, and boarding gates details.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notifications.smsAlerts}
                          onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                          className="w-8 h-4 bg-slate-200 checked:bg-[#14B8A6] rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:w-3 after:h-3 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-4 after:transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">WhatsApp Alerts</p>
                          <p className="text-[10px] text-[#64748B]">Receive quick PDF summaries and direct chat support with travel agents.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notifications.whatsappAlerts}
                          onChange={(e) => setNotifications({ ...notifications, whatsappAlerts: e.target.checked })}
                          className="w-8 h-4 bg-slate-200 checked:bg-[#14B8A6] rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:w-3 after:h-3 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-4 after:transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">AI Recommendations</p>
                          <p className="text-[10px] text-[#64748B]">Let AI scan flight drop patterns and ping you with budget saves.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notifications.aiRecommendation}
                          onChange={(e) => setNotifications({ ...notifications, aiRecommendation: e.target.checked })}
                          className="w-8 h-4 bg-slate-200 checked:bg-[#14B8A6] rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:w-3 after:h-3 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-4 after:transition-all"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Privacy Toggles */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-[#14B8A6]" /> Privacy Settings
                    </h4>
                    <div className="space-y-3 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">Public Traveler Profile</p>
                          <p className="text-[10px] text-[#64748B]">Allow other users to search your username and view your public travel reviews.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={privacy.publicProfile}
                          onChange={(e) => setPrivacy({ ...privacy, publicProfile: e.target.checked })}
                          className="w-8 h-4 bg-slate-200 checked:bg-[#14B8A6] rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:w-3 after:h-3 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-4 after:transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">Auto-Share Bookings</p>
                          <p className="text-[10px] text-[#64748B]">Let co-travelers edit or view itinerary plans automatically when added.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={privacy.shareTrips}
                          onChange={(e) => setPrivacy({ ...privacy, shareTrips: e.target.checked })}
                          className="w-8 h-4 bg-slate-200 checked:bg-[#14B8A6] rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:w-3 after:h-3 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-4 after:transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">Affiliate Personalization</p>
                          <p className="text-[10px] text-[#64748B]">Enable customized affiliate recommendation deals based on travel preference tags.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={privacy.personalizedAds}
                          onChange={(e) => setPrivacy({ ...privacy, personalizedAds: e.target.checked })}
                          className="w-8 h-4 bg-slate-200 checked:bg-[#14B8A6] rounded-full appearance-none cursor-pointer relative after:content-[''] after:absolute after:w-3 after:h-3 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:translate-x-4 after:transition-all"
                        />
                      </div>

                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      <Save className="w-4 h-4" /> Save Alerts Settings
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </div>

      </div>

      {/* Floating Save Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-[#0F172A] text-white border border-slate-800 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="w-5 h-5 rounded-full bg-[#14B8A6] flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold tracking-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-[99]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-[100]"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">Delete Account Permanently?</h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                    This is permanent. You will immediately lose access to your generated itineraries, premium saved destinations, and settings history. We cannot restore deleted profiles.
                  </p>
                  
                  <div className="flex items-center justify-end gap-3 mt-6">
                    <button 
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setShowDeleteModal(false);
                        setToastMessage("Account deleted (simulated).");
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
