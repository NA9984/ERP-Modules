"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "../components/layout/AppLayout";
import { API_BASE_URL } from "../services/api";

interface VendorBill {
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

export default function VendorBillsPage() {
    const router = useRouter();

    const [bills, setBills] =
        useState<VendorBill[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [selectedBill, setSelectedBill] =
        useState<VendorBill | null>(null);

    const [showConfirmModal, setShowConfirmModal] =
        useState(false);

    const [showDebitNoteModal, setShowDebitNoteModal] =
        useState(false);

    const [showPaymentModal, setShowPaymentModal] =
        useState(false);

    const [showDebitLookup, setShowDebitLookup] =
        useState(false);

    const [showPaymentLookup, setShowPaymentLookup] =
        useState(false);

    const [creatingDebitNote, setCreatingDebitNote] =
        useState(false);

    const [creatingPayment, setCreatingPayment] =
        useState(false);

    const [loadingDebitNotes, setLoadingDebitNotes] =
        useState(false);

    const [loadingPayments, setLoadingPayments] =
        useState(false);

    const [debitNotes, setDebitNotes] =
        useState<any[]>([]);

    const [payments, setPayments] =
        useState<any[]>([]);

    async function loadBills() {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/vendor-bill`
            );

            if (!response.ok) {
                throw new Error();
            }

            const data =
                await response.json();

            setBills(data);
        } catch (err) {
            console.error(err);
            alert("Failed to load vendor bills");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBills();
    }, []);

    const filteredBills =
        useMemo(() => {
            return bills.filter(
                (x) =>
                    x.number
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    x.vendorName
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    x.sourceDocument
                        ?.toLowerCase()
                        .includes(search.toLowerCase())
            );
        }, [bills, search]);

    async function confirmBill() {
        if (!selectedBill) return;

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/vendor-bill/confirm/${selectedBill.id}`,
                    {
                        method: "POST",
                    }
                );

            if (!response.ok)
                throw new Error();

            setShowConfirmModal(false);

            await loadBills();
        } catch (err) {
            console.error(err);
        }
    }

    async function generateDebitNote() {
        if (!selectedBill) return;

        try {
            setCreatingDebitNote(true);

            const response =
                await fetch(
                    `${API_BASE_URL}/vendor-bill/generate-debit-note/${selectedBill.id}`,
                    {
                        method: "POST",
                    }
                );

            if (!response.ok)
                throw new Error();

            setShowDebitNoteModal(false);

            await loadBills();
        } catch (err) {
            console.error(err);
        } finally {
            setCreatingDebitNote(false);
        }
    }

    async function generatePayment() {
        if (!selectedBill) return;

        try {
            setCreatingPayment(true);

            const response =
                await fetch(
                    `${API_BASE_URL}/vendor-bill/generate-payment/${selectedBill.id}`,
                    {
                        method: "POST",
                    }
                );

            if (!response.ok)
                throw new Error();

            setShowPaymentModal(false);

            await loadBills();
        } catch (err) {
            console.error(err);
        } finally {
            setCreatingPayment(false);
        }
    }

