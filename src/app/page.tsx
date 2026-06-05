"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "./components/layout/AppLayout";
import DashboardCard from "./components/DashboardCard";

export default function Home() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual mock sync action for simulated data reload
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          {/* LEFT */}
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                Live Dashboard
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mt-2 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-2 text-base">
              Welcome back to your CRM analytics panel.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button className="erp-card border erp-border hover:border-blue-500 hover:text-blue-600 px-5 py-3 rounded-2xl text-sm font-semibold transition shadow-sm active:scale-98">
              Export Report
            </button>

            <button 
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-sm font-semibold transition shadow-lg flex items-center gap-2 disabled:opacity-75 active:scale-98"
            >
              {isRefreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Refreshing...
                </>
              ) : (
                "Refresh Data"
              )}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <DashboardCard
            title="Total Customers"
            value="250"
          />

          {/* Navigates directly to your master purchase list */}
          <div 
            onClick={() => router.push("/purchase-orders")}
            className="cursor-pointer transition-transform transform hover:-translate-y-1"
          >
            <DashboardCard
              title="Total Orders"
              value="120"
            />
          </div>

          <DashboardCard
            title="Revenue"
            value="I₹5L"
          />

          <DashboardCard
            title="Pending Tasks"
            value="18"
          />
        </div>

        {/* QUICK ACTIONS & METRICS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          
          {/* RECENT ACTIVITY */}
          <div className="erp-card border erp-border rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h2>
              <span 
                onClick={() => router.push("/purchase-orders")}
                className="text-sm text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                View All
              </span>
            </div>

            <div className="space-y-4 mt-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                  👤
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    New customer added
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    2 minutes ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
                  📦
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    Order submitted
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    15 minutes ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
                  💰
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    Revenue updated
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className="erp-card border erp-border rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Performance
              </h2>
              <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full text-xs">
                +18%
              </span>
            </div>

            <div className="space-y-5 mt-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Sales</span>
                  <span className="font-bold">78%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-600 h-3 rounded-full w-[78%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-bold">65%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-green-600 h-3 rounded-full w-[65%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Customers</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-purple-600 h-3 rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* INTEGRATED QUICK ACTIONS */}
          <div className="erp-card border erp-border rounded-3xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl p-4 transition text-left active:scale-95 shadow-sm">
                <div className="text-2xl">👤</div>
                <div className="font-semibold mt-3 text-sm">
                  Add Customer
                </div>
              </button>

              {/* Direct Link to Create Purchase Order Form */}
              <button 
                onClick={() => router.push("/purchase-orders/create")}
                className="bg-green-50 hover:bg-green-100 text-green-700 rounded-2xl p-4 transition text-left active:scale-95 shadow-sm"
              >
                <div className="text-2xl">📦</div>
                <div className="font-semibold mt-3 text-sm">
                  New Order
                </div>
              </button>

              {/* Direct Link to Purchase Master Table View */}
              <button 
                onClick={() => router.push("/purchase-orders")}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl p-4 transition text-left active:scale-95 shadow-sm"
              >
                <div className="text-2xl">📊</div>
                <div className="font-semibold mt-3 text-sm">
                  PO Reports
                </div>
              </button>

              <button className="bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-2xl p-4 transition text-left active:scale-95 shadow-sm">
                <div className="text-2xl">🛍️</div>
                <div className="font-semibold mt-3 text-sm">
                  Products
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}