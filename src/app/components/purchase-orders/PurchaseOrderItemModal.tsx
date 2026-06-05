"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/services/api";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Props {
  isOpen: boolean;
  purchaseOrderId: string;
  detailId?: string | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function PurchaseOrderItemModal({
  isOpen,
  purchaseOrderId,
  detailId,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [discAmt, setDiscAmt] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(0);

  useEffect(() => {
    if (isOpen) {
      loadProducts();
      if (detailId) {
        loadDetail();
      } else {
        resetForm();
      }
    }
  }, [isOpen, detailId]);

  const resetForm = () => {
    setProductId("");
    setQuantity(1);
    setDiscAmt(0);
    setSelectedPrice(0);
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/purchase-order-detail/product-lookup`
      );
      const data = await response.json();
      setProducts(data.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDetail = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/purchase-order-detail/${detailId}`
      );
      const data = await response.json();
      setProductId(data.productId);
      setQuantity(data.quantity);
      setDiscAmt(data.discAmt);
      setSelectedPrice(data.price || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductChange = (value: string) => {
    setProductId(value);
    const product = products.find((x) => x.id === value);
    setSelectedPrice(product?.price || 0);
  };

  const saveItem = async () => {
    if (!productId) {
      alert("Please select a product");
      return;
    }
    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        purchaseOrderId,
        productId,
        quantity,
        discAmt,
      };

      let response;
      if (detailId) {
        response = await fetch(
          `${API_BASE_URL}/purchase-order-detail/${detailId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(`${API_BASE_URL}/purchase-order-detail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error("Save failed");
      onSaved();
    } catch (error) {
      console.error(error);
      alert("Failed to save item");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const estimatedAmount = quantity * selectedPrice - discAmt;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center z-50 p-4 transition-all">
      <div className="erp-card rounded-xl w-full max-w-lg shadow-xl border border-slate-200/80 overflow-hidden transform transition-all flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 erp-page flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
            {detailId ? "Modify Item Specifications" : "Attach New Line Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-medium transition-colors p-1 leading-none"
            title="Close modal"
          >
            &times;
          </button>
        </div>

        {/* MODAL FORM BODY */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {/* PRODUCT SELECTION */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Catalog Product <span className="text-red-500">*</span>
            </label>
            <select
              value={productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 erp-card transition-all"
            >
              <option value="">Choose item from registry...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* BASE UNIT PRICE */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Default Standard Price (Unit)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-slate-400 text-sm font-medium">₹</span>
              <input
                readOnly
                value={selectedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                className="w-full border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 erp-page text-slate-600 font-mono text-sm cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* QTY & DISCOUNT CONTAINER */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Order Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Deducted Discount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 text-sm font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  value={discAmt}
                  onChange={(e) => setDiscAmt(Math.max(0, Number(e.target.value)))}
                  className="w-full border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 text-sm text-slate-800 font-medium text-amber-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* METRIC BREAKDOWN WRAPPER */}
          <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Gross Calculation ({quantity} × ₹{selectedPrice.toFixed(2)})</span>
              <span className="font-mono">₹{(quantity * selectedPrice).toFixed(2)}</span>
            </div>
            {discAmt > 0 && (
              <div className="flex justify-between text-xs text-amber-600">
                <span>Subtracted Item Discount</span>
                <span className="font-mono">-₹{discAmt.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-blue-100/70 pt-2 text-sm text-slate-700 font-bold">
              <span className="text-blue-700">Estimated Total (Before Tax)</span>
              <span className="text-base text-blue-700 font-mono">
                ₹{estimatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

        </div>

        {/* MODAL ACTIONS FOOTER */}
        <div className="erp-page border-t border-slate-200 p-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 erp-card border border-slate-200 rounded-lg shadow-sm hover:erp-page transition-all"
          >
            Cancel
          </button>
          
          <button
            disabled={loading}
            onClick={saveItem}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all min-w-[80px] text-center"
          >
            {loading ? "Saving..." : "Commit Item"}
          </button>
        </div>

      </div>
    </div>
  );
}