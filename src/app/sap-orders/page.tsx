"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "../services/api";

interface Customer {
  cardCode: string;
  cardName: string;
  totalOrders: number;
  totalValue: number;
}

export default function SapOrdersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Ek page par 12 customers dikhenge

  useEffect(() => {
    loadCustomers();
  }, []);

  // Jab bhi user search karega, automatically page 1 par reset ho jayega
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const loadCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/currency/customers`);
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (x) =>
      x.cardName?.toLowerCase().includes(search.toLowerCase()) ||
      x.cardCode?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedCustomers = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalValue = customers.reduce((a, b) => a + b.totalValue, 0);
  const totalOrders = customers.reduce((a, b) => a + b.totalOrders, 0);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen erp-page flex flex-col justify-center items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
          <div className="text-sm font-medium text-slate-500">
            Querying SAP Customer Databases...
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen erp-page text-slate-900 p-6 md:p-8 max-w-[1600px] mx-auto tracking-tight flex flex-col justify-between">
        
        <div>
          {/* Minimalistic Premium Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-slate-200/60 pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                SAP Orders Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-0.5 font-medium">
                Real-time customer-centric order analytics pipelines
              </p>
            </div>
          </div>

          {/* Clean KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <KPICard title="Total Customers" value={customers.length} />
            <KPICard title="Total Orders" value={totalOrders} />
            <KPICard 
              title="Total Pipeline Value" 
              value={`₹${totalValue.toLocaleString('en-IN')}`} 
              color="text-emerald-600" 
            />
          </div>

          {/* Action / Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
            <div className="w-full sm:max-w-md relative flex items-center">
              <span className="absolute left-4 text-slate-400 text-lg pointer-events-none">🔍</span>
              <input
                placeholder="Search customer by name or card code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full erp-card border border-slate-200 text-sm text-slate-800 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium shrink-0">
              Filtered results: <span className="text-slate-800 font-bold">{filtered.length}</span> items
            </div>
          </div>

          {/* Customers Modern Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedCustomers.map((customer) => (
              <div
                key={customer.cardCode}
                onClick={() => router.push(`/sap-orders/${customer.cardCode}`)}
                className="erp-card rounded-2xl border border-slate-200/70 p-5 cursor-pointer hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-between group min-w-0"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 text-base tracking-tight group-hover:text-indigo-600 transition-colors duration-150 truncate" title={customer.cardName}>
                        {customer.cardName}
                      </h3>
                      <p className="text-xs font-mono font-medium text-slate-400 mt-0.5">
                        {customer.cardCode}
                      </p>
                    </div>
                    <div className="text-xl bg-slate-100 p-2 rounded-xl shrink-0 group-hover:bg-indigo-50 transition-colors">
                      🏢
                    </div>
                  </div>
                </div>

                {/* Card Footer Insights */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Orders</span>
                    <span className="font-bold text-slate-700 text-base mt-0.5 block">
                      {customer.totalOrders}
                    </span>
                  </div>
                  <div className="text-right min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Value</span>
                    <span 
                      className="font-extrabold text-emerald-600 text-base mt-0.5 block truncate"
                      title={`₹${customer.totalValue.toLocaleString('en-IN')}`}
                    >
                      ₹{customer.totalValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full erp-card border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-medium text-sm">
                No matching business partners found in your SAP database lookup.
              </div>
            )}
          </div>
        </div>

        {/* Premium Pagination Control Bar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between erp-card border border-slate-200 rounded-xl p-4 mt-8 gap-4 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">
              Displaying <span className="text-slate-800 font-bold">{((currentPage - 1) * pageSize) + 1}</span> to{" "}
              <span className="text-slate-800 font-bold">
                {Math.min(currentPage * pageSize, filtered.length)}
              </span>{" "}
              of <span className="text-indigo-600 font-bold">{filtered.length}</span> customers
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