    async function loadDebitNotes() {
        if (!selectedBill) return;

        try {
            setLoadingDebitNotes(true);

            const response =
                await fetch(
                    `${API_BASE_URL}/vendor-debit-note/with-total-by-bill/${selectedBill.id}`
                );

            const data =
                await response.json();

            setDebitNotes(data);

            setShowDebitLookup(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDebitNotes(false);
        }
    }

    async function loadPayments() {
        if (!selectedBill) return;

        try {
            setLoadingPayments(true);

            const response =
                await fetch(
                    `${API_BASE_URL}/vendor-payment/by-bill/${selectedBill.id}`
                );

            const data =
                await response.json();

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

            <div className="min-h-screen erp-page/50 p-6 space-y-6">

                {/* HEADER */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Vendor Bills
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Manage vendor invoices,
                            payments and debit notes
                        </p>

                    </div>

                    <button
                        onClick={loadBills}
                        className="
            px-4 py-2
            bg-blue-600
            text-white
            rounded-lg
            hover:bg-blue-700
          "
                    >
                        Refresh List
                    </button>

                </div>

                {/* SEARCH + TOOLBAR */}

                <div className="erp-card border border-slate-200 rounded-xl p-4 shadow-sm">

                    <div className="flex flex-col xl:flex-row gap-3 justify-between">

                        <input
                            type="text"
                            placeholder="Search Bill..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="
              xl:w-96
              border
              border-slate-200
              rounded-lg
              px-4 py-2
            "
                        />

                        <div className="flex flex-wrap gap-2">

                            <button
                                disabled={!selectedBill}
                                onClick={() =>
                                    router.push(
                                        `/vendor-bills/${selectedBill?.id}`
                                    )
                                }
                                className="
                px-3 py-2
                text-xs
                rounded-lg
                border
                border-slate-200
              "
                            >
                                Details
                            </button>

                            <button
                                disabled={
                                    selectedBill?.status !== 1
                                }
                                onClick={() =>
                                    setShowConfirmModal(true)
                                }
                                className="
                px-3 py-2
                text-xs
                bg-emerald-600
                text-white
                rounded-lg
                disabled:opacity-30
              "
                            >
                                Confirm Bill
                            </button>

                            <button
                                disabled={
                                    selectedBill?.status !== 2
                                }
                                onClick={() =>
                                    setShowDebitNoteModal(true)
                                }
                                className="
                px-3 py-2
                text-xs
                bg-violet-600
                text-white
                rounded-lg
                disabled:opacity-30
              "
                            >
                                Generate Debit Note
                            </button>

                            <button
                                disabled={
                                    selectedBill?.status !== 2
                                }
                                onClick={() =>
                                    setShowPaymentModal(true)
                                }
                                className="
                px-3 py-2
                text-xs
                bg-cyan-600
                text-white
                rounded-lg
                disabled:opacity-30
              "
                            >
                                Generate Payment
                            </button>

                            <button
                                disabled={
                                    selectedBill?.status !== 2
                                }
                                onClick={loadDebitNotes}
                                className="
                px-3 py-2
                text-xs
                bg-orange-600
                text-white
                rounded-lg
                disabled:opacity-30
              "
                            >
                                Debit Note Lookup
                            </button>

                            <button
                                disabled={
                                    selectedBill?.status !== 2
                                }
                                onClick={loadPayments}
                                className="
                px-3 py-2
                text-xs
                bg-indigo-600
                text-white
                rounded-lg
                disabled:opacity-30
              "
                            >
                                Payment Lookup
                            </button>

                        </div>

                    </div>

                </div>

                {/* TABLE */}

                <div className="erp-card border border-slate-200 rounded-xl shadow-sm overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="erp-page border-b">

                                    <th className="w-12 p-4"></th>

                                    <th className="p-4 text-left">
                                        Bill No
                                    </th>

                                    <th className="p-4 text-left">
                                        Source Document
                                    </th>

                                    <th className="p-4 text-left">
                                        Module
                                    </th>

                                    <th className="p-4 text-left">
                                        Vendor
                                    </th>

                                    <th className="p-4 text-left">
                                        Status
                                    </th>

                                    <th className="p-4 text-left">
                                        Bill Date
                                    </th>

                                    <th className="p-4 text-left">
                                        Due Date
                                    </th>

                                    <th className="p-4 text-right">
                                        Total
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredBills.map(
                                    (bill) => {

                                        const isSelected =
                                            selectedBill?.id ===
                                            bill.id;

                                        return (

                                            <tr
                                                key={bill.id}
                                                onClick={() =>
                                                    setSelectedBill(bill)
                                                }
                                                className={`
                          border-b
                          cursor-pointer
                          hover:erp-page

                          ${isSelected
                                                        ? "bg-blue-50"
                                                        : ""
                                                    }
                        `}
                                            >

                                                <td className="p-4">

                                                    <input
                                                        type="radio"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            setSelectedBill(
                                                                bill
                                                            )
                                                        }
                                                    />

                                                </td>

                                                <td
                                                    className="
                          p-4
                          text-blue-600
                          font-semibold
                          hover:underline
                        "
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        router.push(
                                                            `/vendor-bills/${bill.id}`
                                                        );
                                                    }}
                                                >
                                                    {bill.number}
                                                </td>
                                                <td className="p-4">
                                                    {bill.sourceDocument}
                                                </td>

                                                <td className="p-4">
                                                    {bill.sourceDocumentModuleString}
                                                </td>

                                                <td className="p-4">
                                                    {bill.vendorName}
                                                </td>

                                                <td className="p-4">

                                                    <span
                                                        className={`
      px-3 py-1
      rounded-full
      text-xs
      font-semibold

      ${bill.status === 1
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-emerald-100 text-emerald-700"
                                                            }
    `}
                                                    >
                                                        {bill.statusString}
                                                    </span>

                                                </td>

                                                <td className="p-4">
                                                    {new Date(
                                                        bill.billDate
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td className="p-4">
                                                    {new Date(
                                                        bill.billDueDate
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td className="p-4 text-right font-semibold text-emerald-600">
                                                    {bill.currencyName}
                                                    {" "}
                                                    {Number(
                                                        bill.total
                                                    ).toLocaleString()}
                                                </td>

                                            </tr>

                                        );
                                    })}

                                {filteredBills.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={9}
                                            className="
      p-12
      text-center
      text-slate-500
    "
                                        >
                                            No vendor bills found
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* Footer */}

                    <div className="erp-page border-t p-4 flex justify-between text-sm text-slate-500">

                        <div>

                            Showing {filteredBills.length} of {bills.length} bills

                        </div>

                        <div>

                            {selectedBill
                                ? `Selected: ${selectedBill.number}`
                                : "No bill selected"}

                        </div>

                    </div>

                </div>

            </div>

            {/* ===========================
   CONFIRM BILL MODAL
=========================== */}

            {
                showConfirmModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="w-full max-w-md erp-card rounded-3xl shadow-2xl overflow-hidden">

                            <div className="p-6">

                                <h2 className="text-2xl font-bold text-center text-slate-800">

                                    Confirm Vendor Bill

                                </h2>

                                <p className="mt-4 text-center text-slate-500">

                                    Confirm

                                    <span className="font-semibold text-slate-700">
                                        {" "}
                                        {selectedBill?.number}
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
        "
                                >
                                    No
                                </button>

                                <button
                                    onClick={confirmBill}
                                    className="
          flex-1
          py-3
          rounded-xl
          bg-emerald-600
          text-white
        "
                                >
                                    Yes
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            {/* ===========================
   GENERATE DEBIT NOTE MODAL
=========================== */}

            {
                showDebitNoteModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="w-full max-w-md erp-card rounded-3xl shadow-2xl">

                            <div className="p-6">

                                <h2 className="text-2xl font-bold text-center">

                                    Generate Debit Note

                                </h2>

                                <p className="mt-4 text-center text-slate-500">

                                    Generate Debit Note from

                                    <span className="font-semibold">
                                        {" "}
                                        {selectedBill?.number}
                                    </span>

                                    ?

                                </p>

                            </div>

                            <div className="px-6 pb-6 flex gap-3">

                                <button
                                    onClick={() =>
                                        setShowDebitNoteModal(false)
                                    }
                                    className="
          flex-1
          py-3
          rounded-xl
          bg-slate-100
        "
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={creatingDebitNote}
                                    onClick={generateDebitNote}
                                    className="
          flex-1
          py-3
          rounded-xl
          bg-violet-600
          text-white
        "
                                >
                                    {
                                        creatingDebitNote
                                            ? "Creating..."
                                            : "Generate"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            {/* ===========================
   GENERATE PAYMENT MODAL
=========================== */}

            {
                showPaymentModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="w-full max-w-md erp-card rounded-3xl shadow-2xl">

                            <div className="p-6">

                                <h2 className="text-2xl font-bold text-center">

                                    Generate Payment

                                </h2>

                                <p className="mt-4 text-center text-slate-500">

                                    Generate Payment from

                                    <span className="font-semibold">
                                        {" "}
                                        {selectedBill?.number}
                                    </span>

                                    ?

                                </p>

                            </div>

                            <div className="px-6 pb-6 flex gap-3">

                                <button
                                    onClick={() =>
                                        setShowPaymentModal(false)
                                    }
                                    className="
          flex-1
          py-3
          rounded-xl
          bg-slate-100
        "
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={creatingPayment}
                                    onClick={generatePayment}
                                    className="
          flex-1
          py-3
          rounded-xl
          bg-cyan-600
          text-white
        "
                                >
                                    {
                                        creatingPayment
                                            ? "Creating..."
                                            : "Generate"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            {
                showDebitLookup && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="erp-card rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden">

                            <div className="flex items-center justify-between px-8 py-6 border-b">

                                <h2 className="text-3xl font-bold text-slate-800">
                                    Debit Notes
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowDebitLookup(false)
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

                            <div className="p-6">

                                {loadingDebitNotes ? (

                                    <div className="py-16 text-center">
                                        Loading Debit Notes...
                                    </div>

                                ) : (

                                    <div className="overflow-x-auto">

                                        <table className="w-full">

                                            <thead>

                                                <tr className="erp-page border-b">

                                                    <th className="p-4 text-left">
                                                        Number
                                                    </th>

                                                    <th className="p-4 text-left">
                                                        Vendor Bill
                                                    </th>

                                                    <th className="p-4 text-left">
                                                        Vendor
                                                    </th>

                                                    <th className="p-4 text-left">
                                                        Date
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

                                                {debitNotes.map((note) => (

                                                    <tr
                                                        key={note.id}
                                                        className="
                    border-b
                    hover:erp-page
                  "
                                                    >

                                                        <td className="p-4 font-medium text-blue-600">
                                                            {note.number}
                                                        </td>

                                                        <td className="p-4">
                                                            {note.vendorBillNumber}
                                                        </td>

                                                        <td className="p-4">
                                                            {note.vendorName}
                                                        </td>

                                                        <td className="p-4">
                                                            {new Date(
                                                                note.debitNoteDate
                                                            ).toLocaleDateString()}
                                                        </td>

                                                        <td className="p-4 text-right font-semibold text-emerald-600">
                                                            {note.currencyName}
                                                            {" "}
                                                            {Number(
                                                                note.total
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td className="p-4 text-center">

                                                            <span
                                                                className="
                        px-3 py-1
                        rounded-full
                        bg-blue-100
                        text-blue-700
                        text-xs
                        font-semibold
                      "
                                                            >
                                                                {note.statusString}
                                                            </span>

                                                        </td>

                                                    </tr>

                                                ))}

                                                {debitNotes.length === 0 && (

                                                    <tr>

                                                        <td
                                                            colSpan={6}
                                                            className="
                      p-10
                      text-center
                      text-slate-500
                    "
                                                        >
                                                            No Debit Notes Found
                                                        </td>

                                                    </tr>

                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>

                            <div className="flex justify-end p-6 border-t erp-page">

                                <button
                                    onClick={() =>
                                        setShowDebitLookup(false)
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
                showPaymentLookup && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                        <div className="erp-card rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden">

                            <div className="flex items-center justify-between px-8 py-6 border-b">

                                <h2 className="text-3xl font-bold text-slate-800">
                                    Vendor Payments
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowPaymentLookup(false)
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

                            <div className="p-6">

                                {loadingPayments ? (

                                    <div className="py-16 text-center">
                                        Loading Payments...
                                    </div>

                                ) : (

                                    <div className="overflow-x-auto">

                                        <table className="w-full">

                                            <thead>

                                                <tr className="erp-page border-b">

                                                    <th className="p-4 text-left">
                                                        Payment No
                                                    </th>

                                                    <th className="p-4 text-left">
                                                        Vendor
                                                    </th>

                                                    <th className="p-4 text-left">
                                                        Cash/Bank
                                                    </th>

                                                    <th className="p-4 text-left">
                                                        Date
                                                    </th>

                                                    <th className="p-4 text-right">
                                                        Amount
                                                    </th>

                                                    <th className="p-4 text-center">
                                                        Status
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {payments.map((payment) => (

                                                    <tr
                                                        key={payment.id}
                                                        className="
                    border-b
                    hover:erp-page
                  "
                                                    >

                                                        <td className="p-4 font-medium text-blue-600">
                                                            {payment.number}
                                                        </td>

                                                        <td className="p-4">
                                                            {payment.vendorName}
                                                        </td>

                                                        <td className="p-4">
                                                            {payment.cashAndBankName}
                                                        </td>

                                                        <td className="p-4">
                                                            {new Date(
                                                                payment.paymentDate
                                                            ).toLocaleDateString()}
                                                        </td>

                                                        <td className="p-4 text-right font-semibold text-emerald-600">
                                                            {payment.currencyName}
                                                            {" "}
                                                            {Number(
                                                                payment.amount
                                                            ).toLocaleString()}
                                                        </td>

                                                        <td className="p-4 text-center">

                                                            <span
                                                                className="
                        px-3 py-1
                        rounded-full
                        bg-emerald-100
                        text-emerald-700
                        text-xs
                        font-semibold
                      "
                                                            >
                                                                {payment.statusString}
                                                            </span>

                                                        </td>

                                                    </tr>

                                                ))}

                                                {payments.length === 0 && (

                                                    <tr>

                                                        <td
                                                            colSpan={6}
                                                            className="
                      p-10
                      text-center
                      text-slate-500
                    "
                                                        >
                                                            No Payments Found
                                                        </td>

                                                    </tr>

                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>

                            <div className="flex justify-end p-6 border-t erp-page">

                                <button
                                    onClick={() =>
                                        setShowPaymentLookup(false)
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
        </AppLayout>
    )
}
