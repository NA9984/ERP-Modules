"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import PurchaseOrderItemModal from "@/app/components/purchase-orders/PurchaseOrderItemModal";
import { API_BASE_URL } from "@/app/services/api";

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

interface PurchaseOrderDetail {
  id: string;
  productId: string;
  productName: string;
  uomName: string;
  price: number;
  quantity: number;
  subTotal: number;
  discAmt: number;
  beforeTax: number;
  taxAmount: number;
  total: number;
}

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [details, setDetails] = useState<PurchaseOrderDetail[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const purchaseOrderId = params.id as string;

  useEffect(() => {
    if (purchaseOrderId) {
      loadData();
    }
  }, [purchaseOrderId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [headerResponse, detailResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/purchase-order/${purchaseOrderId}`),
        fetch(`${API_BASE_URL}/purchase-order-detail/by-purchase-order/${purchaseOrderId}`),
      ]);

      const headerData = await headerResponse.json();
      const detailData = await detailResponse.json();

      setPurchaseOrder(headerData);
      setDetails(detailData.items || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load purchase order");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/purchase-order-detail/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  const totalItems = details.length;
  const totalQty = details.reduce((sum, x) => sum + x.quantity, 0);
  const totalDiscount = details.reduce((sum, x) => sum + x.discAmt, 0);
  const grandTotal = details.reduce((sum, x) => sum + x.total, 0);
  const subTotal = details.reduce((sum, x) => sum + x.subTotal, 0);
  const beforeTax = details.reduce((sum, x) => sum + x.beforeTax, 0);
  const taxAmount = details.reduce((sum, x) => sum + x.taxAmount, 0);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-16 flex flex-col items-center justify-center space-y-3 min-h-[60vh]">
          <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-500">Loading purchase order details...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen erp-page/50 p-2 sm:p-4 space-y-6">

        {/* TOP BAR / NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center p-2 text-slate-600 erp-card border border-slate-200 rounded-lg hover:erp-page transition-colors shadow-sm"
              title="Go Back"
            >
              ← Back
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {purchaseOrder?.number || "PO Details"}
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ring-1 ${purchaseOrder?.status === 1
                  ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                  : "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                  }`}>
                  {purchaseOrder?.statusString}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Vendor: <span className="font-medium text-slate-700">{purchaseOrder?.vendorName || "—"}</span> &nbsp;•&nbsp;
                Buyer: <span className="font-medium text-slate-700">{purchaseOrder?.buyerName || "—"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={loadData}
              className="px-4 py-2 text-sm font-medium text-slate-700 erp-card border border-slate-200 rounded-lg shadow-sm hover:erp-page transition-all"
            >
              Refresh
            </button>
            <button
              disabled={
                purchaseOrder?.status !== 1
              }
              onClick={() => {

                setEditingItemId(null);
                setModalOpen(true);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* METRICS & SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="erp-card rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Line Items</span>
            <span className="block text-2xl font-bold text-slate-800 mt-1">{totalItems}</span>
          </div>

          <div className="erp-card rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Quantity</span>
            <span className="block text-2xl font-bold text-slate-800 mt-1">
              {totalQty} <span className="text-xs text-slate-400 font-normal">{details[0]?.uomName || ""}</span>
            </span>
          </div>

          <div className="erp-card rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Discount</span>
            <span className="block text-2xl font-bold text-slate-800 mt-1">
              ₹{totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="erp-card rounded-xl border border-blue-200 bg-blue-50/20 p-4 shadow-sm">
            <span className="block text-xs font-semibold text-blue-500 uppercase tracking-wider">Grand Total</span>
            <span className="block text-2xl font-bold text-blue-600 mt-1">
              ₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="erp-card border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 erp-page border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Order Specifications</h2>
            <span className="text-xs text-slate-400 font-medium">Date: {purchaseOrder?.orderDate ? new Date(purchaseOrder.orderDate).toLocaleDateString() : "—"}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="erp-page/50 border-b border-slate-200">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Unit Price</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Qty</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">UOM</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Discount</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Tax Amount</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Net Total</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {details.map((item) => (
                  <tr key={item.id} className="hover:erp-page/80 transition-colors">
                    <td className="p-4 font-medium text-slate-900 max-w-xs truncate">
                      {item.productName}
                    </td>
                    <td className="p-4 text-right">
                      ₹{item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-medium text-slate-900">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-center text-xs text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">{item.uomName || "PCS"}</span>
                    </td>
                    <td className="p-4 text-right text-amber-600 font-medium">
                      {item.discAmt > 0 ? `-₹${item.discAmt.toLocaleString()}` : "—"}
                    </td>
                    <td className="p-4 text-right text-slate-500">
                      ₹{item.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-semibold text-slate-900">
                      ₹{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          disabled={
                            purchaseOrder?.status !== 1
                          }
                          onClick={() => {
                            setEditingItemId(item.id);
                            setModalOpen(true);
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded"
                        >
                          Edit
                        </button>
                        <button
                          disabled={
                            purchaseOrder?.status !== 1
                          }
                          onClick={() => deleteItem(item.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors px-2 py-1 bg-red-50 hover:bg-red-100 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {details.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                      No items attached to this purchase order yet. Click "+ Add Item" to add records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FINANCIAL SUMMARY PANEL */}
        <div className="flex justify-end">
          <div className="w-full max-w-md erp-card border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 text-sm">
            <div className="p-4 erp-page/50">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Financial Breakdown</h3>
            </div>

            <div className="p-4 space-y-3 text-slate-600">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span className="font-medium text-slate-900">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount Allowed</span>
                <span className="font-medium text-red-600">-₹{totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span>Taxable Amount (Before Tax)</span>
                <span className="font-medium text-slate-900">₹{beforeTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vat / Tax Collection</span>
                <span className="font-medium text-slate-900">₹{taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/30 flex justify-between items-center text-base font-bold text-slate-900">
              <span className="text-blue-700">Grand Total ({purchaseOrder?.currencyName || "INR"})</span>
              <span className="text-xl text-blue-700">₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

      </div>

      <PurchaseOrderItemModal
        isOpen={modalOpen}
        purchaseOrderId={purchaseOrderId}
        detailId={editingItemId}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          loadData();
        }}
      />
    </AppLayout>
  );
}