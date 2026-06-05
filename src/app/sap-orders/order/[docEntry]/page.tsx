"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";

export default function OrderItemsPage() {
  const params = useParams();
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/currency/order-items?docEntry=${params.docEntry}`
      );
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((a, b) => a + (b.lineTotal || 0), 0);
  const totalQty = items.reduce((a, b) => a + (b.quantity || 0), 0);
  const openQty = items.reduce((a, b) => a + (b.openQty || 0), 0);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen erp-page flex flex-col justify-center items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          <div className="text-sm font-medium text-slate-500">
            Extracting SAP Line Items...
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen erp-page text-slate-900 p-6 md:p-8 max-w-[1600px] mx-auto tracking-tight">
        
        {/* Header Navigation Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-slate-200/60 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl erp-card border border-slate-200 hover:erp-page transition text-slate-600 text-sm font-semibold shadow-sm shrink-0"
            >
              ← Back
            </button>
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Sales Order Line Items
              </h1>
              <p className="text-slate-400 text-xs font-mono font-medium mt-0.5">
                SAP Document Entry Reference: #{params.docEntry}
              </p>
            </div>
          </div>

          {/* Integrated Grand Total inside Header for compact look */}
          <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl px-5 py-2.5 sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block">Grand Total Value</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 block mt-0.5">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Clean Micro KPI Dashboard Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <KPICard title="Total Unique Items" value={items.length} />
          <KPICard title="Cumulative Quantity" value={totalQty} color="text-indigo-600" />
          <KPICard 
            title="Remaining Open Quantity" 
            value={openQty} 
            color={openQty > 0 ? "text-amber-600" : "text-slate-700"} 
          />
        </div>

        {/* Modern Clean Table Layout */}
        <div className="erp-card border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="erp-page text-slate-400 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="p-4 font-medium">Item Code</th>
                  <th className="p-4 font-medium">Item Name / Description</th>
                  <th className="p-4 font-medium text-right">Ordered Qty</th>
                  <th className="p-4 font-medium text-right">Open Qty</th>
                  <th className="p-4 font-medium text-right">Unit Price</th>
                  <th className="p-4 font-medium text-right">Row Total</th>
                  <th className="p-4 font-medium text-center">Lifecycle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {items.map((item) => (
                  <tr
                    key={item.lineNum}
                    className="hover:erp-page/50 transition-colors"
                  >
                    <td className="p-4 font-bold text-slate-900 font-mono text-xs tracking-wider">
                      {item.itemCode}
                    </td>
                    <td className="p-4 text-slate-700 font-medium max-w-xs truncate" title={item.itemName}>
                      {item.itemName}
                    </td>
                    <td className="p-4 text-right font-medium text-slate-800">
                      {item.quantity}
                    </td>
                    <td className={`p-4 text-right font-bold ${item.openQty > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {item.openQty}
                    </td>
                    <td className="p-4 text-right text-slate-500">
                      ₹{Number(item.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-right font-extrabold text-emerald-600">
                      ₹{Number(item.lineTotal || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                          item.lineStatus === "Pending"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}
                      >
                        • {item.lineStatus || 'Closed'}
                      </span>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                      No document breakdown elements exist for this Sales Order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

{/* Micro KPI Card Sub-component */}
function KPICard({ title, value, color = "" }: { title: string; value: string | number; color?: string }) {
  return (
    <div className="erp-card border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-w-0">
      <div className="text-slate-400 font-bold text-xs uppercase tracking-wider truncate">
        {title}
      </div>
      <div 
        className={`text-2xl md:text-3xl font-black mt-1.5 tracking-tight truncate ${color || "text-slate-800"}`}
        title={String(value)}
      >
        {value}
      </div>
    </div>
  );
}