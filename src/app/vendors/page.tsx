"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";
import VendorFormModal from "../components/vendors/VendorFormModal";

interface VendorItem {
  id: string;
  name: string;
  employeeNumber: string; // Acts as your Vendor Code / Registration identifier
  city: string;
  phone: string;
  position: string; // Point of Contact Designation
}

export default function VendorsDashboardPage() {
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/vendor`);
      if (!response.ok) throw new Error("Failed to load vendors registry");
      const data = await response.json();
      setVendors(data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to sync dataset from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedVendorId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id: string) => {
    setSelectedVendorId(id);
    setIsModalOpen(true);
  };

  const handleDeleteVendor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to terminate vendor profile: ${name}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/vendor/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Deletion failed");
      alert("Vendor profile removed successfully.");
      fetchVendors();
    } catch (error) {
      console.error(error);
      alert("Failed to delete selected vendor profile.");
    }
  };

  // Live local search filter
  const filteredVendors = vendors.filter((vendor) =>
    Object.values(vendor).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <AppLayout>
      <div className="min-h-screen erp-page/50 p-2 sm:p-4 space-y-6">
        
        {/* TOP COMMAND BAR HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Corporate Vendor Master Registry
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage profiles, manufacturing locations, and corporate contact details.
            </p>
          </div>
          
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all self-start md:self-auto"
          >
            <span>+</span> Add New Vendor
          </button>
        </div>

        {/* WORKFLOW CONTROLS & SEARCH */}
        <div className="flex items-center max-w-md erp-card border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <span className="text-slate-400 text-sm mr-2">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, vendor code, phone or city..."
            className="w-full text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* DATA CONTAINER */}
        <div className="erp-card rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="erp-page border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Vendor Code</th>
                  <th className="px-6 py-3.5">Vendor Name</th>
                  <th className="px-6 py-3.5">Designation Role</th>
                  <th className="px-6 py-3.5">City Location</th>
                  <th className="px-6 py-3.5">Contact Line</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium animate-pulse">
                      Synchronizing localized vendor databases...
                    </td>
                  </tr>
                ) : filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      No vendors match your matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:erp-page/70 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{vendor.employeeNumber}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{vendor.name}</td>
                      <td className="px-6 py-4 text-slate-500">{vendor.position || "—"}</td>
                      <td className="px-6 py-4 text-slate-500">{vendor.city || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{vendor.phone || "—"}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(vendor.id)}
                          className="px-2.5 py-1 text-xs font-medium border border-slate-200 text-slate-600 erp-card hover:erp-page rounded shadow-sm transition-all"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                          className="px-2.5 py-1 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded shadow-sm transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL COMPONENT */}
        <VendorFormModal
          isOpen={isModalOpen}
          buyerId={selectedVendorId} // Kept property hook name identical to support your modal's expected prop types
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            fetchVendors();
          }}
        />

      </div>
    </AppLayout>
  );
}