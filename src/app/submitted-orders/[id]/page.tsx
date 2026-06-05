"use client";

import {
  useEffect,
  useState,
} from "react";

import { useParams } from "next/navigation";

import AppLayout from "@/app/components/layout/AppLayout";

import { API_BASE_URL } from "@/app/services/api";

export default function SalesOrderDetailPage() {
  const params = useParams();

  const id = params.id;

  const [loading, setLoading] =
    useState(true);

  const [items, setItems] =
    useState<any[]>([]);

  useEffect(() => {
    loadDetails();
  }, []);

  async function loadDetails() {
    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_BASE_URL}/sales-order-detail/by-sales-order/${id}`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to load details"
        );
      }

      const data =
        await response.json();

      setItems(
        data.items || []
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load sales order details"
      );
    } finally {
      setLoading(false);
    }
  }

  const order =
    items.length > 0
      ? items[0]
      : null;

  const total =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.total || 0
        ),
      0
    );

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* HEADER */}

        <div className="erp-card rounded-3xl border erp-border p-6 shadow-sm">
          {loading ? (
            <div className="space-y-4">
              <div className="h-8 w-72 bg-gray-100 rounded-xl animate-pulse"></div>

              <div className="h-5 w-40 bg-gray-100 rounded-xl animate-pulse"></div>

              <div className="h-5 w-56 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>
          ) : order ? (
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

                  <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                    Sales Order
                  </span>
                </div>

                <h1 className="text-3xl font-black text-gray-900 mt-3">
                  {
                    order.salesOrderNumber
                  }
                </h1>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-sm font-bold">
                    Customer:{" "}
                    {
                      order.customerName
                    }
                  </div>

                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl text-sm font-bold">
                    {
                      order.statusString
                    }
                  </div>

                  <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-2xl text-sm font-bold">
                    {new Date(
                      order.orderDate
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-5 min-w-[220px]">
                <div className="text-sm text-blue-100">
                  Order Total
                </div>

                <div className="text-4xl font-black mt-2">
                  ₹
                  {total.toLocaleString()}
                </div>

                <div className="text-blue-100 text-sm mt-2">
                  {
                    order.currencyName
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No Data Found
            </div>
          )}
        </div>

        {/* TABLE */}

        <div className="erp-card rounded-3xl border erp-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="erp-page border-b erp-border">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Product
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Qty
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    UOM
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Price
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Tax
                  </th>

                  <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Total
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Updated By
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({
                    length: 10,
                  }).map(
                    (_, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-100"
                      >
                        <td
                          colSpan={8}
                          className="px-5 py-4"
                        >
                          <div className="h-10 bg-gray-100 rounded-2xl animate-pulse"></div>
                        </td>
                      </tr>
                    )
                  )
                ) : items.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-16 text-gray-500"
                    >
                      No Items Found
                    </td>
                  </tr>
                ) : (
                  items.map(
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={`${item.id}-${index}`}
                        className="border-t border-gray-100 hover:bg-blue-50/40 transition"
                      >
                        {/* PRODUCT */}

                        <td className="px-5 py-4 min-w-[320px]">
                          <div className="font-bold text-gray-900 text-sm">
                            {
                              item.productName
                            }
                          </div>
                        </td>

                        {/* QTY */}

                        <td className="px-5 py-4 text-center">
                          <div className="font-bold text-gray-900">
                            {
                              item.quantity
                            }
                          </div>
                        </td>

                        {/* UOM */}

                        <td className="px-5 py-4 text-center">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                            {
                              item.uomName
                            }
                          </span>
                        </td>

                        {/* PRICE */}

                        <td className="px-5 py-4 text-right font-semibold text-gray-700">
                          ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString()}
                        </td>

                        {/* TAX */}

                        <td className="px-5 py-4 text-right font-semibold text-gray-700">
                          ₹
                          {Number(
                            item.taxAmount ||
                              0
                          ).toLocaleString()}
                        </td>

                        {/* TOTAL */}

                        <td className="px-5 py-4 text-right">
                          <div className="font-black text-gray-900">
                            ₹
                            {Number(
                              item.total || 0
                            ).toLocaleString()}
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.status ===
                              1
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {
                              item.salesOrderDetailStatusString
                            }
                          </span>
                        </td>

                        {/* UPDATED */}

                        <td className="px-5 py-4 text-center text-sm text-gray-600">
                          {item.changedBy ||
                            "-"}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}