"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppLayout from "../components/layout/AppLayout";

import { API_BASE_URL } from "../services/api";

type StockItem = {
  id: string;
  productName: string;
  uom: string;
  stock: number;
  sequenceNo: number;
  status: number;
  creatorName: string;
  canEditConfirmed: boolean;
  userId: string;
};

type StockCategory = {
  categoryId: string;
  categoryName: string;
  sequenceNo: number;
  items: StockItem[];
};

export default function StockUploadPage() {
  const [data, setData] =
    useState<
      StockCategory[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [confirming, setConfirming] =
    useState(false);

  const [editingId, setEditingId] =
    useState("");

  const [expandedCategories, setExpandedCategories] =
    useState<
      Record<string, boolean>
    >({});

  const [stockValues, setStockValues] =
    useState<Record<
      string,
      number
    >>({});

  async function loadData() {
    try {
      setLoading(true);

      const user =
        localStorage.getItem(
          "user"
        );

      if (!user) {
        throw new Error(
          "User not found"
        );
      }

      const parsedUser =
        JSON.parse(user);

      const userId =
        parsedUser.id;

      const response =
        await fetch(
          `${API_BASE_URL}/upload-scheme/stock-excel-view-based-on-user-id/${userId}`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to load stock data"
        );
      }

      const result =
        await response.json();

      setData(result);

      const initialStocks: Record<
        string,
        number
      > = {};

      const expandedState: Record<
        string,
        boolean
      > = {};

      result.forEach(
        (
          category: StockCategory
        ) => {
          expandedState[
            category.categoryId
          ] = true;

          category.items.forEach(
            (item) => {
              initialStocks[
                item.id
              ] = item.stock;
            }
          );
        }
      );

      setExpandedCategories(
        expandedState
      );

      setStockValues(
        initialStocks
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load stock data"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function updateStock(
    item: StockItem
  ) {
    try {
      setEditingId(item.id);

      const stock =
        stockValues[item.id] || 0;

      const response =
        await fetch(
          `${API_BASE_URL}/api/stockentry/api/app/stock/update?Id=${item.id}&Stock=${stock}&Status=${item.status}&CanEditConfirmed=${item.canEditConfirmed}`,
          {
            method: "POST",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to update stock"
        );
      }

      await loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Stock update failed"
      );
    } finally {
      setEditingId("");
    }
  }

  async function uploadStock() {
    try {
      setUploading(true);

      const response =
        await fetch(
          `${API_BASE_URL}/api/stockentry/api/app/stock/upload`,
          {
            method: "POST",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Upload failed"
        );
      }

      alert(
        "Stock uploaded successfully"
      );

      loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  async function confirmStock() {
    try {
      setConfirming(true);

      const response =
        await fetch(
          `${API_BASE_URL}/api/stockentry/api/app/stock/confirm`,
          {
            method: "POST",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Confirmation failed"
        );
      }

      alert(
        "Stock confirmed successfully"
      );

      loadData();
    } catch (error) {
      console.error(error);

      alert(
        "Confirmation failed"
      );
    } finally {
      setConfirming(false);
    }
  }

  const filteredData =
    useMemo(() => {
      if (!search) return data;

      return data
        .map((category) => ({
          ...category,
          items:
            category.items.filter(
              (item) =>
                item.productName
                  .toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )
            ),
        }))
        .filter(
          (category) =>
            category.items
              .length > 0
        );
    }, [data, search]);

  const totalProducts =
    data.reduce(
      (
        acc,
        category
      ) =>
        acc +
        category.items
          .length,
      0
    );

  const totalStock =
    data.reduce(
      (
        acc,
        category
      ) =>
        acc +
        category.items.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.stock,
          0
        ),
      0
    );

  function toggleCategory(
    categoryId: string
  ) {
    setExpandedCategories(
      (prev) => ({
        ...prev,
        [categoryId]:
          !prev[
            categoryId
          ],
      })
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* HEADER */}

        <div className="erp-card rounded-2xl border erp-border p-4 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                ● Live Stock
                Upload
              </div>

              <h1 className="text-2xl font-black text-gray-900 mt-2">
                Stock Upload
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Update stock and
                upload directly
                into SAP.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={
                  uploadStock
                }
                disabled={
                  uploading
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition disabled:bg-gray-400"
              >
                {uploading
                  ? "Uploading..."
                  : "Upload"}
              </button>

              <button
                onClick={
                  confirmStock
                }
                disabled={
                  confirming
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition disabled:bg-gray-400"
              >
                {confirming
                  ? "Confirming..."
                  : "Confirm"}
              </button>
            </div>
          </div>

          {/* SEARCH */}

          <div className="mt-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 erp-card text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-3 gap-3">
          <div className="erp-card rounded-2xl border erp-border p-4 shadow-sm">
            <p className="text-xs text-gray-500">
              Categories
            </p>

            <h2 className="text-2xl font-black mt-2 text-gray-900">
              {data.length}
            </h2>
          </div>

          <div className="erp-card rounded-2xl border erp-border p-4 shadow-sm">
            <p className="text-xs text-gray-500">
              Products
            </p>

            <h2 className="text-2xl font-black mt-2 text-gray-900">
              {
                totalProducts
              }
            </h2>
          </div>

          <div className="erp-card rounded-2xl border erp-border p-4 shadow-sm">
            <p className="text-xs text-gray-500">
              Total Stock
            </p>

            <h2 className="text-2xl font-black mt-2 text-blue-700">
              {totalStock}
            </h2>
          </div>
        </div>

        {/* CONTENT */}

        {loading ? (
          <div className="erp-card rounded-2xl border erp-border p-10 text-center shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-500">
              Loading stock
              data...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map(
              (category) => {
                const isExpanded =
                  expandedCategories[
                    category
                      .categoryId
                  ];

                return (
                  <div
                    key={
                      category.categoryId
                    }
                    className="erp-card rounded-2xl border erp-border shadow-sm overflow-hidden"
                  >
                    {/* CATEGORY HEADER */}

                    <button
                      onClick={() =>
                        toggleCategory(
                          category.categoryId
                        )
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between hover:opacity-95 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl erp-card/20 flex items-center justify-center text-white text-sm">
                          📦
                        </div>

                        <div className="text-left">
                          <h2 className="text-white font-bold text-sm">
                            {
                              category.categoryName
                            }
                          </h2>

                          <p className="text-blue-100 text-xs mt-0.5">
                            {
                              category
                                .items
                                .length
                            }{" "}
                            Products
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="erp-card/20 text-white text-xs px-3 py-1 rounded-full">
                          #
                          {
                            category.sequenceNo
                          }
                        </div>

                        <div className="text-white text-lg">
                          {isExpanded
                            ? "⌄"
                            : "›"}
                        </div>
                      </div>
                    </button>

                    {/* PRODUCTS */}

                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="erp-page border-b erp-border">
                            <tr className="text-left">
                              <th className="px-4 py-3 text-xs font-bold uppercase text-gray-500">
                                Product
                              </th>

                              <th className="px-4 py-3 text-xs font-bold uppercase text-gray-500">
                                UOM
                              </th>

                              <th className="px-4 py-3 text-xs font-bold uppercase text-gray-500">
                                Current
                              </th>

                              <th className="px-4 py-3 text-xs font-bold uppercase text-gray-500">
                                Update
                              </th>

                              <th className="px-4 py-3 text-xs font-bold uppercase text-gray-500">
                                Updated
                                By
                              </th>

                              <th className="px-4 py-3 text-xs font-bold uppercase text-gray-500">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {category.items.map(
                              (
                                item
                              ) => (
                                <tr
                                  key={`${item.id}-${item.sequenceNo}`}
                                  className="border-b border-gray-100 hover:erp-page transition"
                                >
                                  <td className="px-4 py-3 min-w-[300px]">
                                    <div className="font-semibold text-gray-900 text-sm">
                                      {
                                        item.productName
                                      }
                                    </div>

                                    <div className="text-xs text-gray-400 mt-1">
                                      Seq #
                                      {
                                        item.sequenceNo
                                      }
                                    </div>
                                  </td>

                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                                      {
                                        item.uom
                                      }
                                    </span>
                                  </td>

                                  <td className="px-4 py-3">
                                    <span
                                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                        item.stock >
                                        0
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {
                                        item.stock
                                      }
                                    </span>
                                  </td>

                                  <td className="px-4 py-3">
                                    <input
                                      type="number"
                                      value={
                                        stockValues[
                                          item.id
                                        ] ||
                                        0
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        setStockValues(
                                          (
                                            prev
                                          ) => ({
                                            ...prev,
                                            [
                                              item.id
                                            ]:
                                              Number(
                                                e
                                                  .target
                                                  .value
                                              ),
                                          })
                                        )
                                      }
                                      className="w-24 border border-gray-300 erp-card text-gray-900 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </td>

                                  <td className="px-4 py-3">
                                    <span className="text-sm text-gray-600">
                                      {item.creatorName ||
                                        "-"}
                                    </span>
                                  </td>

                                  <td className="px-4 py-3">
                                    <button
                                      onClick={() =>
                                        updateStock(
                                          item
                                        )
                                      }
                                      disabled={
                                        editingId ===
                                        item.id
                                      }
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition disabled:bg-gray-400"
                                    >
                                      {editingId ===
                                      item.id
                                        ? "Saving..."
                                        : "Update"}
                                    </button>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}