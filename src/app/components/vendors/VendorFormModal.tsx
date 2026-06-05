"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/services/api";

interface Props {
  isOpen: boolean;
  buyerId: string | null; // Keeps prop name matching your setup, tracks vendor ID
  onClose: () => void;
  onSaved: () => void;
}

export default function VendorFormModal({ isOpen, buyerId, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);

  // Form state matches your exact API contract
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (buyerId) {
        loadVendorDetails(buyerId);
      } else {
        setFormData({
          name: "",
          phone: "",
          email: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
        });
      }
    }
  }, [isOpen, buyerId]);

  const loadVendorDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/vendor/${id}`);
      const data = await response.json();
      
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        street: data.street || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
      });
    } catch (error) {
      console.error(error);
      alert("Error fetching vendor profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vendor Name is required.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = buyerId ? `${API_BASE_URL}/vendor/${buyerId}` : `${API_BASE_URL}/vendor`;
      const method = buyerId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Sends clean request body schema
      });

      if (!response.ok) throw new Error("API transactional failure");
      
      alert(buyerId ? "Vendor configuration updated." : "New vendor registered.");
      onSaved();
    } catch (error) {
      console.error(error);
      alert("Error submitting vendor entity state.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="erp-card rounded-xl w-full max-w-2xl shadow-xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 erp-page flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
            {buyerId ? "Modify Vendor Profile" : "Register Corporate Vendor"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-medium p-1">
            &times;
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* PRIMARY LINE */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Vendor Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Acme Industrial Corp"
            />
          </div>

          {/* CONTACT LINES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Contact Phone Line
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Corporate Email Endpoint
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="vendor@company.com"
              />
            </div>
          </div>

          {/* ADDRESS FIELDS */}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Geographical Mailing Address
            </h3>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Street Address Details
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="123 Supply Chain Road, Suite 400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  City Node
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Austin"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  State Zone
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="TX"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Zip/Postal Index
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder="73301"
                />
              </div>
            </div>
          </div>

          {/* ACTIONS FOOTER */}
          <div className="border-t border-slate-200 erp-page p-4 -mx-6 -mb-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 erp-card border border-slate-200 rounded-lg shadow-sm hover:erp-page"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : buyerId ? "Save Changes" : "Create Vendor"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}