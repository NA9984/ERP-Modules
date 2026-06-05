"use client";

import {
    useEffect,
    useState,
} from "react";

import AppLayout from "../components/layout/AppLayout";

import { API_BASE_URL } from "../services/api";
import Link from "next/link";

export default function SubmittedOrdersPage() {
    const [orders, setOrders] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const pageSize = 10;

    const [totalCount, setTotalCount] =
        useState(0);

    useEffect(() => {
        loadOrders();
    }, [currentPage]);

    async function loadOrders() {
        try {
            setLoading(true);

            //const url = `${API_BASE_URL}/sales-order?pageNumber=${currentPage}&pageSize=${pageSize}`;
            const user = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const userId = user.id;

            const url = `${API_BASE_URL}/sales-order/by-user-with-sP/${userId}?pageNumber=${currentPage}&pageSize=${pageSize}`;

            console.log(url);

            const response = await fetch(
                url
            );

            if (!response.ok) {
                const errorText =
                    await response.text();

                console.log(
                    errorText
                );

                throw new Error(
                    `Failed: ${response.status}`
                );
            }

            const data =
                await response.json();

            console.log(data);

            setOrders(
                Array.isArray(
                    data.items
                )
                    ? data.items
                    : []
            );

            setTotalCount(
                data.totalCount || 0
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const filteredOrders =
        orders.filter(
            (order: any) =>
                order.number
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                order.customerName
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );

    const totalPages = Math.ceil(
        totalCount / pageSize
    );

    function getStatusColor(
        status: string
    ) {
        switch (status) {
            case "SOCreated":
                return "bg-green-100 text-green-700";

            case "Draft":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    }

    return (
        <AppLayout>
            <div className="erp-page min-h-screen p-6 space-y-5">
                {/* HEADER */}

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

                            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                                Live Orders
                            </span>
                        </div>

                        <h1
                            className="text-3xl font-black"
                            style={{ color: "var(--text)" }}
                        >
                            Submitted Orders
                        </h1>

                        <p className="text-gray-500 mt-1 text-sm">
                            Manage and track sales
                            orders.
                        </p>
                    </div>

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold transition">
                        + Create Order
                    </button>
                </div>

                {/* SEARCH */}

                <div className="erp-card rounded-3xl p-4 shadow-sm">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <input
                            type="text"
                            placeholder="Search order or customer..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="w-full xl:w-96 erp-page border erp-border px-4 py-3 rounded-2xl text-sm outline-none focus:border-blue-500 focus:erp-card transition"
                        />

                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-sm font-bold">
                                Orders: {totalCount}
                            </div>

                            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl text-sm font-bold">
                                Page {currentPage}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABLE */}

                <div className="erp-card rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-5 space-y-3">
                                {Array.from({
                                    length: 8,
                                }).map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className="h-14 bg-gray-100 rounded-2xl animate-pulse"
                                        ></div>
                                    )
                                )}
                            </div>
                        ) : (
                            <>
                                <table className="w-full">
                                    <thead className="erp-page border-b erp-border">
                                        <tr>
                                            <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Order
                                            </th>

                                            <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Customer
                                            </th>

                                            <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Date
                                            </th>

                                            <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Executive
                                            </th>

                                            <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Total
                                            </th>

                                            <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>

                                            <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredOrders.length ===
                                            0 ? (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="text-center py-16 text-gray-500"
                                                >
                                                    No Orders Found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map(
                                                (
                                                    order: any
                                                ) => (
                                                    <tr
                                                        key={
                                                            order.id
                                                        }
                                                        className="border-t border-gray-100 hover:erp-page transition"
                                                    >
                                                        {/* ORDER */}

                                                        <td className="px-5 py-4">
                                                            <div className="font-bold text-gray-900 text-sm">
                                                                {
                                                                    order.number
                                                                }
                                                            </div>

                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {
                                                                    order.currencyName
                                                                }
                                                            </div>
                                                        </td>

                                                        {/* CUSTOMER */}

                                                        <td className="px-5 py-4">
                                                            <div className="font-medium text-gray-800 text-sm">
                                                                {
                                                                    order.customerName
                                                                }
                                                            </div>
                                                        </td>

                                                        {/* DATE */}

                                                        <td className="px-5 py-4 text-sm text-gray-600">
                                                            {order.orderDate
                                                                ? new Date(
                                                                    order.orderDate
                                                                ).toLocaleDateString()
                                                                : "-"}
                                                        </td>

                                                        {/* EXECUTIVE */}

                                                        <td className="px-5 py-4 text-sm text-gray-600">
                                                            {
                                                                order.salesExecutiveName
                                                            }
                                                        </td>

                                                        {/* TOTAL */}

                                                        <td className="px-5 py-4 text-right">
                                                            <div className="font-black text-gray-900">
                                                                ₹
                                                                {Number(
                                                                    order.total ||
                                                                    0
                                                                ).toLocaleString()}
                                                            </div>
                                                        </td>

                                                        {/* STATUS */}

                                                        <td className="px-5 py-4">
                                                            <div className="flex justify-center">
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                                                        order.statusString
                                                                    )}`}
                                                                >
                                                                    {
                                                                        order.statusString
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* ACTION */}

                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Link
                                                                    href={`/submitted-orders/${order.id}`}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                                                                >
                                                                    View
                                                                </Link>

                                                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition">
                                                                    Print
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}
                                    </tbody>
                                </table>

                                {/* PAGINATION */}

                                <div className="flex items-center justify-between p-4 border-t erp-border erp-page">
                                    <div className="text-sm text-gray-500">
                                        Page{" "}
                                        <span className="font-bold text-gray-900">
                                            {currentPage}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-bold text-gray-900">
                                            {totalPages || 1}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            disabled={
                                                currentPage === 1
                                            }
                                            onClick={() =>
                                                setCurrentPage(
                                                    currentPage - 1
                                                )
                                            }
                                            className="px-4 py-2 rounded-xl erp-card border erp-border text-sm font-semibold hover:bg-gray-100 disabled:opacity-50 transition"
                                        >
                                            Previous
                                        </button>

                                        <button
                                            disabled={
                                                currentPage ===
                                                totalPages ||
                                                totalPages === 0
                                            }
                                            onClick={() =>
                                                setCurrentPage(
                                                    currentPage + 1
                                                )
                                            }
                                            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}