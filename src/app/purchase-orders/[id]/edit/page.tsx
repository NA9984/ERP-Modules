"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";
interface LookupItem {
  id: string;
  name: string;
}

export default function EditPurchaseOrderPage() {
  const params = useParams();
  const router = useRouter();

  const purchaseOrderId =
    params.id as string;

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [vendors, setVendors] =
    useState<LookupItem[]>([]);

  const [buyers, setBuyers] =
    useState<LookupItem[]>([]);

  const [number, setNumber] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [orderDate, setOrderDate] =
    useState("");

  const [vendorId, setVendorId] =
    useState("");

  const [buyerId, setBuyerId] =
    useState("");

  const [status, setStatus] =
    useState("");

  useEffect(() => {
    if (purchaseOrderId) {
      loadData();
    }
  }, [purchaseOrderId]);

  const loadData = async () => {
    try {
      setPageLoading(true);

      const [
        poResponse,
        vendorResponse,
        buyerResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE_URL}/purchase-order/${purchaseOrderId}`
        ),
        fetch(
          `${API_BASE_URL}/purchase-order/vendor-lookup`
        ),
        fetch(
          `${API_BASE_URL}/purchase-order/buyer-lookup`
        ),
      ]);

      const poData =
        await poResponse.json();

      const vendorData =
        await vendorResponse.json();

      const buyerData =
        await buyerResponse.json();

      setVendors(
        vendorData.items || []
      );

      setBuyers(
        buyerData.items || []
      );

      setNumber(
        poData.number || ""
      );

      setDescription(
        poData.description || ""
      );

      setOrderDate(
        poData.orderDate
          ?.split("T")[0] || ""
      );

      setVendorId(
        poData.vendorId || ""
      );

      setBuyerId(
        poData.buyerId || ""
      );

      setStatus(
        poData.statusString || ""
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load purchase order"
      );
    } finally {
      setPageLoading(false);
    }
  };

  const updatePurchaseOrder =
    async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            `${API_BASE_URL}/purchase-order/${purchaseOrderId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                number,
                description,
                orderDate:
                  new Date(
                    orderDate
                  ).toISOString(),
                vendorId,
                buyerId,
              }),
            }
          );

        if (!response.ok) {
          throw new Error();
        }

        alert(
          "Purchase Order Updated"
        );

        router.push(
          `/purchase-orders/${purchaseOrderId}`
        );
      } catch (error) {
        console.error(error);

        alert(
          "Update failed"
        );
      } finally {
        setLoading(false);
      }
    };

  if (pageLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
          Loading...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-100 p-6">

        <div className="max-w-5xl mx-auto space-y-6">

          {/* HEADER */}

          <div className="erp-card rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="flex justify-between items-center">

              <div>

                <h1 className="text-3xl font-bold text-slate-900">
                  Edit Purchase Order
                </h1>

                <p className="text-slate-500 mt-2">
                  Update purchase order information
                </p>

              </div>

              <span className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-medium">
                {status}
              </span>

            </div>

          </div>

          {/* FORM */}

          <div className="erp-card rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Purchase Order Number
                </label>

                <input
                  value={number}
                  readOnly
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-100 text-slate-900"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Order Date
                </label>

                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) =>
                    setOrderDate(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vendor
                </label>

                <select
                  value={vendorId}
                  onChange={(e) =>
                    setVendorId(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900"
                >
                  <option value="">
                    Select Vendor
                  </option>

                  {vendors.map(
                    (vendor) => (
                      <option
                        key={
                          vendor.id
                        }
                        value={
                          vendor.id
                        }
                      >
                        {
                          vendor.name
                        }
                      </option>
                    )
                  )}
                </select>

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Buyer
                </label>

                <select
                  value={buyerId}
                  onChange={(e) =>
                    setBuyerId(
                      e.target.value
                    )
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900"
                >
                  <option value="">
                    Select Buyer
                  </option>

                  {buyers.map(
                    (buyer) => (
                      <option
                        key={
                          buyer.id
                        }
                        value={
                          buyer.id
                        }
                      >
                        {
                          buyer.name
                        }
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>

            <div className="mt-5">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  router.back()
                }
                className="px-5 py-3 border border-slate-300 rounded-xl text-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={
                  updatePurchaseOrder
                }
                disabled={loading}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : "Update Purchase Order"}
              </button>

            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}