"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/app/components/layout/AppLayout";
import { API_BASE_URL } from "@/app/services/api";

// Modernized SVGs
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
  </svg>
);

const QrCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 16.5h.75v.75h-.75v-.75ZM16.5 13.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM16.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 16.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.008v.008H16.5V16.5Z" />
  </svg>
);

interface VendorBillHeader {
  id: string;
  number: string;
  description: string;
  termCondition: string;
  paymentNote: string;
  status: number;
  statusString: string;
  billDate: string;
  billDueDate: string;
  vendorId: string;
  vendorName: string;
  currencyName: string;
  total: number;
  sourceDocument: string;
  sourceDocumentId: string;
  sourceDocumentModule: number;
  sourceDocumentModuleString: string;
  sourceDocumentPath: string;
}

interface BillSummary {
  subTotal: string;
  discAmt: string;
  beforeTax: string;
  taxAmount: string;
  grandTotal: string;
}

export default function VendorBillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const billId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<VendorBillHeader | null>(null);
  const [items, setItems] = useState<any[]>([]);
  
  const [summary, setSummary] = useState<BillSummary>({
    subTotal: "0.00",
    discAmt: "0.00",
    beforeTax: "0.00",
    taxAmount: "0.00",
    grandTotal: "0.00",
  });

  async function loadHeader() {
    try {
      const response = await fetch(`${API_BASE_URL}/vendor-bill/${billId}`);
      if (response.ok) {
        const data = await response.json();
        setHeader(data);
      }
    } catch (err) {
      console.error("Error loading header:", err);
    }
  }

  async function loadItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/vendor-bill-detail/by-vendor-bill/${billId}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error("Error loading items:", err);
    }
  }

  async function loadSummary() {
    try {
      const [subTotalRes, discAmtRes, beforeTaxRes, taxAmountRes, totalRes] = await Promise.all([
        fetch(`${API_BASE_URL}/vendor-bill/${billId}/summary-sub-total`),
        fetch(`${API_BASE_URL}/vendor-bill/${billId}/summary-disc-amt`),
        fetch(`${API_BASE_URL}/vendor-bill/${billId}/summary-before-tax`),
        fetch(`${API_BASE_URL}/vendor-bill/${billId}/summary-tax-amount/`),
        fetch(`${API_BASE_URL}/vendor-bill/${billId}/summary-total`)
      ]);

      const getSafeText = async (res: Response) => {
        if (!res.ok) return "0.00";
        const text = await res.text();
        if (text.trim().startsWith("<!DOCTYPE")) {
          console.warn(`HTML error detected for endpoint: ${res.url}`);
          return "0.00";
        }
        return text || "0.00";
      };

      setSummary({
        subTotal: await getSafeText(subTotalRes),
        discAmt: await getSafeText(discAmtRes),
        beforeTax: await getSafeText(beforeTaxRes),
        taxAmount: await getSafeText(taxAmountRes),
        grandTotal: await getSafeText(totalRes),
      });

    } catch (err) {
      console.error("Error loading financial summaries:", err);
    }
  }

  async function loadData() {
    try {
      setLoading(true);
      await Promise.all([loadHeader(), loadItems(), loadSummary()]);
    } catch (err) {
      console.error("Error compiling data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (billId) {
      loadData();
    }
  }, [billId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[75vh] flex items-center justify-center erp-page/50">
          <div className="text-center space-y-4 p-8 rounded-2xl erp-card shadow-sm border border-slate-100">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-500 tracking-wide">
              Fetching invoice breakdown...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen erp-page/50 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans antialiased">
        
        {/* TOP BAR / NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 erp-card p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Vendor Invoice Details</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                header?.status === 1 
                  ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20" 
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${header?.status === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                {header?.statusString || "Unknown"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Document Registry Reference: <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{header?.number || "—"}</span>
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 erp-card border border-slate-200 rounded-xl shadow-sm hover:erp-page hover:text-slate-900 transition-all duration-200 focus:ring-2 focus:ring-slate-100"
          >
            <ArrowLeftIcon />
            <span>Back to List</span>
          </button>
        </div>

        {/* METADATA METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* REGISTRY HASH */}
          <div className="erp-card rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 erp-page rounded-xl border border-slate-100 shrink-0">
              <QrCodeIcon />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Registry String</span>
              <span className="text-sm font-semibold text-slate-800 font-mono block truncate">{header?.number || "No Record Data"}</span>
            </div>
          </div>

          {/* OVERVIEW */}
          <div className="erp-card rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Invoice Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[11px] font-medium text-slate-400">ID Ref</span>
                <span className="text-sm font-semibold text-slate-800 block truncate">{header?.number || "—"}</span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-slate-400">System Base CCY</span>
                <span className="text-sm font-semibold text-indigo-600 font-mono bg-indigo-50/50 px-1.5 py-0.5 rounded inline-block">{header?.currencyName || "—"}</span>
              </div>
            </div>
          </div>

          {/* VENDOR ACCOUNT */}
          <div className="erp-card rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Vendor & Terms</h3>
            <div className="space-y-2">
              <div>
                <span className="block text-[11px] font-medium text-slate-400">Vendor Corporate Name</span>
                <span className="text-sm font-bold text-slate-800 block truncate">{header?.vendorName || "—"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50">
                <div>
                  <span className="block text-[10px] font-medium text-slate-400">Issue Date</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {header?.billDate ? new Date(header.billDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "—"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-medium text-slate-400">Maturity Date</span>
                  <span className="text-xs font-semibold text-rose-600">
                    {header?.billDueDate ? new Date(header.billDueDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ORIGIN */}
          <div className="erp-card rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Origin Context</h3>
            <div className="space-y-2">
              <div>
                <span className="block text-[11px] font-medium text-slate-400">Linked Document Source</span>
                <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer block truncate transition-colors">{header?.sourceDocument || "—"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50">
                <div>
                  <span className="block text-[10px] font-medium text-slate-400">Origin Module</span>
                  <span className="text-xs font-semibold text-slate-700 truncate block">{header?.sourceDocumentModuleString || "—"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-medium text-slate-400">Context Notes</span>
                  <span className="text-xs font-normal text-slate-500 truncate block" title={header?.description || ""}>{header?.description || "—"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* LINE ITEMS TABLE CARD */}
        <div className="erp-card border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between erp-page/50">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-800 tracking-tight text-base">Itemized Cost Allocation</h3>
              <p className="text-xs text-slate-400">Breakdown of product rates, taxes, and dynamic totals</p>
            </div>
            <span className="text-xs font-semibold bg-slate-200/70 text-slate-700 px-2.5 py-1 rounded-lg">
              {items.length} {items.length === 1 ? "Line Item" : "Line Items"}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="erp-page/70 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 text-left font-bold">Product/Service Description</th>
                  <th className="p-4 text-left font-bold">Rate</th>
                  <th className="p-4 text-left font-bold">Quantity</th>
                  <th className="p-4 text-right font-bold">Subtotal</th>
                  <th className="p-4 text-right font-bold">Deductions</th>
                  <th className="p-4 text-right font-bold">Taxable Amt</th>
                  <th className="p-4 text-right font-bold">Taxes</th>
                  <th className="p-4 text-right font-bold">Net Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {items.map((item) => (
                  <tr key={item.id} className="hover:erp-page/40 transition-colors group">
                    <td className="p-4 font-semibold text-slate-900 max-w-sm group-hover:text-indigo-600 transition-colors">{item.productName}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-medium text-slate-800">{item.priceString}</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-600 uppercase font-mono tracking-wide">
                          {item.currencyName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{item.quantity}</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 text-slate-600 uppercase tracking-wide">
                          {item.uomName || 'PCS'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-medium text-slate-800 whitespace-nowrap">{item.subTotalString}</td>
                    <td className="p-4 text-right font-mono text-rose-600 font-medium whitespace-nowrap">{item.discAmtString}</td>
                    <td className="p-4 text-right font-mono text-slate-600 whitespace-nowrap">{item.beforeTaxString}</td>
                    <td className="p-4 text-right font-mono text-amber-600 font-medium whitespace-nowrap">{item.taxAmountString}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">{item.totalString}</td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-16 text-center text-slate-400 font-medium">
                      No matching line items registered to this record.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FINANCIAL SUMMARY HIGHLIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="erp-card rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Base Subtotal</div>
            <div className="text-xl font-bold font-mono text-slate-800">{summary.subTotal}</div>
          </div>

          <div className="erp-card rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aggregated Discount</div>
            <div className="text-xl font-bold font-mono text-rose-600">{summary.discAmt}</div>
          </div>

          <div className="erp-card rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Pre-Tax Base</div>
            <div className="text-xl font-bold font-mono text-slate-800">{summary.beforeTax}</div>
          </div>

          <div className="erp-card rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assessable Tax Pool</div>
            <div className="text-xl font-bold font-mono text-amber-600">{summary.taxAmount}</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-md shadow-emerald-600/10 p-5 text-white sm:col-span-2 lg:col-span-1 flex flex-col justify-between space-y-2">
            <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Grand Total Liability</div>
            <div className="text-2xl font-black font-mono tracking-tight">{summary.grandTotal}</div>
          </div>
          
        </div>

      </div>
    </AppLayout>
  );
};