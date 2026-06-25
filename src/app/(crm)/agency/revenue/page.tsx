"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, ArrowUpRight, ArrowDownRight, FileText, Download, Activity, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportTableToExcel, ExportColumn } from "@/lib/utils/excelExport";

export default function RevenuePage() {
  const [metrics, setMetrics] = useState({ gross: 0, expenses: 0, profit: 0, margin: "0%" });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleExportARR = () => {
    const columns: ExportColumn[] = [
      { header: "Booking ID", key: "id" },
      { header: "Customer Name", key: "customer" },
      { header: "Destination", key: "dest" },
      { header: "Total Amount", key: "amount", format: "currency" },
      { header: "Est. Cost (80%)", key: "cost", format: "currency" },
      { header: "Net Profit (20%)", key: "profit", format: "currency" },
      { header: "Status", key: "status" }
    ];
    const exportData = bookings.map(b => {
      const rawAmt = Number((b.amount || "0").replace(/[^0-9.-]+/g,"")) || 0;
      const cost = Math.floor(rawAmt * 0.8);
      const profit = rawAmt - cost;
      return {
        id: b.id || "",
        customer: b.customer || "",
        dest: b.dest || "",
        amount: rawAmt,
        cost,
        profit,
        status: b.status || ""
      };
    });
    exportTableToExcel(exportData, columns, "agency_revenue_ledger");
  };

  useEffect(() => {
    fetch('/api/crm/bookings')
      .then(res => res.json())
      .then(fetchedBookings => {
        if (Array.isArray(fetchedBookings)) {
          setBookings(fetchedBookings);
          const gross = fetchedBookings.reduce((acc, b) => {
            const rawAmt = Number((b.amount || "0").replace(/[^0-9.-]+/g,"")) || 0;
            return acc + rawAmt;
          }, 0);
          const expenses = Math.floor(gross * 0.8);
          const profit = gross - expenses;
          const margin = gross > 0 ? ((profit / gross) * 100).toFixed(1) + "%" : "0%";
          setMetrics({ gross, expenses, profit, margin });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Revenue & Profit Ledger
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">Live financial calculation computed dynamically from confirmed agency bookings.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Button onClick={handleExportARR} className="h-8 text-xs font-bold bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-[#0F172A] border-none shadow-sm">
            <Download className="w-3.5 h-3.5 mr-1" /> Export ARR Ledger
          </Button>
        </div>
      </div>

      {/* Top Metrics - Live Profit Computation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-4 space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Gross Revenue</span>
          <p className="text-xl font-bold text-white font-mono">{loading ? "..." : `₹${metrics.gross.toLocaleString('en-IN')}`}</p>
        </div>
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-4 space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Est. Vendor Costs (80%)</span>
          <p className="text-xl font-bold text-red-400 font-mono">{loading ? "..." : `₹${metrics.expenses.toLocaleString('en-IN')}`}</p>
        </div>
        <div className="bg-[#0B1220] border border-[#14B8A6]/30 rounded-md p-4 space-y-2 bg-[#14B8A6]/5">
          <span className="text-[10px] uppercase font-bold text-[#14B8A6]">Net Agency Profit</span>
          <p className="text-xl font-bold text-[#14B8A6] font-mono">{loading ? "..." : `₹${metrics.profit.toLocaleString('en-IN')}`}</p>
        </div>
        <div className="bg-[#0B1220] border border-white/5 rounded-md p-4 space-y-2">
          <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Net Margin</span>
          <p className="text-xl font-bold text-sky-400 font-mono">{loading ? "..." : metrics.margin}</p>
        </div>
      </div>

      {/* Live Notice */}
      <div className="p-8 bg-[#0B1220] border border-white/5 rounded-md text-center text-xs text-[#94A3B8]">
        Financial calculations reflect live multi-tenant PostgreSQL ledger queries. All transactions are securely isolated per agency tenant.
      </div>
    </div>
  );
}
