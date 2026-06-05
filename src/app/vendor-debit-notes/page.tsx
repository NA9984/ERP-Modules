"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "../components/layout/AppLayout";
import { API_BASE_URL } from "../services/api";

interface VendorDebitNote {
    id: string;
    number: string;
    description: string;
    termCondition: string;
    paymentNote: string;
    status: number;
    statusString: string;
    billDate: string;
    billDueDate: string;
    vendorId: string;
    vendorName: string;
    currencyName: string;
    total: number;
    sourceDocument: string;
    sourceDocumentId: string;
    sourceDocumentModule: number;
    sourceDocumentModuleString: string;
    sourceDocumentPath: string;
}

export default function VendorDebitNotesPage() {
    const router = useRouter();

    const [debitNotes, setDebitNotes] = useState<VendorDebitNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedDebitNote, setSelectedDebitNote] = useState<VendorDebitNote | null>(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentLookup, setShowPaymentLookup] = useState(false);
    
    const [isConfirming, setIsConfirming] = useState(false);
    const [creatingPayment, setCreatingPayment] = useState(false);
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [payments, setPayments] = useState<any[]>([]);

    async function loadDebitNotes() {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/vendor-debit-note`);
            if (!response.ok) throw new Error("Failed to fetch debit notes");
            const data = await response.json();
            setDebitNotes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDebitNotes();
    }, []);

    const filteredDebitNotes = useMemo(() => {
        return debitNotes.filter(
            x =>
                x.number?.toLowerCase().includes(search.toLowerCase()) ||
                x.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
                x.sourceDocument?.toLowerCase().includes(search.toLowerCase())
        );
    }, [debitNotes, search]);

    async function confirmDebitNote() {
        if (!selectedDebitNote) return;

        try {
            setIsConfirming(true);
            const response = await fetch(
                `${API_BASE_URL}/vendor-debit-note/confirm/${selectedDebitNote.id}`,
                { method: "POST" }
            );

            if (!response.ok) throw new Error("Failed to confirm debit note");

            setShowConfirmModal(false);
            setSelectedDebitNote(null);
            await loadDebitNotes();
        } catch (err) {
            console.error(err);
        } finally {
            setIsConfirming(false);
        }
    }

    async function generatePayment() {
        if (!selectedDebitNote) return;

        try {
            setCreatingPayment(true);
            const response = await fetch(
                `${API_BASE_URL}/vendor-debit-note/generate-payment/${selectedDebitNote.id}`,
                { method: "POST" }
            );

            if (!response.ok) throw new Error("Failed to generate payment");

            setShowPaymentModal(false);
            await loadDebitNotes();
        } catch (err) {
            console.error(err);
        } finally {
            setCreatingPayment(false);
        }
    }

    async function loadPayments() {
        if (!selectedDebitNote) return;

        try {
            setLoadingPayments(true);
            const response = await fetch(
                `${API_BASE_URL}/vendor-payment/by-debit-note/${selectedDebitNote.id}`
            );
            if (!response.ok) throw new Error("Failed to fetch payments");
            const data = await response.json();
            setPayments(data);
            setShowPaymentLookup(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPayments(false);
        }
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 selection:bg-indigo-500/30">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Vendor Debit Notes
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Manage vendor adjustments, internal payments and debit notes
                        </p>
                    </div>
                    <button
                        onClick={loadDebitNotes}
                        disabled={loading}
                        className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white disabled:opacity-40 font-medium transition-all duration-200"
                    >
                        {loading ? "Refreshing..." : "Refresh List"}
                    </button>
                </div>

                {/* SEARCH + TOOLBAR */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
                    <div className="flex flex-col xl:flex-row gap-4 justify-between">
                        <div className="relative xl:w-96">
                            <input
                                type="text"
                                placeholder="Search Debit Note..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                disabled={!selectedDebitNote}
                                onClick={() => router.push(`/vendor-debit-notes/${selectedDebitNote?.id}`)}
                                className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-20 transition-all duration-150"
                            >
                                Details
                            </button>

                            <button
                                disabled={selectedDebitNote?.status !== 1}
                                onClick={() => setShowConfirmModal(true)}
                                className="px-3 py-2 text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 rounded-lg hover:bg-emerald-900/60 disabled:opacity-20 transition-all duration-150"
                            >
                                Confirm Note
                            </button>

                            <button
                                disabled={selectedDebitNote?.status !== 2}
                                onClick={() => setShowPaymentModal(true)}
                                className="px-3 py-2 text-xs font-semibold bg-cyan-950/40 text-cyan-400 border border-cyan-800/60 rounded-lg hover:bg-cyan-900/60 disabled:opacity-20 transition-all duration-150"
                            >
                                Generate Payment
                            </button>

                            <button
                                disabled={selectedDebitNote?.status !== 2}
                                onClick={loadPayments}
                                className="px-3 py-2 text-xs font-semibold bg-indigo-950/40 text-indigo-400 border border-indigo-800/60 rounded-lg hover:bg-indigo-900/60 disabled:opacity-20 transition-all duration-150"
                            >
                                Payment Lookup
                            </button>
                        </div>
                    </div>
                </div>

                {/* TABLE CARD */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                    <th className="w-12 p-4"></th>
                                    <th className="p-4 text-left">Note No</th>
                                    <th className="p-4 text-left">Source Document</th>
                                    <th className="p-4 text-left">Module</th>
                                    <th className="p-4 text-left">Vendor</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-right">Total</th>
                                </tr>
                            </thead>
                                <tbody className="text-sm text-slate-300 divide-y divide-slate-800/50">
                                {filteredDebitNotes.map((debitNote) => {
                                    const isSelected = selectedDebitNote?.id === debitNote.id;
                                    return (
                                        <tr
                                            key={debitNote.id}
                                            onClick={() => setSelectedDebitNote(debitNote)}
                                            className={`group cursor-pointer transition-colors duration-150 ${isSelected ? "bg-indigo-950/30 hover:bg-indigo-950/40" : "hover:bg-slate-800/40"}`}
                                        >
                                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="radio"
                                                    name="selectedDebitNote"
                                                    checked={isSelected}
                                                    onChange={() => setSelectedDebitNote(debitNote)}
                                                    className="h-4 w-4 bg-slate-950 border-slate-700 text-indigo-600 focus:ring-offset-slate-900 focus:ring-indigo-500 accent-indigo-500"
                                                />
                                            </td>
                                            <td 
                                                className="p-4 font-semibold text-indigo-400 group-hover:text-indigo-300 hover:underline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/vendor-debit-notes/${debitNote.id}`);
                                                }}
                                            >
                                                {debitNote.number}
                                            </td>
                                            <td className="p-4 text-slate-400">{debitNote.sourceDocument || "—"}</td>
                                            <td className="p-4 text-slate-400">{debitNote.sourceDocumentModuleString}</td>
                                            <td className="p-4 font-medium text-slate-200">{debitNote.vendorName}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-0.5 inline-flex items-center text-xs font-semibold rounded-full ${
                                                    debitNote.status === 1 
                                                        ? "bg-amber-950/60 text-amber-400 border border-amber-800/40" 
                                                        : "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${debitNote.status === 1 ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                                                    {debitNote.statusString}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-mono font-medium text-white">
                                                <span className="text-xs text-slate-500 mr-1">{debitNote.currencyName}</span>
                                                {Number(debitNote.total).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredDebitNotes.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-16 text-center text-slate-500 font-medium">
                                            {loading ? "Loading telemetry data..." : "No vendor debit notes found"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER */}
                    <div className="bg-slate-950/40 border-t border-slate-800 p-4 flex justify-between text-xs text-slate-500 font-medium">
                        <div>
                            Showing <span className="text-slate-300">{filteredDebitNotes.length}</span> of <span className="text-slate-300">{debitNotes.length}</span> entries
                        </div>
                        <div className="font-mono">
                            {selectedDebitNote ? `[Selected: ${selectedDebitNote.number}]` : "No row targeted"}
                        </div>
                    </div>
                </div>
            </div>

            {/* CONFIRM DEBIT NOTE MODAL */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white">Confirm Debit Note</h2>
                            <p className="mt-2 text-sm text-slate-400">
                                Are you sure you want to lock and confirm debit note{" "}
                                <span className="font-semibold text-slate-200">{selectedDebitNote?.number}</span>?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-medium text-sm hover:bg-slate-700 hover:text-white transition-all duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isConfirming}
                                onClick={confirmDebitNote}
                                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-500 disabled:opacity-40 transition-all duration-150"
                            >
                                {isConfirming ? "Processing..." : "Confirm Note"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GENERATE PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-white">Generate Payment Ledger</h2>
                            <p className="mt-2 text-sm text-slate-400">
                                Create an operational processing document for note{" "}
                                <span className="font-semibold text-slate-200">{selectedDebitNote?.number}</span>?
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-medium text-sm hover:bg-slate-700 hover:text-white transition-all duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={creatingPayment}
                                onClick={generatePayment}
                                className="flex-1 py-2.5 rounded-xl bg-cyan-600 text-white font-medium text-sm hover:bg-cyan-500 disabled:opacity-40 transition-all duration-150"
                            >
                                {creatingPayment ? "Generating..." : "Generate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PAYMENT LOOKUP MODAL */}
            {showPaymentLookup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
                            <h2 className="text-lg font-bold text-white">Linked Vendor Payments</h2>
                            <button
                                onClick={() => setShowPaymentLookup(false)}
                                className="text-2xl text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-slate-900">
                            {loadingPayments ? (
                                <div className="py-12 text-center text-sm text-slate-500 font-medium">Fetching linked entries...</div>
                            ) : (
                                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/40">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                                                <th className="p-3 text-left">Payment No</th>
                                                <th className="p-3 text-left">Vendor</th>
                                                <th className="p-3 text-left">Cash/Bank</th>
                                                <th className="p-3 text-left">Date</th>
                                                <th className="p-3 text-right">Amount</th>
                                                <th className="p-3 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-300 divide-y divide-slate-800/40">
                                            {payments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="p-3 font-semibold text-indigo-400">{payment.number}</td>
                                                    <td className="p-3 text-slate-200">{payment.vendorName}</td>
                                                    <td className="p-3 text-slate-400">{payment.cashAndBankName}</td>
                                                    <td className="p-3 text-slate-400">
                                                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "—"}
                                                    </td>
                                                    <td className="p-3 text-right font-mono font-medium text-white">
                                                        <span className="text-xs text-slate-500 mr-1">{payment.currencyName}</span>
                                                        {Number(payment.amount).toLocaleString()}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <span className="px-2.5 py-0.5 rounded-full inline-flex items-center bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-xs font-semibold">
                                                            <span className="w-1 h-1 mr-1.5 rounded-full bg-emerald-400"></span>
                                                            {payment.statusString}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {payments.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                                                        No payments associated with this debit note.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end px-6 py-4 border-t border-slate-800 bg-slate-950/40">
                            <button
                                onClick={() => setShowPaymentLookup(false)}
                                className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 text-sm font-medium rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-150"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}