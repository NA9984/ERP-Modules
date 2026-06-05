"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppLayout from "@/app/components/layout/AppLayout";

import { API_BASE_URL } from "@/app/services/api";

type DispatchItem = {
  salesOrderDocEntry: number;
  salesOrderNo: number;
  orderDate: string;
  cardCode: string;
  customerName: string;
  salesEmployee: string;
  itemCode: string;
  itemName: string;
  itmsGrpCod: number;
  orderedQty: number;
  price: number;
  orderValue: number;
  dispatchQty: number;
  pendingQty: number;
  pendingValue: number;
  dispatchStatus: string;
  pendingDays: number;
  latestDeliveryNo: number | null;
  latestDispatchDate: string | null;
};

export default function DispatchDashboardPage() {
  const [data, setData] =
    useState<
      DispatchItem[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("pendingValue");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 20;

  const [fromDate, setFromDate] =
    useState(() => {
      const date =
        new Date();

      date.setDate(
        date.getDate() - 30
      );

      return date
        .toISOString()
        .split("T")[0];
    });

  const [toDate, setToDate] =
    useState(() => {
      return new Date()
        .toISOString()
        .split("T")[0];
    });

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    status,
    sortBy,
  ]);

  async function loadDashboard() {
    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_BASE_URL}/stock/dispatch-dashboard?fromDate=${fromDate}&toDate=${toDate}`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to load dashboard"
        );
      }

      const result =
        await response.json();

      setData(result || []);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load dispatch dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredData =
    useMemo(() => {
      let filtered =
        data.filter(
          (item) => {
            const searchText =
              search.toLowerCase();

            const matchesSearch =
              item.customerName
                ?.toLowerCase()
                .includes(
                  searchText
                ) ||
              item.itemName
                ?.toLowerCase()
                .includes(
                  searchText
                ) ||
              item.salesOrderNo
                ?.toString()
                .includes(
                  searchText
                );

            const matchesStatus =
              status ===
              "All"
                ? true
                : item.dispatchStatus ===
                  status;

            return (
              matchesSearch &&
              matchesStatus
            );
          }
        );

      filtered.sort(
        (a, b) => {
          switch (
            sortBy
          ) {
            case "pendingValue":
              return (
                b.pendingValue -
                a.pendingValue
              );

            case "pendingQty":
              return (
                b.pendingQty -
                a.pendingQty
              );

            case "pendingDays":
              return (
                b.pendingDays -
                a.pendingDays
              );

            default:
              return 0;
          }
        }
      );

      return filtered;
    }, [
      data,
      search,
      status,
      sortBy,
    ]);

  const totalPages =
    Math.ceil(
      filteredData.length /
        itemsPerPage
    );

  const paginatedData =
    filteredData.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage *
        itemsPerPage
    );

  const summary =
    useMemo(() => {
      const totalOrders =
        filteredData.length;

      const pendingOrders =
        filteredData.filter(
          (x) =>
            x.dispatchStatus ===
            "Pending"
        ).length;

      const partialOrders =
        filteredData.filter(
          (x) =>
            x.dispatchStatus ===
            "Partial Dispatch"
        ).length;

      const fullOrders =
        filteredData.filter(
          (x) =>
            x.dispatchStatus ===
            "Fully Dispatched"
        ).length;

      const totalPendingQty =
        filteredData.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.pendingQty,
          0
        );

      const totalPendingValue =
        filteredData.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.pendingValue,
          0
        );

      return {
        totalOrders,
        pendingOrders,
        partialOrders,
        fullOrders,
        totalPendingQty,
        totalPendingValue,
      };
    }, [filteredData]);

  function getStatusColor(
    status: string
  ) {
    switch (status) {
      case "Pending":
        return "bg-red-100 text-red-700 border-red-200";

      case "Partial Dispatch":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* HEADER */}

        <div className="erp-card rounded-2xl border erp-border p-4 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                ● Live SAP Dispatch
                Monitoring
              </div>

              <h1 className="text-2xl font-black text-gray-900 mt-2">
                Dispatch Dashboard
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Real-time dispatch
                visibility directly
                from SAP.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* FROM DATE */}

              <input
                type="date"
                value={
                  fromDate
                }
                onChange={(e) =>
                  setFromDate(
                    e.target.value
                  )
                }
                style={{
                  colorScheme:
                    "light",
                }}
                className="border border-gray-300 erp-card text-gray-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {/* TO DATE */}

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(
                    e.target.value
                  )
                }
                style={{
                  colorScheme:
                    "light",
                }}
                className="border border-gray-300 erp-card text-gray-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {/* BUTTON */}

              <button
                onClick={
                  loadDashboard
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* KPI */}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="erp-card rounded-2xl border erp-border p-4 shadow-sm">
            <div className="text-xs text-gray-500">
              Total Orders
            </div>

            <div className="text-2xl font-black text-gray-900 mt-2">
              {
                summary.totalOrders
              }
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-100 p-4 shadow-sm">
            <div className="text-xs text-red-600">
              Pending
            </div>

            <div className="text-2xl font-black text-red-700 mt-2">
              {
                summary.pendingOrders
              }
            </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-4 shadow-sm">
            <div className="text-xs text-yellow-700">
              Partial
            </div>

            <div className="text-2xl font-black text-yellow-700 mt-2">
              {
                summary.partialOrders
              }
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl border border-green-100 p-4 shadow-sm">
            <div className="text-xs text-green-700">
              Completed
            </div>

            <div className="text-2xl font-black text-green-700 mt-2">
              {
                summary.fullOrders
              }
            </div>
          </div>

          <div className="erp-card rounded-2xl border erp-border p-4 shadow-sm">
            <div className="text-xs text-gray-500">
              Pending Qty
            </div>

            <div className="text-2xl font-black text-gray-900 mt-2">
              {summary.totalPendingQty.toLocaleString()}
            </div>
          </div>

          <div className="erp-card rounded-2xl border erp-border p-4 shadow-sm">
            <div className="text-xs text-gray-500">
              Pending Value
            </div>

            <div className="text-2xl font-black text-blue-700 mt-2">
              ₹
              {summary.totalPendingValue.toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 0,
                }
              )}
            </div>
          </div>
        </div>

        {/* FILTERS */}

        <div className="erp-card rounded-2xl border erp-border p-3 shadow-sm">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search customer / item / SO..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 erp-card text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* STATUS */}

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 erp-card text-gray-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Partial Dispatch">
                Partial
                Dispatch
              </option>

              <option value="Fully Dispatched">
                Fully
                Dispatched
              </option>
            </select>

            {/* SORT */}

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 erp-card text-gray-900 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pendingValue">
                Sort By Pending
                Value
              </option>

              <option value="pendingQty">
                Sort By Pending
                Qty
              </option>

              <option value="pendingDays">
                Sort By Aging
              </option>
            </select>

            {/* TOTAL */}

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center justify-center">
              <div className="text-sm font-semibold text-gray-700">
                Total Records :
                <span className="ml-2 text-blue-700 font-black">
                  {
                    filteredData.length
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="erp-card rounded-2xl border erp-border shadow-sm overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full min-w-[1450px]">
              <thead className="erp-page border-b erp-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    SO No
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Customer
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Item
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Sales Person
                  </th>

                  <th className="text-right px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Ordered
                  </th>

                  <th className="text-right px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Dispatch
                  </th>

                  <th className="text-right px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Pending
                  </th>

                  <th className="text-right px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Pending
                    Value
                  </th>

                  <th className="text-center px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Aging
                  </th>

                  <th className="text-center px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Status
                  </th>

                  <th className="text-center px-4 py-3 text-xs font-bold uppercase text-gray-500">
                    Last
                    Delivery
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({
                    length: 10,
                  }).map(
                    (
                      _,
                      index
                    ) => (
                      <tr
                        key={
                          index
                        }
                        className="border-b"
                      >
                        <td
                          colSpan={
                            11
                          }
                          className="p-4"
                        >
                          <div className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                        </td>
                      </tr>
                    )
                  )
                ) : paginatedData.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={
                        11
                      }
                      className="text-center py-20"
                    >
                      <div className="text-5xl">
                        📦
                      </div>

                      <div className="text-xl font-black text-gray-700 mt-4">
                        No Dispatch
                        Data Found
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map(
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={`${item.salesOrderDocEntry}-${index}`}
                        className="border-b border-gray-100 hover:erp-page transition"
                      >
                        <td className="px-4 py-3">
                          <div className="font-bold text-blue-700">
                            {
                              item.salesOrderNo
                            }
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(
                              item.orderDate
                            ).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">
                            {
                              item.customerName
                            }
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            {
                              item.cardCode
                            }
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800">
                            {
                              item.itemName
                            }
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            {
                              item.itemCode
                            }
                          </div>
                        </td>

                        <td className="px-4 py-3 text-gray-700 font-medium">
                          {
                            item.salesEmployee
                          }
                        </td>

                        <td className="px-4 py-3 text-right font-bold text-gray-800">
                          {item.orderedQty.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-right font-bold text-green-600">
                          {item.dispatchQty.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-right font-bold text-red-600">
                          {item.pendingQty.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-right font-black text-blue-700">
                          ₹
                          {item.pendingValue.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 0,
                            }
                          )}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <div
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                              item.pendingDays >
                              10
                                ? "bg-red-100 text-red-700"
                                : item.pendingDays >
                                  5
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {
                              item.pendingDays
                            }{" "}
                            Days
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <div
                            className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(
                              item.dispatchStatus
                            )}`}
                          >
                            {
                              item.dispatchStatus
                            }
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center">
                          {item.latestDeliveryNo ? (
                            <div>
                              <div className="font-bold text-gray-800">
                                {
                                  item.latestDeliveryNo
                                }
                              </div>

                              <div className="text-xs text-gray-500 mt-1">
                                {item.latestDispatchDate
                                  ? new Date(
                                      item.latestDispatchDate
                                    ).toLocaleDateString()
                                  : "-"}
                              </div>
                            </div>
                          ) : (
                            <div className="text-red-500 font-semibold text-sm">
                              Not
                              Delivered
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          {!loading &&
            filteredData.length >
              0 && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-4 border-t erp-border erp-page">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {(currentPage -
                      1) *
                      itemsPerPage +
                      1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-800">
                    {Math.min(
                      currentPage *
                        itemsPerPage,
                      filteredData.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {
                      filteredData.length
                    }
                  </span>{" "}
                  records
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage -
                          1
                      )
                    }
                    className="px-4 py-2 rounded-xl border erp-border erp-card text-sm font-medium disabled:opacity-40 hover:bg-gray-100"
                  >
                    Previous
                  </button>

                  <div className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
                    {currentPage} /{" "}
                    {totalPages}
                  </div>

                  <button
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage +
                          1
                      )
                    }
                    className="px-4 py-2 rounded-xl border erp-border erp-card text-sm font-medium disabled:opacity-40 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
}