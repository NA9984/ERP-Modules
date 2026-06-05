"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";
import BuyerFormModal from "../components/buyers/BuyerFormModal";
interface BuyerItem {
  id: string;
  name: string;
  employeeNumber: string;
  city: string;
  phone: string;
  position: string;
  departmentName: string;
}

export default function BuyersDashboardPage() {
  const [buyers, setBuyers] = useState<BuyerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employee`);
      if (!response.ok) throw new Error("Failed to load buyers registry");
      const data = await response.json();
      setBuyers(data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to sync dataset from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedBuyerId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id: string) => {
    setSelectedBuyerId(id);
    setIsModalOpen(true);
  };

  const handleDeleteBuyer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to terminate buyer profile: ${name}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/buyer/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Deletion failed");
      alert("Profile removed successfully.");
      fetchBuyers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete selected buyer profile.");
    }
  };

  // Live Excel-like local search filter
  const filteredBuyers = buyers.filter((buyer) =>
    Object.values(buyer).some((val) =>
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
              Procurement Agent Master (Buyers)
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage accounts officers, corporate buyer listings, and department alignments.
            </p>
          </div>
          
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all self-start md:self-auto"
          >
            <span>+</span> Add New Buyer
          </button>
        </div>

        {/* WORKFLOW CONTROLS & SEARCH */}
        <div className="flex items-center max-w-md erp-card border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <span className="text-slate-400 text-sm mr-2">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, code, phone or department..."
            className="w-full text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* DATA CONTAINER */}
        <div className="erp-card rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="erp-page border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Emp ID</th>
                  <th className="px-6 py-3.5">Full Name</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Designation Role</th>
                  <th className="px-6 py-3.5">City Location</th>
                  <th className="px-6 py-3.5">Contact Line</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 font-medium animate-pulse">
                      Synchronizing localized employee databases...
                    </td>
                  </tr>
                ) : filteredBuyers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                      No buyers match your matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBuyers.map((buyer) => (
                    <tr key={buyer.id} className="hover:erp-page/70 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{buyer.employeeNumber}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{buyer.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                          {buyer.departmentName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{buyer.position || "—"}</td>
                      <td className="px-6 py-4 text-slate-500">{buyer.city || "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{buyer.phone || "—"}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(buyer.id)}
                          className="px-2.5 py-1 text-xs font-medium border border-slate-200 text-slate-600 erp-card hover:erp-page rounded shadow-sm transition-all"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDeleteBuyer(buyer.id, buyer.name)}
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

        {/* MULTIPURPOSE POPUP COMPONENT */}
        <BuyerFormModal
          isOpen={isModalOpen}
          buyerId={selectedBuyerId}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            fetchBuyers();
          }}
        />

      </div>
    </AppLayout>
  );
}