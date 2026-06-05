"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";

export default function CustomerOrdersPage() {
  const params = useParams();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Ek page par max 10 orders dikhenge

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/currency/orders-by-customer?cardCode=${params.cardCode}`
      );
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = orders.reduce((sum, x) => sum + (x.docTotal || 0), 0);
  const openOrdersCount = orders.filter((x) => x.status === "Open").length;

  // Pagination Math
  const totalPages = Math.ceil(orders.length / pageSize);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen erp-page flex flex-col justify-center items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          <div className="text-sm font-medium text-slate-500">
            Fetching customer order books...
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen erp-page text-slate-900 p-6 md:p-8 max-w-[1600px] mx-auto tracking-tight flex flex-col justify-between">
        
        <div>
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-slate-200/60 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2.5 rounded-xl erp-card border border-slate-200 hover:erp-page transition text-slate-600 text-sm font-semibold shadow-sm shrink-0"
              >
                ← Back
              </button>
              <div className="min-w-0">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight truncate">
                  Customer Orders
                </h1>
                <p className="text-slate-400 text-xs font-mono font-medium mt-0.5">
                  Account Code: {params.cardCode}
                </p>
              </div>
            </div>
          </div>

          {/* KPI Dashboard Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <KPICard title="Total Orders Placed" value={orders.length} />
            <KPICard 
              title="Open Orders Status" 
              value={openOrdersCount} 
              color={openOrdersCount > 0 ? "text-amber-500" : "text-slate-700"}
            />
            <KPICard 
              title="Gross Accumulated Value" 
              value={`₹${totalValue.toLocaleString('en-IN')}`} 
              color="text-emerald-600" 
            />
          </div>

          {/* Orders Modern Structural Table */}
          <div className="erp-card border border-slate-200 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="erp-page text-slate-400 font-semibold border-b border-slate-200/80">
                  <tr>
                    <th className="p-4 font-medium">Order No</th>
                    <th className="p-4 font-medium">Order Date</th>
                    <th className="p-4 font-medium">Due Date</th>
                    <th className="p-4 font-medium text-right">Value</th>
                    <th className="p-4 font-medium text-center">Status</th>
                    <th className="p-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.docEntry}
                      className="hover:erp-page/60 transition-colors"
                    >
                      <td className="p-4 font-bold text-slate-900 font-mono">
                        {order.docNum}
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(order.docDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(order.docDueDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-4 text-right font-extrabold text-emerald-600">
                        ₹{order.docTotal?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                            order.status === "Open"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          • {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            router.push(`/sap-orders/order/${order.docEntry}`)
                          }
                          className="px-3.5 py-1.5 rounded-lg erp-card border border-slate-200 text-xs font-semibold text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-300 shadow-sm transition-all"
                        >
                          View Items
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                        No previous purchase orders found under this account ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sync Clean Pagination Module */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between erp-card border border-slate-200 rounded-xl p-4 mt-8 gap-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">
              Displaying <span className="text-slate-800 font-bold">{((currentPage - 1) * pageSize) + 1}</span> to{" "}
              <span className="text-slate-800 font-bold">
                {Math.min(currentPage * pageSize, orders.length)}
              </span>{" "}
              of <span className="text-indigo-600 font-bold">{orders.length}</span> orders
            </div>
            
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 erp-page border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-600 transition-all shadow-sm"
              >
                Previous
              </button>
              
              <div className="text-xs font-semibold text-slate-500 px-1">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 erp-page border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-600 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}

function KPICard({ title, value, color = "" }: { title: string; value: string | number; color?: string }) {
  return (
    <div className="erp-card border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-w-0">
      <div className="text-slate-400 font-bold text-xs uppercase tracking-wider truncate">
        {title}
      </div>
      <div 
        className={`text-2xl md:text-3xl font-black mt-2 tracking-tight truncate ${color || "text-slate-800"}`}
        title={String(value)}
      >
        {value}
      </div>
    </div>
  );
}