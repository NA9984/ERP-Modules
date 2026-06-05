"use client";

import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";
import {
  addCustomer,
  getCustomers,
} from "../services/customerService";

export default function CustomersPage() {
  const [customers, setCustomers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [showModal, setShowModal] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [customerName, setCustomerName] =
    useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const data = await getCustomers();

      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCustomer() {
    try {
      if (!customerName) {
        alert("Customer Name Required");

        return;
      }

      setSaving(true);

      const payload = {
        name: customerName,
        phone: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        status: 1,
        leadSourceId:
          "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        leadRatingId:
          "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        stage: 1,
        cardCode: "",
      };

      await addCustomer(payload);

      setShowModal(false);

      setCustomerName("");

      loadCustomers();
    } catch (error) {
      console.error(error);

      alert("Failed To Add Customer");
    } finally {
      setSaving(false);
    }
  }

  const filteredCustomers =
    customers.filter((customer) =>
      customer.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(
    filteredCustomers.length /
      itemsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedCustomers =
    filteredCustomers.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Customers
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your customer data
            </p>
          </div>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow"
          >
            + Add Customer
          </button>
        </div>

        {/* SEARCH */}

        <div className="erp-card p-5 rounded-2xl shadow-sm border">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => {
              setSearch(
                e.target.value
              );

              setCurrentPage(1);
            }}
            className="w-full md:w-96 border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TABLE */}

        <div className="erp-card rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-5 space-y-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>

                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600">
                        Customer Name
                      </th>

                      <th className="text-left p-4 text-sm font-semibold text-gray-600">
                        City
                      </th>

                      <th className="text-left p-4 text-sm font-semibold text-gray-600">
                        Mobile
                      </th>

                      <th className="text-center p-4 text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedCustomers.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center p-10 text-gray-500"
                        >
                          No Customers Found
                        </td>
                      </tr>
                    ) : (
                      paginatedCustomers.map(
                        (
                          customer,
                          index
                        ) => (
                          <tr
                            key={index}
                            className="border-t hover:erp-page transition"
                          >
                            <td className="p-4 font-medium text-gray-800">
                              {
                                customer.name
                              }
                            </td>

                            <td className="p-4 text-gray-600">
                              {customer.city ||
                                "-"}
                            </td>

                            <td className="p-4 text-gray-600">
                              {customer.mobile ||
                                "-"}
                            </td>

                            <td className="p-4">
                              <div className="flex justify-center gap-2">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                                  Edit
                                </button>

                                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                                  Delete
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

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-t">
                  <div className="text-sm text-gray-500">
                    Showing{" "}
                    {
                      paginatedCustomers.length
                    }{" "}
                    of{" "}
                    {
                      filteredCustomers.length
                    }{" "}
                    customers
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        setCurrentPage(
                          currentPage - 1
                        )
                      }
                      className="px-4 py-2 rounded-lg border erp-card hover:bg-gray-100 disabled:opacity-50"
                    >
                      Previous
                    </button>

                    <div className="px-4 text-sm font-medium">
                      Page{" "}
                      {currentPage} of{" "}
                      {totalPages || 1}
                    </div>

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
                      className="px-4 py-2 rounded-lg border erp-card hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ADD CUSTOMER MODAL */}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="erp-card rounded-2xl p-8 w-full max-w-lg">
              <h2 className="text-3xl font-bold mb-6">
                Add Customer
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                  className="w-full border p-4 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-5 py-3 rounded-xl border"
                >
                  Cancel
                </button>

                <button
                  disabled={saving}
                  onClick={
                    handleAddCustomer
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl disabled:bg-gray-400"
                >
                  {saving
                    ? "Saving..."
                    : "Save Customer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}