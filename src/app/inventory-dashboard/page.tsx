"use client";

import { useEffect, useState, useRef } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";

export default function InventoryDashboardPage() {
    const [summary, setSummary] = useState<any>(null);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [loadingItems, setLoadingItems] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    // Ref to track the identifier of the latest requested warehouse data (Fixes Race Condition)
    const latestWarehouseRef = useRef<string>("");

    useEffect(() => {
        loadDashboard();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    async function loadDashboard() {
        try {
            const [summaryRes, warehouseRes] = await Promise.all([
                fetch(`${API_BASE_URL}/currency/summary`),
                fetch(`${API_BASE_URL}/currency/warehouse-summary`),
            ]);

            const summaryData = await summaryRes.json();
            const warehouseData = await warehouseRes.json();

            setSummary(summaryData);
            setWarehouses(warehouseData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSummary(false);
        }
    }

    async function loadWarehouseItems(warehouse: string) {
        latestWarehouseRef.current = warehouse;

        try {
            setLoadingItems(true);
            setCurrentPage(1);
            setSelectedWarehouse(warehouse);
            setItems([]); // Clear old items instantly

            const response = await fetch(
                `${API_BASE_URL}/currency/items?warehouse=${warehouse}`
            );

            const data = await response.json();

            // Guard: Only update state if this belongs to the warehouse clicked LAST
            if (latestWarehouseRef.current === warehouse) {
                setItems(data);
            }
        } catch (err) {
            if (latestWarehouseRef.current === warehouse) {
                console.error(err);
            }
        } finally {
            if (latestWarehouseRef.current === warehouse) {
                setLoadingItems(false);
            }
        }
    }

    const filteredItems = items.filter((item) => {
        const query = search.toLowerCase();
        return (
            item.itemCode?.toLowerCase().includes(query) ||
            item.itemName?.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredItems.length / pageSize);

    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    if (loadingSummary) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center text-white space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    <div className="text-lg font-medium text-slate-400">
                        Loading Inventory Analytics...
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 max-w-[1600px] mx-auto tracking-tight">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 border-b border-slate-800/60 pb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Inventory Dashboard
                        </h1>
                        <p className="text-slate-400 text-sm mt-1 font-medium">
                            SAP Business One Real-time Analytics
                        </p>
                    </div>
                </div>

                {/* KPI Metrics Grid - Optimized responsive columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
                    <Card title="Total Items" value={summary?.totalItems} />
                    <Card title="Total Stock" value={summary?.totalStock} />
                    <Card
                        title="Inventory Value"
                        value={`₹${Number(summary?.inventoryValue || 0).toLocaleString('en-IN')}`}
                        color="text-emerald-400"
                    />
                    <Card
                        title="Low Stock"
                        value={summary?.lowStockItems}
                        color="text-amber-400"
                    />
                    <Card
                        title="Out Of Stock"
                        value={summary?.outOfStockItems}
                        color="text-rose-400"
                    />
                </div>

                {/* Warehouses Section */}
                <div className="mb-12">
                    <div className="flex items-center space-x-2 mb-6">
                        <h2 className="text-xl font-bold text-slate-200">Warehouses</h2>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-semibold">
                            {warehouses.length} Total
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {warehouses.map((wh) => {
                            const isSelected = selectedWarehouse === wh.whsCode;
                            return (
                                <div
                                    key={wh.whsCode}
                                    onClick={() => loadWarehouseItems(wh.whsCode)}
                                    className={`
                                        cursor-pointer rounded-2xl p-5 border transition-all duration-300 group min-w-0
                                        ${isSelected 
                                            ? "bg-gradient-to-b from-indigo-600 to-indigo-700 border-indigo-400 shadow-lg shadow-indigo-600/20 text-white" 
                                            : "bg-slate-900/50 backdrop-blur-md border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-100"
                                        }
                                    `}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="text-lg font-bold tracking-wide group-hover:text-indigo-400 transition-colors duration-200 truncate">
                                            {wh.whsCode}
                                        </div>
                                        <div className={`text-xs px-2 py-0.5 rounded-md font-medium shrink-0 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                            Active
                                        </div>
                                    </div>
                                    <div className={`text-sm mt-1 truncate ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                                        {wh.whsName}
                                    </div>
                                    
                                    <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <div className={`text-xs uppercase tracking-wider ${isSelected ? 'text-indigo-200' : 'text-slate-500'} truncate`}>Value</div>
                                            <div 
                                                className={`font-bold text-sm sm:text-base mt-0.5 truncate ${isSelected ? 'text-white' : 'text-emerald-400'}`}
                                                title={`₹${Number(wh.inventoryValue).toLocaleString('en-IN')}`}
                                            >
                                                ₹{Number(wh.inventoryValue).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <div className="text-right min-w-0">
                                            <div className={`text-xs uppercase tracking-wider ${isSelected ? 'text-indigo-200' : 'text-slate-500'} truncate`}>Stock</div>
                                            <div className="font-semibold text-xs sm:text-sm mt-0.5 text-slate-300 truncate">
                                                {wh.availableStock} pcs
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Dynamic Content Block */}
                {!selectedWarehouse ? (
                    <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl p-16 text-center max-w-xl mx-auto mt-6">
                        <div className="text-5xl mb-4 opacity-70">📦</div>
                        <h2 className="text-lg font-bold text-slate-200">No Warehouse Selected</h2>
                        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                            Please select one of the warehouse analytical models above to view item listings and inventory lifecycle data.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 transition-all duration-300">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/40 p-4 border border-slate-800 rounded-2xl backdrop-blur-sm">
                            <div className="w-full sm:max-w-md relative">
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by Item Code or Description..."
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                                />
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                                Filtered results: {filteredItems.length} items
                            </div>
                        </div>

                        {/* Inventory Table Card */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                            {loadingItems ? (
                                <div className="p-24 text-center flex flex-col items-center justify-center space-y-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                                    <div className="text-slate-400 text-sm">Querying database items...</div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left text-sm">
                                        <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800/80">
                                            <tr>
                                                <th className="p-4 font-medium">Item Code</th>
                                                <th className="p-4 font-medium">Item Name</th>
                                                <th className="p-4 font-medium text-right">On Hand</th>
                                                <th className="p-4 font-medium text-right">Available</th>
                                                <th className="p-4 font-medium text-right">Stock Value</th>
                                                <th className="p-4 font-medium text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-850 text-slate-300">
                                            {paginatedItems.map((item) => (
                                                <tr
                                                    key={`${item.itemCode}-${item.whsCode}`}
                                                    className="hover:bg-slate-800/30 transition-colors"
                                                >
                                                    <td className="p-4 font-mono font-medium text-indigo-400">{item.itemCode}</td>
                                                    <td className="p-4 max-w-xs truncate text-slate-200 font-medium" title={item.itemName}>{item.itemName}</td>
                                                    <td className="p-4 text-right font-medium">{item.onHand}</td>
                                                    <td className="p-4 text-right font-bold text-cyan-400">{item.availableStock}</td>
                                                    <td className="p-4 text-right text-emerald-400 font-semibold">
                                                        ₹{Number(item.stockValue).toLocaleString('en-IN')}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <StatusBadge status={item.stockStatus} />
                                                    </td>
                                                </tr>
                                            ))}
                                            {paginatedItems.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                                                        No stock items matched your lookup filter.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Clean Pagination Control Bar */}
                        {!loadingItems && totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-4 gap-4">
                                <div className="text-xs text-slate-400 font-medium">
                                    Displaying <span className="text-slate-200 font-bold">{((currentPage - 1) * pageSize) + 1}</span> to{" "}
                                    <span className="text-slate-200 font-bold">
                                        {Math.min(currentPage * pageSize, filteredItems.length)}
                                    </span>{" "}
                                    of <span className="text-indigo-400 font-bold">{filteredItems.length}</span> records
                                </div>
                                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-all"
                                    >
                                        Prev
                                    </button>
                                    <div className="text-xs font-semibold text-slate-400 px-1">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

// Fixed Card Component: Handles huge numeric inputs flawlessly without breaking layout bounds
function Card({ title, value, color = "" }: any) {
    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all flex flex-col justify-between min-w-0">
            <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider truncate">
                {title}
            </div>
            <div 
                className={`text-xl sm:text-2xl xl:text-3xl font-black mt-2 tracking-tight truncate ${color || "text-white"}`}
                title={String(value ?? 0)}
            >
                {value ?? 0}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === "Available") {
        return (
            <span className="inline-flex items-center bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-500/20">
                • Available
            </span>
        );
    }
    if (status === "Low Stock") {
        return (
            <span className="inline-flex items-center bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-500/20">
                • Low Stock
            </span>
        );
    }
    return (
        <span className="inline-flex items-center bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-md text-xs font-bold border border-rose-500/20">
            • Out Of Stock
        </span>
    );
}