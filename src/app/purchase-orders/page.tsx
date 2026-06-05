"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "../components/layout/AppLayout";
import { API_BASE_URL } from "../services/api";

interface PurchaseOrder {
    id: string;
    number: string;
    description: string;
    status: number;
    statusString: string;
    orderDate: string;
    vendorId: string;
    vendorName: string;
    buyerId: string;
    buyerName: string;
    currencyName: string;
    total: number;
}

export default function PurchaseOrdersPage() {
    const router = useRouter();

    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
    const [showConfirmModal, setShowConfirmModal] =
        useState(false);
    const [showReceiptModal, setShowReceiptModal] =
        useState(false);

    const [creatingReceipt, setCreatingReceipt] =
        useState(false);

    const [showBillModal, setShowBillModal] =
        useState(false);

    const [creatingBill, setCreatingBill] =
        useState(false);

    const [showBillLookup, setShowBillLookup] =
        useState(false);

    const [bills, setBills] =
        useState<any[]>([]);

    const [loadingBills, setLoadingBills] =
        useState(false);

    const [showReceiptLookup, setShowReceiptLookup] =
        useState(false);

    const [receipts, setReceipts] =
        useState<any[]>([]);

    const [loadingReceipts, setLoadingReceipts] =
        useState(false);
    async function loadOrders() {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/purchase-order`);

            if (!response.ok) {
                throw new Error("Failed to load orders");
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
            alert("Failed to load purchase orders");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(
            (x) =>
                x.number?.toLowerCase().includes(search.toLowerCase()) ||
                x.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
                x.buyerName?.toLowerCase().includes(search.toLowerCase())
        );
    }, [orders, search]);

    async function deleteOrder() {
        if (!selectedOrder) return;

        if (!confirm(`Are you sure you want to delete Purchase Order ${selectedOrder.number}?`))
            return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/purchase-order/${selectedOrder.id}`,
                { method: "DELETE" }
            );

            if (!response.ok) throw new Error();

            alert("Deleted successfully");
            setSelectedOrder(null);
            loadOrders();
        } catch {
            alert("Delete failed");
        }
    }


    const confirmOrder = async () => {
        try {

            const response = await fetch(
                `${API_BASE_URL}/purchase-order/confirm/${selectedOrder?.id}`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            setShowConfirmModal(false);

            await loadOrders();

        } catch (err) {

            console.error(err);

            setShowConfirmModal(false);
        }
    };


    const createReceipt = async () => {
        if (!selectedOrder) return;

        try {

            setCreatingReceipt(true);

            const response = await fetch(
                `${API_BASE_URL}/purchase-order/generate-draft-receipt/${selectedOrder.id}`,
                {
                    method: "POST"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to create receipt"
                );
            }

            setShowReceiptModal(false);

            await loadOrders();

            // optional
            // await loadDetails(selectedOrder.id);

        } catch (error) {

            console.error(error);

        } finally {

            setCreatingReceipt(false);

        }
    };


    const createBill = async () => {
        if (!selectedOrder) return;

        try {

            setCreatingBill(true);

            const response = await fetch(
                `${API_BASE_URL}/purchase-order/generate-bill/${selectedOrder.id}`,
                {
                    method: "POST"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to create receipt"
                );
            }

            setShowBillModal(false);

            await loadOrders();

            // optional
            // await loadDetails(selectedOrder.id);

        } catch (error) {

            console.error(error);

        } finally {

            setCreatingBill(false);

        }
    };


    const loadBillLookup = async () => {

        if (!selectedOrder) return;

        try {

            setLoadingBills(true);

            const response = await fetch(
                `${API_BASE_URL}/vendor-bill/with-total-by-purchase-order/${selectedOrder.id}`
            );

            const data =
                await response.json();

            setBills(data);

            setShowBillLookup(true);

        } catch (err) {

            console.error(err);

        } finally {

            setLoadingBills(false);

        }


    };

    const loadReceiptLookup = async () => {

        if (!selectedOrder) return;

        try {

            setLoadingReceipts(true);

            const response = await fetch(
                `${API_BASE_URL}/purchase-receipt/by-purchase-order/${selectedOrder.id}`
            );

            const data =
                await response.json();

            setReceipts(data);

            setShowReceiptLookup(true);

        } catch (err) {

            console.error(err);

        } finally {

            setLoadingReceipts(false);

        }
    };

    const openPurchaseOrder = (
        purchaseOrderId: string
    ) => {

        router.push(
            `/purchase-orders/${purchaseOrderId}`
        );
    };



    return (
        <AppLayout>
            <div className="min-h-screen erp-page/50 p-6 space-y-6">

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Purchase Orders
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Manage procurement, vendor purchases, and tracking logs
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadOrders}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 erp-card border border-slate-200 rounded-lg shadow-sm hover:erp-page focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Refresh List
                        </button>
                        <button
                            onClick={() => router.push("/purchase-orders/create")}
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <span className="mr-1.5 font-semibold">+</span> New PO
                        </button>
                    </div>
                </div>

                {/* SEARCH & ACTIONS TOOLBAR */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-center erp-card p-4 border border-slate-200 shadow-sm rounded-xl">

                    {/* SEARCH INPUT */}
                    <div className="xl:col-span-1 relative">
                        <input
                            type="text"
                            placeholder="Search code, vendor or buyer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg pl-4 pr-4 py-2 text-sm erp-page/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:erp-card focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    {/* DYNAMIC ACTIONS */}
                    <div className="xl:col-span-2 flex flex-wrap gap-2 justify-start xl:justify-end">
                        <button
                            disabled={selectedOrder?.status !== 1}
                            onClick={() => router.push(`/purchase-orders/${selectedOrder?.id}/edit`)}
                            className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:erp-page disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            Edit
                        </button>
                        <button
                            disabled={selectedOrder?.status !== 1}
                            onClick={deleteOrder}
                            className="px-3 py-2 text-xs font-medium border border-red-200 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            Delete
                        </button>
                        <button
                            disabled={!selectedOrder}
                            onClick={() => router.push(`/purchase-orders/${selectedOrder?.id}`)}
                            className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-700 hover:erp-page disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            Details
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
                        {selectedOrder?.status === 1 && (
                            <button
                                disabled={!selectedOrder}

                                onClick={() =>
                                    setShowConfirmModal(true)
                                }
                                className="
        px-3 py-2
        text-xs
        font-medium
        bg-emerald-600
        text-white
        rounded-lg
        hover:bg-emerald-700
        disabled:opacity-30
        transition-all
    "
                            >
                                Confirm Order
                            </button>
                        )}
                        <button
                            disabled={
                                selectedOrder?.status !== 1
                            }
                            className="px-3 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={
                                !selectedOrder ||
                                selectedOrder.status !== 2
                            }
                            onClick={() =>
                                setShowReceiptModal(true)
                            }
                            className="
        px-3 py-2
        text-xs
        font-medium
        bg-blue-600
        text-white
        rounded-lg
        hover:bg-blue-700
        disabled:opacity-30
        transition-all
    "
                        >
                            Create Receipt
                        </button>
                        <button
                            disabled={
                                !selectedOrder ||
                                selectedOrder.status !== 2
                            }
                            onClick={() =>
                                setShowBillModal(true)
                            }
                            className="
        px-3 py-2
        text-xs
        font-medium
        bg-blue-600
        text-white
        rounded-lg
        hover:bg-blue-700
        disabled:opacity-30
        transition-all
    "
                        >
                            Generate Bill
                        </button>

                        <button
                            disabled={
                                !selectedOrder ||
                                selectedOrder.status !== 2
                            }
                            onClick={() => loadBillLookup()}
                            className="
        px-3 py-2
        text-xs
        font-medium
        bg-violet-600
        text-white
        rounded-lg
        hover:bg-violet-700
        disabled:opacity-30
        transition-all
    "
                        >
                            Bill Lookup
                        </button>

                        <button
                            disabled={
                                !selectedOrder ||
                                selectedOrder.status !== 2
                            }
                            onClick={() => loadReceiptLookup()}
                            className="
        px-3 py-2
        text-xs
        font-medium
        bg-cyan-600
        text-white
        rounded-lg
        hover:bg-cyan-700
        disabled:opacity-30
        transition-all
    "
                        >
                            Receipt Lookup
                        </button>
                    </div>
                </div>

                {/* DATATABLE DATA CONTAINER */}
                <div className="erp-card border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-16 flex flex-col items-center justify-center space-y-3">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-slate-500">Fetching records...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="erp-page/70 border-b border-slate-200">
                                        <th className="w-12 p-4 text-center"></th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Number</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Vendor</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Buyer</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Order Date</th>
                                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Total</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredOrders.map((order) => {
                                        const isSelected = selectedOrder?.id === order.id;
                                        return (
                                            <tr
                                                key={order.id}
                                                onClick={() => setSelectedOrder(order)}
                                                className={`group cursor-pointer transition-colors hover:erp-page/80 ${isSelected ? "bg-blue-50/50 hover:bg-blue-50" : ""
                                                    }`}
                                            >
                                                {/* CHECKBOX/RADIO INDICATOR ROW */}
                                                <td className="p-4 text-center relative">
                                                    {isSelected && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600" />
                                                    )}
                                                    <input
                                                        type="radio"
                                                        checked={isSelected}
                                                        onChange={() => setSelectedOrder(order)}
                                                        className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                                    />
                                                </td>

                                                {/* DIRECT LINK ON ORDER NUMBER */}
                                                <td
                                                    className="p-4 font-bold text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/purchase-orders/${order.id}`);
                                                    }}
                                                >
                                                    {order.number}
                                                </td>

                                                <td className="p-4 text-sm font-medium text-slate-700">
                                                    {order.vendorName || "—"}
                                                </td>

                                                <td className="p-4 text-sm text-slate-600">
                                                    {order.buyerName || "—"}
                                                </td>

                                                <td className="p-4 text-sm">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${order.status === 1
                                                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10"
                                                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10"
                                                            }`}
                                                    >
                                                        {order.statusString}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-sm text-slate-500">
                                                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </td>

                                                <td className="p-4 text-sm font-semibold text-slate-900 text-right">
                                                    <span className="text-xs text-slate-400 font-normal mr-1">
                                                        {order.currencyName}
                                                    </span>
                                                    {order.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-12 text-center">
                                                <div className="text-slate-400 font-medium text-sm">
                                                    No purchase orders found matching your search.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TABLE FOOTER */}
                    <div className="erp-page p-4 border-t border-slate-200 flex items-center justify-between text-xs font-medium text-slate-500">
                        <div>
                            Showing {filteredOrders.length} of {orders.length} orders
                        </div>
                        <div>
                            {selectedOrder ? (
                                <span className="text-blue-600">Selected: {selectedOrder.number}</span>
                            ) : (
                                <span>No order selected</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            {
                showConfirmModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="w-full max-w-md erp-card rounded-3xl shadow-2xl overflow-hidden">

                            <div className="p-6">

                                <div className="flex justify-center mb-4">

                                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">

                                        <svg
                                            className="w-10 h-10 text-amber-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                                            />
                                        </svg>

                                    </div>

                                </div>

                                <h2 className="text-2xl font-bold text-center text-slate-800">

                                    Confirm Purchase Order

                                </h2>

                                <p className="mt-3 text-center text-slate-500">

                                    Are you sure you want to confirm

                                    <span className="font-semibold text-slate-700">
                                        {" "}
                                        {selectedOrder?.number}
                                    </span>

                                    ?

                                </p>

                            </div>

                            <div className="px-6 pb-6 flex gap-3">

                                <button
                                    onClick={() =>
                                        setShowConfirmModal(false)
                                    }
                                    className="
                flex-1
                py-3
                rounded-xl
                bg-slate-100
                text-slate-700
                hover:bg-slate-200
                font-medium
                "
                                >
                                    No
                                </button>

                                <button
                                    onClick={confirmOrder}
                                    className="
                flex-1
                py-3
                rounded-xl
                bg-emerald-600
                text-white
                hover:bg-emerald-700
                font-medium
                "
                                >
                                    Yes, Confirm
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            {
                showReceiptModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="w-full max-w-md erp-card rounded-3xl shadow-2xl overflow-hidden">

                            <div className="p-6">

                                <div className="flex justify-center mb-4">

                                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

                                        📦

                                    </div>

                                </div>

                                <h2 className="text-2xl font-bold text-center text-slate-800">

                                    Generate Receipt

                                </h2>

                                <p className="mt-3 text-center text-slate-500">

                                    Generate Purchase Receipt from

                                    <span className="font-semibold text-slate-700">

                                        {" "}
                                        {selectedOrder?.number}

                                    </span>

                                    ?

                                </p>

                            </div>

                            <div className="px-6 pb-6 flex gap-3">

                                <button
                                    onClick={() =>
                                        setShowReceiptModal(false)
                                    }
                                    className="
                flex-1
                py-3
                rounded-xl
                bg-slate-100
                text-slate-700
                hover:bg-slate-200
                "
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={creatingReceipt}
                                    onClick={createReceipt}
                                    className="
                flex-1
                py-3
                rounded-xl
                bg-blue-600
                text-white
                hover:bg-blue-700
                disabled:opacity-50
                "
                                >
                                    {
                                        creatingReceipt
                                            ? "Creating..."
                                            : "Generate Receipt"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                )}


            {
                showBillModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="w-full max-w-md erp-card rounded-3xl shadow-2xl overflow-hidden">

                            <div className="p-6">

                                <div className="flex justify-center mb-4">

                                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

                                        📦

                                    </div>

                                </div>

                                <h2 className="text-2xl font-bold text-center text-slate-800">

                                    Generate Bill

                                </h2>

                                <p className="mt-3 text-center text-slate-500">

                                    Generate Purchase Receipt Bill

                                    <span className="font-semibold text-slate-700">

                                        {" "}
                                        {selectedOrder?.number}

                                    </span>

                                    ?

                                </p>

                            </div>

                            <div className="px-6 pb-6 flex gap-3">

                                <button
                                    onClick={() =>
                                        setShowBillModal(false)
                                    }
                                    className="
                flex-1
                py-3
                rounded-xl
                bg-slate-100
                text-slate-700
                hover:bg-slate-200
                "
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={creatingBill}
                                    onClick={createBill}
                                    className="
                flex-1
                py-3
                rounded-xl
                bg-blue-600
                text-white
                hover:bg-blue-700
                disabled:opacity-50
                "
                                >
                                    {
                                        creatingBill
                                            ? "Creating..."
                                            : "Generate Bill"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                )}


            {
                showBillLookup && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="erp-card rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden">

                            {/* Header */}

                            <div className="flex items-center justify-between px-8 py-6 border-b">

                                <h2 className="text-3xl font-bold text-slate-800">
                                    Vendor Bills
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowBillLookup(false)
                                    }
                                    className="
                    text-3xl
                    text-slate-500
                    hover:text-red-500
                "
                                >
                                    ×
                                </button>

                            </div>

                            {/* Body */}

                            <div className="p-6">

                                {loadingBills ? (

                                    <div className="py-20 text-center">

                                        Loading Bills...

                                    </div>

                                ) : (

                                    <div className="overflow-x-auto">

                                        <table className="w-full">

                                            <thead>

                                                <tr className="border-b erp-page">

                                                    <th className="p-4 text-left">
                                                        Bill Number
                                                    </th>

                                                    <th className="p-4 text-left">
                                                        Purchase Order
                                                    </th>

                                                    <th className="p-4 text-left">
                                                        Vendor
                                                    </th>

                                                    <th className="p-4 text-left">
                                                        Bill Date
                                                    </th>

                                                    <th className="p-4 text-right">
                                                        Total
                                                    </th>

                                                    <th className="p-4 text-center">
                                                        Status
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {bills.map((bill) => (

                                                    <tr
                                                        key={bill.id}
                                                        className="
                                        border-b
                                        hover:erp-page
                                    "
                                                    >

                                                        <td className="p-4">

                                                            <span
                                                                className="
                                                text-blue-600
                                                font-medium
                                            "
                                                            >
                                                                {bill.number}
                                                            </span>

                                                        </td>

                                                        <td className="p-4">

                                                            <button
                                                                onClick={() =>
                                                                    openPurchaseOrder(
                                                                        bill.sourceDocumentId
                                                                    )
                                                                }
                                                                className="
                                                text-blue-600
                                                hover:text-blue-800
                                                hover:underline
                                                font-medium
                                            "
                                                            >
                                                                {bill.sourceDocument}
                                                            </button>

                                                        </td>

                                                        <td className="p-4">
                                                            {bill.vendorName}
                                                        </td>

                                                        <td className="p-4">

                                                            {new Date(
                                                                bill.billDate
                                                            ).toLocaleDateString()}

                                                        </td>

                                                        <td className="p-4 text-right font-bold text-emerald-600">

                                                            {bill.currencyName}

                                                            {" "}

                                                            {Number(
                                                                bill.total
                                                            ).toLocaleString()}

                                                        </td>

                                                        <td className="p-4 text-center">

                                                            <span
                                                                className={`
                                            px-3 py-1 rounded-full text-xs font-semibold

                                            ${bill.statusString ===
                                                                        "Draft"
                                                                        ? "bg-amber-100 text-amber-700"
                                                                        : "bg-emerald-100 text-emerald-700"
                                                                    }
                                        `}
                                                            >
                                                                {
                                                                    bill.statusString
                                                                }
                                                            </span>

                                                        </td>

                                                    </tr>

                                                ))}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>

                            {/* Footer */}

                            <div className="flex justify-end p-6 border-t erp-page">

                                <button
                                    onClick={() =>
                                        setShowBillLookup(false)
                                    }
                                    className="
                    px-6 py-3
                    bg-slate-600
                    text-white
                    rounded-xl
                    hover:bg-slate-700
                "
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}
            {
                showReceiptLookup && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="erp-card rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">

                            {/* Header */}

                            <div className="flex items-center justify-between px-6 py-5 border-b">

                                <h2 className="text-2xl font-semibold text-slate-800">
                                    Purchase Receipt
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowReceiptLookup(false)
                                    }
                                    className="
                    text-3xl
                    text-slate-400
                    hover:text-red-500
                "
                                >
                                    ×
                                </button>

                            </div>

                            {/* Body */}

                            <div className="p-5">

                                {loadingReceipts ? (

                                    <div className="py-16 text-center">

                                        Loading receipts...

                                    </div>

                                ) : (

                                    <div className="overflow-x-auto border rounded-lg">

                                        <table className="w-full">

                                            <thead>

                                                <tr className="erp-page border-b">

                                                    <th className="text-left p-4 font-semibold text-slate-600">
                                                        Purchase Receipt
                                                    </th>

                                                    <th className="text-left p-4 font-semibold text-slate-600">
                                                        Purchase Order
                                                    </th>

                                                    <th className="text-left p-4 font-semibold text-slate-600">
                                                        Receipt Date
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {receipts.map((receipt) => (

                                                    <tr
                                                        key={receipt.id}
                                                        className="
                                        border-b
                                        hover:erp-page
                                    "
                                                    >

                                                        <td className="p-4">

                                                            <span
                                                                className="
                                                text-blue-600
                                                hover:underline
                                                cursor-pointer
                                            "
                                                            >
                                                                {receipt.number}
                                                            </span>

                                                        </td>

                                                        <td className="p-4">

                                                            <button
                                                                onClick={() =>
                                                                    openPurchaseOrder(
                                                                        receipt.purchaseOrderId
                                                                    )
                                                                }
                                                                className="
                                                text-blue-600
                                                hover:text-blue-800
                                                hover:underline
                                            "
                                                            >
                                                                {
                                                                    receipt.purchaseOrderNumber
                                                                }
                                                            </button>

                                                        </td>

                                                        <td className="p-4">

                                                            {new Date(
                                                                receipt.receiptDate
                                                            ).toLocaleDateString()}

                                                        </td>

                                                    </tr>

                                                ))}

                                                {receipts.length === 0 && (

                                                    <tr>

                                                        <td
                                                            colSpan={3}
                                                            className="
                                            p-8
                                            text-center
                                            text-slate-500
                                        "
                                                        >
                                                            No receipts found.
                                                        </td>

                                                    </tr>

                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>

                            {/* Footer */}

                            <div className="flex justify-end px-6 py-5 border-t erp-page">

                                <button
                                    onClick={() =>
                                        setShowReceiptLookup(false)
                                    }
                                    className="
                    px-6 py-3
                    bg-slate-600
                    text-white
                    rounded-lg
                    hover:bg-slate-700
                "
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}
        </AppLayout>

    );
}