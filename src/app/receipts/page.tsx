"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";

export default function PurchaseReceiptsPage() {
    const params = useParams();
    const router = useRouter();

    const purchaseOrderId = params.id as string;

    const [receipts, setReceipts] = useState<any[]>([]);
    const [filteredReceipts, setFilteredReceipts] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    const [selectedReceipt, setSelectedReceipt] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    const [showConfirmModal, setShowConfirmModal] =
        useState(false);

    const [showReturnModal, setShowReturnModal] =
        useState(false);

    useEffect(() => {
        loadReceipts();
    }, []);

    useEffect(() => {
        const filtered = receipts.filter(
            (x) =>
                x.number
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                x.vendorName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
        );

        setFilteredReceipts(filtered);
    }, [search, receipts]);

    async function loadReceipts() {
        try {
            setLoading(true);

            const response = await fetch(
                //`${API_BASE_URL}/api/app/purchase-receipt/by-purchase-order/${purchaseOrderId}`
                `${API_BASE_URL}/purchase-receipt`
            );

            const data = await response.json();

            setReceipts(data);
            setFilteredReceipts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function confirmReceipt() {
        if (!selectedReceipt) return;

        try {
            await fetch(
                `${API_BASE_URL}/purchase-receipt/confirm/${selectedReceipt.id}`,
                {
                    method: "POST",
                }
            );

            setShowConfirmModal(false);

            await loadReceipts();
        } catch (err) {
            console.error(err);
        }
    }

    async function returnReceipt() {
        if (!selectedReceipt) return;

        try {
            await fetch(
                `${API_BASE_URL}/purchase-receipt/return/${selectedReceipt.id}`,
                {
                    method: "POST",
                }
            );

            setShowReturnModal(false);

            await loadReceipts();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <AppLayout>

            <div className="min-h-screen bg-slate-950 p-6">

                {/* Header */}

                <div className="mb-6">

                    <h1 className="text-4xl font-bold text-white">
                        Purchase Receipts
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Goods Receipt Notes generated from
                        Purchase Orders
                    </p>

                </div>

                {/* Toolbar */}

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-6">

                    <div className="flex flex-wrap gap-3">

                        <button
                            onClick={() => router.back()}
                            className="
              px-4 py-2
              rounded-xl
              bg-slate-800
              text-white
              hover:bg-slate-700
            "
                        >
                            Back
                        </button>

                        <button
                            disabled={
                                !selectedReceipt ||
                                selectedReceipt.status !== 1
                            }
                            onClick={() =>
                                setShowConfirmModal(true)
                            }
                            className="
              px-4 py-2
              rounded-xl
              bg-emerald-600
              text-white
              disabled:opacity-30
            "
                        >
                            Confirm Receipt
                        </button>

                        <button
                            disabled={
                                !selectedReceipt ||
                                selectedReceipt.status !== 2
                            }
                            onClick={() =>
                                setShowReturnModal(true)
                            }
                            className="
              px-4 py-2
              rounded-xl
              bg-red-600
              text-white
              disabled:opacity-30
            "
                        >
                            Return Receipt
                        </button>

                    </div>

                </div>

                {/* Search */}

                <div className="mb-6">

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search receipt..."
                        className="
            w-full
            bg-slate-900
            border border-slate-800
            rounded-2xl
            px-5 py-4
            text-white
          "
                    />

                </div>

                {/* Table */}

                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">

                    {loading ? (

                        <div className="p-10 text-center text-slate-400">
                            Loading...
                        </div>

                    ) : (

                        <table className="w-full">

                            <thead>

                                <tr className="bg-slate-800">

                                    <th className="p-4"></th>

                                    <th className="p-4 text-left text-slate-300">
                                        Receipt No
                                    </th>

                                    <th className="p-4 text-left text-slate-300">
                                        Vendor
                                    </th>

                                    <th className="p-4 text-left text-slate-300">
                                        PO Number
                                    </th>

                                    <th className="p-4 text-left text-slate-300">
                                        Receipt Date
                                    </th>

                                    <th className="p-4 text-center text-slate-300">
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredReceipts.map(
                                    (receipt) => (

                                        <tr
                                            key={receipt.id}
                                            className="
                      border-t
                      border-slate-800
                      hover:bg-slate-800/50
                    "
                                        >

                                            <td className="p-4">

                                                <input
                                                    type="radio"
                                                    checked={
                                                        selectedReceipt?.id ===
                                                        receipt.id
                                                    }
                                                    onChange={() =>
                                                        setSelectedReceipt(
                                                            receipt
                                                        )
                                                    }
                                                />

                                            </td>

                                            <td className="p-4">
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/receipts/${receipt.id}`
                                                        )
                                                    }
                                                    className="
      text-blue-600
      hover:text-blue-800
      hover:underline
      font-medium
    "
                                                >
                                                    {receipt.number}
                                                </button>
                                            </td>

                                            <td className="p-4 text-slate-300">
                                                {receipt.vendorName}
                                            </td>

                                            <td className="p-4 text-slate-300">
                                                {
                                                    receipt.purchaseOrderNumber
                                                }
                                            </td>

                                            <td className="p-4 text-slate-300">

                                                {new Date(
                                                    receipt.receiptDate
                                                ).toLocaleDateString()}

                                            </td>

                                            <td className="p-4 text-center">

                                                <span
                                                    className={
                                                        receipt.status === 1
                                                            ? "px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300"
                                                            : "px-3 py-1 rounded-full bg-green-500/20 text-green-300"
                                                    }
                                                >
                                                    {
                                                        receipt.statusString
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

            {/* Confirm Modal */}

            {showConfirmModal && (

                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-slate-900 rounded-3xl p-8 w-full max-w-md">

                        <h2 className="text-2xl font-bold text-white mb-4">
                            Confirm Receipt
                        </h2>

                        <p className="text-slate-400 mb-6">
                            Confirm receipt
                            {" "}
                            {selectedReceipt?.number} ?
                        </p>

                        <div className="flex gap-3">

                            <button
                                onClick={() =>
                                    setShowConfirmModal(false)
                                }
                                className="flex-1 py-3 rounded-xl bg-slate-700 text-white"
                            >
                                No
                            </button>

                            <button
                                onClick={confirmReceipt}
                                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white"
                            >
                                Yes
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* Return Modal */}

            {showReturnModal && (

                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-slate-900 rounded-3xl p-8 w-full max-w-md">

                        <h2 className="text-2xl font-bold text-white mb-4">
                            Return Receipt
                        </h2>

                        <p className="text-slate-400 mb-6">
                            Return receipt
                            {" "}
                            {selectedReceipt?.number} ?
                        </p>

                        <div className="flex gap-3">

                            <button
                                onClick={() =>
                                    setShowReturnModal(false)
                                }
                                className="flex-1 py-3 rounded-xl bg-slate-700 text-white"
                            >
                                No
                            </button>

                            <button
                                onClick={returnReceipt}
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white"
                            >
                                Yes
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </AppLayout>
    );
}