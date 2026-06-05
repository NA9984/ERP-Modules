"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";

export default function PurchaseReceiptDetailPage() {
  const params = useParams();
  const router = useRouter();

  const receiptId = params.id as string;

  const [header, setHeader] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showConfirmModal, setShowConfirmModal] =
    useState(false);

  const [showReturnModal, setShowReturnModal] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const headerResponse = await fetch(
        `${API_BASE_URL}/purchase-receipt/${receiptId}`
      );

      const headerData =
        await headerResponse.json();

      setHeader(headerData);

      const detailResponse = await fetch(
        `${API_BASE_URL}/purchase-receipt-detail/by-purchase-receipt/${receiptId}`
      );

      const detailData =
        await detailResponse.json();

      setItems(detailData.items || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function confirmReceipt() {
    try {

      await fetch(
        `${API_BASE_URL}/purchase-receipt/confirm/${receiptId}`,
        {
          method: "POST",
        }
      );

      setShowConfirmModal(false);

      await loadData();

    } catch (err) {
      console.error(err);
    }
  }

  async function returnReceipt() {
    try {

      await fetch(
        `${API_BASE_URL}/purchase-receipt/return/${receiptId}`,
        {
          method: "POST",
        }
      );

      setShowReturnModal(false);

      await loadData();

    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="p-10 text-center">
          Loading...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <div className="min-h-screen bg-slate-950 p-6">

        {/* Top */}

        <div className="flex justify-between items-center mb-6">

          <div>

            <h1 className="text-4xl font-bold text-white">
              Purchase Receipt
            </h1>

            <p className="text-slate-400 mt-2">
              Receipt Details
            </p>

          </div>

          <button
            onClick={() => router.back()}
            className="
            px-5 py-3
            bg-slate-800
            text-white
            rounded-xl
            hover:bg-slate-700
          "
          >
            Back
          </button>

        </div>

        {/* Header Card */}

        <div
          className="
          bg-slate-900
          border border-slate-800
          rounded-3xl
          p-6
          mb-6
        "
        >

          <div className="grid md:grid-cols-3 gap-6">

            <div>

              <div className="text-slate-400 text-sm">
                Receipt Number
              </div>

              <div className="text-white font-bold text-lg">
                {header.number}
              </div>

            </div>

            <div>

              <div className="text-slate-400 text-sm">
                Receipt Date
              </div>

              <div className="text-white">
                {new Date(
                  header.receiptDate
                ).toLocaleDateString()}
              </div>

            </div>

            <div>

              <div className="text-slate-400 text-sm">
                Status
              </div>

              <span
                className={
                  header.status === 1
                    ? "px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300"
                    : "px-3 py-1 rounded-full bg-green-500/20 text-green-300"
                }
              >
                {header.statusString}
              </span>

            </div>

            <div>

              <div className="text-slate-400 text-sm">
                Vendor
              </div>

              <div className="text-white">
                {header.vendorName}
              </div>

            </div>

            <div>

              <div className="text-slate-400 text-sm">
                Purchase Order
              </div>

              <div className="text-cyan-400">
                {header.purchaseOrderNumber}
              </div>

            </div>

          </div>

        </div>

        {/* Actions */}

    

        {/* Items */}

        <div
          className="
          bg-slate-900
          border border-slate-800
          rounded-3xl
          overflow-hidden
        "
        >

          <table className="w-full">

            <thead>

              <tr className="bg-slate-800">

                <th className="p-4 text-left text-slate-300">
                  Product
                </th>

                <th className="p-4 text-left text-slate-300">
                  UOM
                </th>

                <th className="p-4 text-right text-slate-300">
                  Quantity
                </th>

                <th className="p-4 text-center text-slate-300">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item) => (

                <tr
                  key={item.id}
                  className="
                  border-t
                  border-slate-800
                  hover:bg-slate-800/50
                "
                >

                  <td className="p-4 text-white">
                    {item.productName}
                  </td>

                  <td className="p-4 text-slate-300">
                    {item.uomName}
                  </td>

                  <td className="p-4 text-right text-slate-300">
                    {item.quantity}
                  </td>

                  <td className="p-4 text-center">

                    <span
                      className="
                      px-3 py-1
                      rounded-full
                      bg-blue-500/20
                      text-blue-300
                    "
                    >
                      {item.statusString}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

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
              Confirm this receipt?
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowConfirmModal(false)
                }
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl"
              >
                No
              </button>

              <button
                onClick={confirmReceipt}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl"
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
              Return this receipt?
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowReturnModal(false)
                }
                className="flex-1 py-3 bg-slate-700 text-white rounded-xl"
              >
                No
              </button>

              <button
                onClick={returnReceipt}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl"
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