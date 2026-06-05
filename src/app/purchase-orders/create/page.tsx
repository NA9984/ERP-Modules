"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";

interface LookupItem {
  id: string;
  name: string;
}

export default function CreatePurchaseOrderPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState("");

  const [vendors, setVendors] = useState<LookupItem[]>([]);
  const [buyers, setBuyers] = useState<LookupItem[]>([]);

  const [vendorId, setVendorId] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [description, setDescription] = useState("");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    loadLookups();
  }, []);

  const loadLookups = async () => {
    try {
      const numberResponse = await fetch(
        `${API_BASE_URL}/number-sequence/next-number?module=3`
      );
      const vendorResponse = await fetch(
        `${API_BASE_URL}/purchase-order/vendor-lookup`
      );
      const buyerResponse = await fetch(
        `${API_BASE_URL}/purchase-order/buyer-lookup`
      );

      if (!vendorResponse.ok) throw new Error("Failed to load vendors");
      if (!buyerResponse.ok) throw new Error("Failed to load buyers");

      const numberData = await numberResponse.text();
      const vendorData = await vendorResponse.json();
      const buyerData = await buyerResponse.json();

      setNumber(numberData);
      setVendors(vendorData.items || []);
      setBuyers(buyerData.items || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load lookup data");
    }
  };

  const createPurchaseOrder = async (openDetail: boolean) => {
    if (!vendorId) {
      alert("Please select a vendor");
      return;
    }
    if (!buyerId) {
      alert("Please select a buyer");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/purchase-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number,
          description,
          orderDate: new Date(orderDate).toISOString(),
          vendorId,
          buyerId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create purchase order");

      const createdOrder = await response.json();

      if (openDetail) {
        router.push(`/purchase-orders/${createdOrder.id}`);
      } else {
        router.push("/purchase-orders");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create purchase order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen erp-page/50 p-2 sm:p-4 space-y-6">
        
        {/* HEADER SECTION */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Purchase Order
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Initialize a new commercial vendor purchase profile sequence.
          </p>
        </div>

        {/* PRIMARY FORM BLOCK */}
        <div className="erp-card rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 erp-page border-b border-slate-200">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Document Core Metadata
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* PO NUMBER */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  PO Sequence Identifier
                </label>
                <input
                  value={number || "Fetching auto-sequence..."}
                  readOnly
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-100 text-slate-600 font-mono text-sm cursor-not-allowed select-none"
                />
              </div>

              {/* ORDER DATE */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Order Registration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* VENDOR */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Assigned Vendor Partner <span className="text-red-500">*</span>
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 erp-card transition-all"
                >
                  <option value="">Select Vendor Partner</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUYER */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Procurement Agent / Buyer <span className="text-red-500">*</span>
                </label>
                <select
                  value={buyerId}
                  onChange={(e) => setBuyerId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 erp-card transition-all"
                >
                  <option value="">Select Accounts Officer</option>
                  {buyers.map((buyer) => (
                    <option key={buyer.id} value={buyer.id}>
                      {buyer.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Internal Remarks & Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                placeholder="Provide internal terms, delivery remarks, or specific workflow logs here..."
              />
            </div>
          </div>

          {/* ACTION BUTTONS FOOTER */}
          <div className="erp-page border-t border-slate-200 p-4 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => router.push("/purchase-orders")}
              className="px-4 py-2 text-sm font-medium text-slate-700 erp-card border border-slate-200 rounded-lg shadow-sm hover:erp-page transition-all"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={() => createPurchaseOrder(false)}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Processing..." : "Save Draft"}
            </button>

            <button
              disabled={loading}
              onClick={() => createPurchaseOrder(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Processing..." : "Save & Add Line Items"}
            </button>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}