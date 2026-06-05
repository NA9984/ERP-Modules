"use client";

import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { API_BASE_URL } from "../services/api";

type Product = {
  id: string;
  name: string;
  price: number;
  retailPrice: number;
  categoryName: string;
  uomName: string;
  isActive: boolean;
  isDeleted: boolean;
  taxRate: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/product`);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const result = await response.json();
      setProducts(result || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "active"
          ? !product.isDeleted
          : product.isDeleted;

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  const totalProducts = products.length;
  const activeProducts = products.filter((x) => !x.isDeleted).length;
  const hiddenProducts = products.filter((x) => x.isDeleted).length;
  const categories = new Set(products.map((x) => x.categoryName)).size;

  return (
    <AppLayout>
      <div className="space-y-6 p-1">
        
        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 erp-card/10 px-3 py-1.5 rounded-full text-xs text-blue-100 backdrop-blur">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live Product Intelligence
              </div>
              <h1 className="text-3xl xl:text-4xl font-black text-white mt-4 tracking-tight">
                Product Catalog
              </h1>
              <p className="text-blue-100/80 mt-2 text-sm max-w-2xl">
                Premium enterprise asset inventory control and retail parameters tracking in realtime.
              </p>
            </div>

            {/* CONTROL BAR INTERFACE */}
            <div className="w-full xl:w-[460px] space-y-3 erp-card/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-inner">
              <input
                type="text"
                placeholder="Search products by title or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full erp-card/10 border border-white/10 text-white placeholder:text-slate-400 px-4 py-2.5 rounded-xl outline-none text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
              />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-white/10">
                {/* STATUS FILTER CONTROLS */}
                <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl">
                  {(["all", "active", "hidden"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFilter(mode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                        filter === mode
                          ? mode === "active"
                            ? "bg-emerald-600 text-white shadow-md"
                            : mode === "hidden"
                            ? "bg-rose-600 text-white shadow-md"
                            : "erp-card text-slate-900 shadow-md"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* VIEW CONTROLLER TOGGLE */}
                <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white shadow"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("compact")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === "compact"
                        ? "bg-purple-600 text-white shadow"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Compact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS COUNTERS CARD BANNER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Products Total", val: totalProducts, text: "text-slate-900", border: "border-slate-100" },
            { label: "Active Status", val: activeProducts, text: "text-emerald-600", border: "border-emerald-50" },
            { label: "Hidden Catalog", val: hiddenProducts, text: "text-rose-500", border: "border-rose-50" },
            { label: "Total Categories", val: categories, text: "text-purple-600", border: "border-purple-50" },
          ].map((stat, idx) => (
            <div key={idx} className={`erp-card rounded-2xl border ${stat.border} shadow-sm p-4 hover:shadow-md transition-shadow`}>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                {stat.label}
              </div>
              <div className={`text-3xl font-black mt-1 ${stat.text}`}>
                {stat.val}
              </div>
            </div>
          ))}
        </div>

        {/* INVENTORY VIEWS LAYER */}
        {loading ? (
          /* SKELETON LOADER STATE */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="erp-card rounded-2xl border p-4 space-y-3 animate-pulse">
                <div className="bg-slate-100 h-36 rounded-xl"></div>
                <div className="bg-slate-100 h-4 rounded w-3/4"></div>
                <div className="bg-slate-100 h-3 rounded w-1/2"></div>
                <div className="bg-slate-100 h-8 rounded-xl w-full pt-2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* EMPTY DATA FALLBACK CONTAINER */
          <div className="erp-card border rounded-2xl p-16 text-center text-slate-500 max-w-xl mx-auto space-y-2 shadow-sm">
            <div className="text-4xl">🔍</div>
            <h3 className="text-base font-bold text-slate-800">No products match parameters</h3>
            <p className="text-sm text-slate-400">Try modifying your query inputs or search toggles.</p>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID PRODUCTS VIEW CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 erp-card hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* FLOATING CHIPS BADGES */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] tracking-wide font-extrabold shadow-sm text-white ${
                    product.isDeleted ? "bg-rose-500" : "bg-emerald-500"
                  }`}>
                    {product.isDeleted ? "Hidden" : "Active"}
                  </span>
                </div>

                {/* ARTWORK PRODUCT WRAPPER */}
                <div className="relative h-44 erp-page flex items-center justify-center p-4 border-b border-slate-100 overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/source/${product.id}.png`}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/300x300?text=Product";
                    }}
                    className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                  <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-250 w-8 h-8 rounded-xl erp-card/90 shadow hover:erp-card flex items-center justify-center text-xs active:scale-90">
                    ❤️
                  </button>
                </div>

                {/* PRODUCT IDENTIFIER CONTENT BLOCK */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block truncate">
                      {product.categoryName || "Uncategorized"}
                    </span>
                    <h2 className="mt-1 font-bold text-slate-800 text-sm tracking-tight leading-tight line-clamp-2 h-10 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h2>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-black text-slate-900">₹{product.price}</span>
                        <span className="text-[10px] text-slate-400 block font-medium uppercase">{product.uomName || "unit"}</span>
                      </div>
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        GST {product.taxRate}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2 rounded-xl text-xs font-bold shadow-sm transition-all">
                        Cart
                      </button>
                      <button className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 py-2 rounded-xl text-xs font-bold transition-all">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DATA COMPACT LISTING SCHEDULER VIEW */
          <div className="erp-card rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* TABLE HEAD HEADER CONTROLS */}
                <div className="grid grid-cols-12 erp-page border-b px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2 text-right">Pricing Summary</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-1 text-center">Operation</div>
                </div>

                {/* DYNAMIC LIST METRICS DATA */}
                <div className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-12 px-4 py-3 hover:erp-page/50 transition items-center text-slate-700"
                    >
                      <div className="col-span-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl erp-page flex-shrink-0 border p-1 flex items-center justify-center">
                          <img
                            src={`${API_BASE_URL}/source/${product.id}.png`}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.src = "https://placehold.co/100x100?text=PO";
                            }}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-sm text-slate-900 truncate pr-4">
                            {product.name}
                          </div>
                          <div className="text-xs text-slate-400 font-medium uppercase mt-0.5">
                            UOM: {product.uomName || "Pcs"}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-sm font-medium text-slate-600 truncate pr-2">
                        {product.categoryName || "Uncategorized"}
                      </div>

                      <div className="col-span-2 text-right">
                        <div className="text-base font-black text-slate-900">
                          ₹{product.price?.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400">
                          GST Applicable: {product.taxRate}%
                        </div>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          product.isDeleted
                            ? "bg-rose-50 text-rose-600 ring-1 ring-rose-500/10"
                            : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10"
                        }`}>
                          {product.isDeleted ? "Hidden" : "Active"}
                        </span>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95">
                          Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}