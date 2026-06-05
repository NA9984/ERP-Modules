"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/services/api";

interface DepartmentLookupItem {
  id: string;
  name: string;
}

interface Props {
  isOpen: boolean;
  buyerId: string | null; // Null = Add Mode, String = Edit Mode
  onClose: () => void;
  onSaved: () => void;
}

export default function BuyerFormModal({ isOpen, buyerId, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentLookupItem[]>([]);

  // Exact state properties matching your backend payload requirements
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    departmentId: "", 
    employeeNumber: "",
    employeeGroup: 1, // Kept static type default as requested by API contract
    phone: "",
    email: "",
  });

  // Fetch departments dropdown data and handle configuration mode side effects
  useEffect(() => {
    if (isOpen) {
      fetchDepartments().then((fetchedDeps) => {
        if (buyerId) {
          loadBuyerDetails(buyerId);
        } else {
          // Initialize values on clean creation mode
          setFormData({
            name: "",
            position: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            departmentId: fetchedDeps[0]?.id || "", // Fallback defaults to first available item
            employeeNumber: "",
            employeeGroup: 1,
            phone: "",
            email: "",
          });
        }
      });
    }
  }, [isOpen, buyerId]);

  const fetchDepartments = async (): Promise<DepartmentLookupItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employee/department-lookup`);
      if (!response.ok) throw new Error("Failed to load departments array catalog");
      const data = await response.json();
      const items = data.items || [];
      setDepartments(items);
      return items;
    } catch (error) {
      console.error(error);
      alert("Could not fetch organization departments registry map.");
      return [];
    }
  };

  const loadBuyerDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employee/${id}`);
      if (!response.ok) throw new Error("Failed to pull server record");
      const data = await response.json();
      
      setFormData({
        name: data.name || "",
        position: data.position || "",
        street: data.street || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
        departmentId: data.departmentId || "",
        employeeNumber: data.employeeNumber || "",
        employeeGroup: data.employeeGroup ?? 1,
        phone: data.phone || "",
        email: data.email || "",
      });
    } catch (error) {
      console.error(error);
      alert("Error fetching agent's configuration profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Core structural validation requirements
    if (!formData.name.trim() || !formData.employeeNumber.trim() || !formData.departmentId) {
      alert("Name, Employee ID, and Department selection are mandatory fields.");
      return;
    }

    try {
      setLoading(true);
      
      const endpoint = buyerId ? `${API_BASE_URL}/employee/${buyerId}` : `${API_BASE_URL}/employee`;
      const method = buyerId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("API transaction rejected");
      
      alert(buyerId ? "Agent configuration updated successfully." : "New buyer identity profile committed.");
      onSaved();
    } catch (error) {
      console.error(error);
      alert("Error submitting dataset state.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="erp-card rounded-xl w-full max-w-2xl shadow-xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* HEADER BLOCK */}
        <div className="px-6 py-4 border-b border-slate-200 erp-page flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
            {buyerId ? "Modify Agent Metadata" : "Register Accounts Officer"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-medium p-1">
            &times;
          </button>
        </div>

        {/* INPUT LAYOUT SUBSTRUCTURE */}
        <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* MANDATORY PRIMARY INFO ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Agent Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Employee ID # <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.employeeNumber}
                onChange={(e) => handleInputChange("employeeNumber", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                placeholder="e.g. EMP-0921"
              />
            </div>
          </div>

          {/* DYNAMIC LOOKUP DEPARTMENTS & DESIGNATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Assigned Corporate Department <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => handleInputChange("departmentId", e.target.value)}
                className="w-full erp-card border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {departments.length === 0 ? (
                  <option value="" disabled>Loading departments matrix...</option>
                ) : (
                  departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Functional Designation Role
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Senior Procurement Officer"
              />
            </div>
          </div>

          {/* CONTACT PLACES */}
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
                placeholder="e.g. +1 (555) 019-2834"
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
                placeholder="buyer.agent@company.com"
              />
            </div>
          </div>

          {/* GEOGRAPHICAL METRICS */}
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
                placeholder="Suite 400, Financial District Hub"
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
                  placeholder="Chicago"
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
                  placeholder="IL"
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
                  placeholder="60601"
                />
              </div>
            </div>
          </div>

          {/* ACTIONS FOOTER SUB-ROW */}
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
              {loading ? "Processing..." : buyerId ? "Apply Changes" : "Save Buyer"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}