"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlanPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/trip-planner");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="animate-pulse text-xs text-slate-500 font-bold uppercase tracking-widest">
        Redirecting to Travel Wizard...
      </div>
    </div>
  );
}
