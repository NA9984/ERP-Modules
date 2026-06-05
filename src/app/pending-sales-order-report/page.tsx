"use client";

import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { API_BASE_URL } from "../services/api";

type ReportItem = {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  tax: number;
  totalLineAmount: number;
};

type SalesOrder = {
  id: string;
  docNum: string;
  orderQuantity: number;
  items: ReportItem[];
};

type CustomerGroup = {
  customerId: string;
  customerName: string;
  totalQuantity: number;
  salesOrders: SalesOrder[];
};

export default function PendingSalesOrderReportPage() {
  const [data, setData] = useState<CustomerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCustomers, setExpandedCustomers] = useState<string[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("2026-05-01");
  const [toDate, setToDate] = useState("2026-05-27");
  const [dataSource, setDataSource] = useState<"crm" | "sap">("crm");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadReport();
  }, [fromDate, toDate, dataSource]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  function formatDate(date: string) {
    const parts = date.split("-");
    return `${parts[1]}-${parts[2]}-${parts[0]}`;
  }

  async function loadReport() {
    try {
      setLoading(true);
      const endpoint =
        dataSource === "crm"
          ? `${API_BASE_URL}/stock/hierarchical-sales-report?fromDate=${formatDate(fromDate)}&toDate=${formatDate(toDate)}`
          : `${API_BASE_URL}/stock/hierarchical-sales-report-from-sAP?fromDate=${formatDate(fromDate)}&toDate=${formatDate(toDate)}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to load report");
      const result = await response.json();
      setData(result || []);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleCustomer(customerId: string) {
    setExpandedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((x) => x !== customerId) : [...prev, customerId]
    );
  }

  function toggleOrder(orderId: string) {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((x) => x !== orderId) : [...prev, orderId]
    );
  }

  const filteredData = useMemo(() => {
    return data.filter((customer) =>
      customer.customerName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const summary = useMemo(() => {
    let customers = filteredData.length;
    let orders = 0;
    let quantity = 0;
    let amount = 0;

    filteredData.forEach((customer) => {
      quantity += customer.totalQuantity;
      orders += customer.salesOrders.length;
      customer.salesOrders.forEach((order) => {
        order.items.forEach((item) => {
          amount += item.totalLineAmount;
        });
      });
    });

    return { customers, orders, quantity, amount };
  }, [filteredData]);

  return (
    <AppLayout>
      <div className="space-y-6 p-1 md:p-4 max-w-[1600px] mx-auto antialiased text-gray-800">
        
        {/* TOP CONTROLS BAR */}
        <div className="erp-card/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-100/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Live Analytics Engine
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-1 tracking-tight">
                Sales Order Pending <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Report</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* SOURCE TOGGLE */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl border erp-border/50">
                <button
                  onClick={() => setDataSource("crm")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                    dataSource === "crm"
                      ? "erp-card text-blue-600 shadow-md shadow-blue-100/50 scale-105"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  CRM Engine
                </button>
                <button
                  onClick={() => setDataSource("sap")}
                  className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                    dataSource === "sap"
                      ? "erp-card text-emerald-600 shadow-md shadow-emerald-100/50 scale-105"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  SAP ERP
                </button>
              </div>

              {/* DATE PICKERS */}
              <div className="flex items-center gap-2 erp-page border erp-border p-1 rounded-2xl">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent px-3 py-2 text-xs font-medium text-gray-700 outline-none cursor-pointer"
                />
                <span className="text-gray-400 text-xs font-bold">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent px-3 py-2 text-xs font-medium text-gray-700 outline-none cursor-pointer"
                />
              </div>

              {/* SEARCH */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search client profile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border erp-border erp-page/50 focus:erp-card px-4 py-2.5 pl-10 rounded-2xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
                <span className="absolute left-3.5 top-3 text-gray-400 text-xs">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* METRIC CARDS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { label: "Active Customers", val: summary.customers, color: "text-gray-900", bg: "from-blue-50 to-transparent" },
            { label: "Pending Orders", val: summary.orders, color: "text-amber-600", bg: "from-amber-50 to-transparent" },
            { label: "Total Volume Qty", val: summary.quantity.toLocaleString(), color: "text-indigo-600", bg: "from-indigo-50 to-transparent" },
            { label: "Gross Revenue", val: `₹${summary.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "text-emerald-600", bg: "from-emerald-50 to-transparent" },
            { label: "Avg Ticket Value", val: `₹${(summary.orders > 0 ? summary.amount / summary.orders : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: "text-purple-600", bg: "from-purple-50 to-transparent" }
          ].map((card, i) => (
            <div key={i} className={`erp-card border border-gray-100 bg-gradient-to-br ${card.bg} rounded-2xl p-5 shadow-md shadow-gray-100/30 hover:scale-[1.02] transition-transform duration-200`}>
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{card.label}</div>
              <div className={`text-xl md:text-2xl font-black mt-2 tracking-tight ${card.color}`}>{card.val}</div>
            </div>
          ))}
        </div>

        {/* DATA GRID / TABLE (Double Scroll Removed Here) */}
        <div className="erp-card border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/40 overflow-hidden">
          
          {/* STICKY TABLE HEADER */}
          <div className="grid grid-cols-12 bg-gray-900 px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-300 select-none">
            <div className="col-span-6 md:col-span-5">Hierarchical Description</div>
            <div className="col-span-3 md:col-span-2 text-right">Qty</div>
            <div className="col-span-3 md:col-span-2 text-right hidden sm:block">Price</div>
            <div className="col-span-1 text-right hidden md:block">Tax</div>
            <div className="col-span-3 md:col-span-2 text-right">Total Amount</div>
          </div>

          {/* Cleaned Container - No max-height or inner vertical scroll anymore */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : paginatedData.length === 0 ? (
              <div className="p-20 text-center">
                <div className="text-6xl animate-bounce">📭</div>
                <h2 className="text-lg font-bold text-gray-400 mt-4">No matching records found</h2>
                <p className="text-xs text-gray-400 mt-1">Try resetting your filters or custom search queries.</p>
              </div>
            ) : (
              paginatedData.map((customer) => {
                const customerTotal = customer.salesOrders.reduce(
                  (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.totalLineAmount, 0), 0
                );
                const isCustExpanded = expandedCustomers.includes(customer.customerId);

                return (
                  <React.Fragment key={customer.customerId}>
                    
                    {/* LEVEL 1: CUSTOMER ROW */}
                    <div
                      onClick={() => toggleCustomer(customer.customerId)}
                      className={`grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-all duration-150 border-l-4 ${
                        isCustExpanded 
                          ? "bg-blue-50/60 border-blue-600 shadow-sm" 
                          : "erp-card border-transparent hover:erp-page/80"
                      }`}
                    >
                      <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-transform duration-200 ${
                          isCustExpanded ? "bg-blue-600 text-white rotate-90" : "bg-gray-100 text-gray-600"
                        }`}>
                          ➔
                        </div>
                        <div>
                          <div className="font-extrabold text-gray-900 text-sm md:text-base tracking-tight">
                            {customer.customerName}
                          </div>
                          <div className="inline-block px-2 py-0.5 mt-1 bg-blue-100/60 text-blue-700 font-bold rounded-md text-[10px]">
                            {customer.salesOrders.length} Position Orders
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 md:col-span-2 text-right font-black text-gray-900 text-sm md:text-base">
                        {customer.totalQuantity.toLocaleString()}
                      </div>
                      <div className="col-span-3 md:col-span-2 text-right text-gray-400 font-medium hidden sm:block">—</div>
                      <div className="col-span-1 text-right text-gray-400 font-medium hidden md:block">—</div>
                      <div className="col-span-3 md:col-span-2 text-right font-black text-blue-900 text-sm md:text-base">
                        ₹{customerTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>

                    {/* LEVEL 2: SALES ORDERS */}
                    {isCustExpanded && customer.salesOrders.map((order) => {
                      const orderTotal = order.items.reduce((sum, item) => sum + item.totalLineAmount, 0);
                      const isOrderExpanded = expandedOrders.includes(order.id);

                      return (
                        <React.Fragment key={order.id}>
                          <div
                            onClick={() => toggleOrder(order.id)}
                            className={`grid grid-cols-12 px-6 py-3.5 items-center cursor-pointer transition-all duration-150 pl-12 border-l-4 ${
                              isOrderExpanded 
                                ? "bg-amber-50/50 border-amber-500" 
                                : "erp-page/50 border-transparent hover:bg-gray-100/70"
                            }`}
                          >
                            <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] transition-transform duration-200 ${
                                isOrderExpanded ? "bg-amber-500 text-white rotate-90" : "bg-gray-200 text-gray-500"
                              }`}>
                                ➔
                              </div>
                              <div>
                                <div className="font-bold text-gray-800 text-xs md:text-sm">
                                  Doc ID: <span className="text-amber-800">{order.docNum}</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-medium">
                                  Contains {order.items.length} skus
                                </div>
                              </div>
                            </div>
                            <div className="col-span-3 md:col-span-2 text-right font-bold text-gray-800 text-xs md:text-sm">
                              {order.orderQuantity.toLocaleString()}
                            </div>
                            <div className="col-span-3 md:col-span-2 text-right text-gray-400 font-medium hidden sm:block">—</div>
                            <div className="col-span-1 text-right text-gray-400 font-medium hidden md:block">—</div>
                            <div className="col-span-3 md:col-span-2 text-right font-bold text-amber-900 text-xs md:text-sm">
                              ₹{orderTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                          </div>

                          {/* LEVEL 3: LINE ITEMS */}
                          {isOrderExpanded && order.items.map((item, index) => (
                            <div
                              key={`${order.id}-${index}`}
                              className="grid grid-cols-12 px-6 py-3 items-center pl-20 erp-card hover:erp-page/80 transition-colors duration-100 text-xs text-gray-600 border-b border-gray-100/70"
                            >
                              <div className="col-span-6 md:col-span-5 pr-4">
                                <div className="font-semibold text-gray-800 leading-tight">
                                  {item.productName}
                                </div>
                                <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                                  SKU: {item.productId}
                                </div>
                              </div>
                              <div className="col-span-3 md:col-span-2 text-right font-medium text-gray-700">
                                {item.qty.toLocaleString()}
                              </div>
                              <div className="col-span-3 md:col-span-2 text-right font-medium text-gray-700 hidden sm:block">
                                ₹{item.price.toLocaleString()}
                              </div>
                              <div className="col-span-1 text-right text-gray-400 hidden md:block">
                                ₹{item.tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </div>
                              <div className="col-span-3 md:col-span-2 text-right font-bold text-gray-900">
                                ₹{item.totalLineAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="erp-card border border-gray-100 rounded-2xl p-4 shadow-xl shadow-gray-100/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="text-xs text-gray-400 font-medium">
              Showing <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-bold text-gray-800">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>{" "}
              of <span className="font-bold text-gray-800">{filteredData.length}</span> luxury client accounts
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl border erp-border erp-card hover:erp-page disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                if (totalPages > 6 && Math.abs(currentPage - page) > 2 && page !== 1 && page !== totalPages) {
                  if (page === 2 || page === totalPages - 1) return <span key={page} className="px-1 text-gray-400">...</span>;
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                        : "erp-card border erp-border hover:erp-page text-gray-600"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl border erp-border erp-card hover:erp-page disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}