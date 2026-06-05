"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/context/ThemeContext";
type SidebarProps = {
  role: string;
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { theme, changeTheme } = useTheme();
  // Dropdown states
  const [customerMenuOpen, setCustomerMenuOpen] = useState(false);
  const [dataMasterOpen, setDataMasterOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [uploadsOpen, setUploadsOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [sapOrderOpen, setSAPOrderOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [sapReportsOpen, setSapReportsOpen] = useState(false);
  const [dispatchReportsOpen, setDispatchReportsOpen] = useState(false);
  const [salesReportsOpen, setSalesReportsOpen] = useState(false);
  const [inventoryReportsOpen, setInventoryReportsOpen] = useState(false);
  const [financialReportsOpen, setFinancialReportsOpen] = useState(false);

  // Auto-expand menu based on current active URL route
  useEffect(() => {
    // Customer Management sub-menus
    const dataMasterRoutes = ["/activity", "/lead-source", "/lead-rating", "/expense-type"];
    const transactionRoutes = ["/lead", "/customers", "/contact", "/note", "/service-quotation", "/sales-quotation", "/expense", "/task", "/important-date"];

    if (dataMasterRoutes.includes(pathname)) {
      setCustomerMenuOpen(true);
      setDataMasterOpen(true);
    }
    if (transactionRoutes.includes(pathname)) {
      setCustomerMenuOpen(true);
      setTransactionOpen(true);
    }

    // Orders
    if (pathname === "/submitted-orders") setOrdersOpen(true);

    // Reports
    if (pathname === "/pending-sales-order-report") setReportsOpen(true);

    // SAP Reports Nested items
    if (pathname.startsWith("/sap-reports/")) {
      setSapReportsOpen(true);
      if (pathname.includes("dispatch")) setDispatchReportsOpen(true);
      if (pathname.includes("sales") || pathname.includes("salesman")) setSalesReportsOpen(true);
      if (pathname.includes("inventory") || pathname.includes("stock")) setInventoryReportsOpen(true);
      if (pathname.includes("outstanding") || pathname.includes("aging")) setFinancialReportsOpen(true);
    }

    // Products
    if (pathname === "/products") setProductOpen(true);

    // Uploads
    if (pathname === "/stock-upload") setUploadsOpen(true);

    // Purchase Order
    if (["/purchase-orders", "/buyers", "/vendors"].includes(pathname)) {
      setPurchaseOpen(true);
    }

    // Inventory
    if (pathname === "/inventory-dashboard") setInventoryOpen(true);

    // SAP Orders
    if (pathname === "/sap-orders") setSAPOrderOpen(true);

    // Documents
    if (pathname === "/documents") setDocumentOpen(true);

  }, [pathname]); // Fires whenever URL route changes

  const canViewReports = role === "admin" || role === "Sales Cordinator";

  function menuClass(href: string) {
    const active =
      pathname === href;

    return `
    flex items-center gap-3
    px-4 py-2.5
    rounded-xl
    text-sm
    font-medium
    transition-all
    ${active
        ? "bg-blue-600 text-white"
        : ""
      }
  `;
  }

  function menuButtonClass(
    open = false
  ) {
    return `
    w-full
    flex
    items-center
    justify-between
    px-4
    py-2.5
    rounded-xl
    text-sm
    font-medium
    transition-all
    ${open ? "bg-blue-600 text-white" : ""}
  `;
  }

  return (
    <div
      className="w-64 min-w-64 h-screen border-r flex flex-col transition-all duration-300"
      style={{
        background: "var(--card)",
        color: "var(--text)",
        borderColor: "var(--border)"
      }}
    >

      {/* FIXED HEADER */}
      <div
        className="p-5 border-b flex-shrink-0"
        style={{
          borderColor: "var(--border)"
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-lg font-bold">
            ERP
          </div>
          <div>
            <h1 className="text-xl font-bold">ERP System</h1>
            <p className="text-xs text-gray-400 mt-1">Enterprise Suite</p>
          </div>
        </div>

        {/* LOGGED IN USER STATE */}
        <div
          className="mt-4 rounded-2xl p-3 border"
          style={{
            background: "var(--bg)",
            borderColor: "var(--border)"
          }}
        >
          <div className="text-xs text-gray-400">Logged in as</div>
          <div className="font-semibold text-sm mt-1">{role || "User"}</div>
        </div>

        {/* THEME SELECTOR */}

        <div
          className="mt-4 rounded-2xl border p-3"
          style={{
            background: "var(--bg)",
            borderColor: "var(--border)"
          }}
        >

          <div className="text-xs text-gray-400 mb-2">
            Theme
          </div>

          <select
            value={theme}
            onChange={(e) =>
              changeTheme(e.target.value as any)
            }
            className="w-full rounded-xl px-3 py-2 text-sm"
            style={{
              background: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border)"
            }}
          >
            <option value="light">
              ☀️ Light
            </option>

            <option value="dark">
              🌙 Dark
            </option>

            <option value="blue">
              💙 Corporate Blue
            </option>

            <option value="emerald">
              🟢 Emerald ERP
            </option>

            

            <option value="ocean">🌊 Ocean</option>
            <option value="sage">🌿 Sage Green</option>
            <option value="teal">💎 Teal</option>
            <option value="coffee">☕ Coffee</option>
            <option value="sand">🌅 Warm Sand</option>
            <option value="frost">🧊 Frost</option>
            <option value="sap">🏭 SAP Blue</option>
            <option value="navy">🌌 Deep Navy</option>
            <option value="executive">🎩 Executive Purple</option>

          </select>

        </div>


      </div>

      {/* SCROLLABLE MENU SECTION */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">

        {/* DASHBOARD */}
        <Link href="/" className={menuClass("/")}>
          <span>🏠</span>
          Dashboard
        </Link>

        {/* CUSTOMER MANAGEMENT */}
        <div className="pt-2">
          <button
            onClick={() => setCustomerMenuOpen(!customerMenuOpen)}
            className={menuButtonClass(customerMenuOpen)}
          >
            <div className="flex items-center gap-3">
              <span>👥</span>
              <span>Customer Management</span>
            </div>
            <span>{customerMenuOpen ? "−" : "+"}</span>
          </button>

          {customerMenuOpen && (
            <div className="ml-3 mt-2 space-y-1 border-l border-gray-800 pl-3">
              {/* DATA MASTER */}
              <div>
                <button
                  onClick={() => setDataMasterOpen(!dataMasterOpen)}
                  className={menuButtonClass(dataMasterOpen)}
                >
                  <div className="flex items-center gap-3">
                    <span>🧠</span>
                    <span>Data Master</span>
                  </div>
                  <span>{dataMasterOpen ? "−" : "+"}</span>
                </button>

                {dataMasterOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">
                    <Link href="/activity" className={menuClass("/activity")}>
                      Activity
                    </Link>
                    <Link href="/lead-source" className={menuClass("/lead-source")}>
                      Lead Source
                    </Link>
                    <Link href="/lead-rating" className={menuClass("/lead-rating")}>
                      Lead Rating
                    </Link>
                    <Link href="/expense-type" className={menuClass("/expense-type")}>
                      Expense Type
                    </Link>
                  </div>
                )}
              </div>

              {/* TRANSACTIONS */}
              <div>
                <button
                  onClick={() => setTransactionOpen(!transactionOpen)}
                  className={menuButtonClass(transactionOpen)}
                >
                  <div className="flex items-center gap-3">
                    <span>🔄</span>
                    <span>Transactions</span>
                  </div>
                  <span>{transactionOpen ? "−" : "+"}</span>
                </button>

                {transactionOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">
                    <Link href="/lead" className={menuClass("/lead")}>
                      Lead
                    </Link>
                    <Link href="/customers" className={menuClass("/customers")}>
                      Customer
                    </Link>
                    <Link href="/contact" className={menuClass("/contact")}>
                      Contact
                    </Link>
                    <Link href="/note" className={menuClass("/note")}>
                      Note
                    </Link>
                    <Link href="/service-quotation" className={menuClass("/service-quotation")}>
                      Service Quotation
                    </Link>
                    <Link href="/sales-quotation" className={menuClass("/sales-quotation")}>
                      Sales Quotation
                    </Link>
                    <Link href="/expense" className={menuClass("/expense")}>
                      Expense
                    </Link>
                    <Link href="/task" className={menuClass("/task")}>
                      Task
                    </Link>
                    <Link href="/important-date" className={menuClass("/important-date")}>
                      Important Date
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ORDERS */}
        <div className="pt-2">
          <button
            onClick={() => setOrdersOpen(!ordersOpen)}
            className={menuButtonClass(ordersOpen)}
          >
            <div className="flex items-center gap-3">
              <span>📦</span>
              <span>Orders</span>
            </div>
            <span>{ordersOpen ? "−" : "+"}</span>
          </button>

          {ordersOpen && (
            <div className="ml-3 mt-2 space-y-1 border-l border-gray-800 pl-3">
              <Link href="/submitted-orders" className={menuClass("/submitted-orders")}>
                Submitted Orders
              </Link>
            </div>
          )}
        </div>

        {/* REPORTS */}
        {canViewReports && (
          <div className="pt-2">
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className={menuButtonClass(reportsOpen)}
            >
              <div className="flex items-center gap-3">
                <span>📊</span>
                <span>Reports</span>
              </div>
              <span>{reportsOpen ? "−" : "+"}</span>
            </button>

            {reportsOpen && (
              <div className="ml-3 mt-2 space-y-1 border-l border-gray-800 pl-3">
                <Link href="/pending-sales-order-report" className={menuClass("/pending-sales-order-report")}>
                  Pending Sales Report
                </Link>
              </div>
            )}
          </div>
        )}

        {/* SAP REPORTS */}
        <div className="pt-2">
          <button
            onClick={() => setSapReportsOpen(!sapReportsOpen)}
            className={menuButtonClass(sapReportsOpen)}
          >
            <div className="flex items-center gap-3">
              <span>🏭</span>
              <span>SAP Reports</span>
            </div>
            <span>{sapReportsOpen ? "−" : "+"}</span>
          </button>

          {sapReportsOpen && (
            <div className="ml-3 mt-2 space-y-2 border-l border-gray-800 pl-3">
              {/* DISPATCH */}
              <div>
                <button
                  onClick={() => setDispatchReportsOpen(!dispatchReportsOpen)}
                  className={menuButtonClass(dispatchReportsOpen)}
                >
                  <div className="flex items-center gap-3">
                    <span>🚚</span>
                    <span>Dispatch Reports</span>
                  </div>
                  <span>{dispatchReportsOpen ? "−" : "+"}</span>
                </button>

                {dispatchReportsOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">
                    <Link href="/sap-reports/dispatch-dashboard" className={menuClass("/sap-reports/dispatch-dashboard")}>
                      Dispatch Dashboard
                    </Link>
                    <Link href="/sap-reports/pending-dispatch" className={menuClass("/sap-reports/pending-dispatch")}>
                      Pending Dispatch
                    </Link>
                    <Link href="/sap-reports/aging-dispatch" className={menuClass("/sap-reports/aging-dispatch")}>
                      Aging Dispatch
                    </Link>
                  </div>
                )}
              </div>

              {/* SALES */}
              <div>
                <button
                  onClick={() => setSalesReportsOpen(!salesReportsOpen)}
                  className={menuButtonClass(salesReportsOpen)}
                >
                  <div className="flex items-center gap-3">
                    <span>📈</span>
                    <span>Sales Reports</span>
                  </div>
                  <span>{salesReportsOpen ? "−" : "+"}</span>
                </button>

                {salesReportsOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">
                    <Link href="/sap-reports/sales-dashboard" className={menuClass("/sap-reports/sales-dashboard")}>
                      Sales Dashboard
                    </Link>
                    <Link href="/sap-reports/sales-trend" className={menuClass("/sap-reports/sales-trend")}>
                      Sales Trend
                    </Link>
                    <Link href="/sap-reports/customer-sales-analysis" className={menuClass("/sap-reports/customer-sales-analysis")}>
                      Customer Sales Analysis
                    </Link>
                    <Link href="/sap-reports/salesman-performance" className={menuClass("/sap-reports/salesman-performance")}>
                      Salesman Performance
                    </Link>
                  </div>
                )}
              </div>

              {/* INVENTORY */}
              <div>
                <button
                  onClick={() => setInventoryReportsOpen(!inventoryReportsOpen)}
                  className={menuButtonClass(inventoryReportsOpen)}
                >
                  <div className="flex items-center gap-3">
                    <span>📦</span>
                    <span>Inventory Reports</span>
                  </div>
                  <span>{inventoryReportsOpen ? "−" : "+"}</span>
                </button>

                {inventoryReportsOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">
                    <Link href="/sap-reports/inventory-dashboard" className={menuClass("/sap-reports/inventory-dashboard")}>
                      Inventory Dashboard
                    </Link>
                    <Link href="/sap-reports/dead-stock" className={menuClass("/sap-reports/dead-stock")}>
                      Dead Stock
                    </Link>
                    <Link href="/sap-reports/low-stock-alert" className={menuClass("/sap-reports/low-stock-alert")}>
                      Low Stock Alert
                    </Link>
                  </div>
                )}
              </div>

              {/* FINANCIAL */}
              <div>
                <button
                  onClick={() => setFinancialReportsOpen(!financialReportsOpen)}
                  className={menuButtonClass(financialReportsOpen)}
                >
                  <div className="flex items-center gap-3">
                    <span>💰</span>
                    <span>Financial Reports</span>
                  </div>
                  <span>{financialReportsOpen ? "−" : "+"}</span>
                </button>

                {financialReportsOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-gray-800 pl-3">
                    <Link href="/sap-reports/outstanding-dashboard" className={menuClass("/sap-reports/outstanding-dashboard")}>
                      Outstanding Dashboard
                    </Link>
                    <Link href="/sap-reports/customer-outstanding" className={menuClass("/sap-reports/customer-outstanding")}>
                      Customer Outstanding
                    </Link>
                    <Link href="/sap-reports/payment-aging" className={menuClass("/sap-reports/payment-aging")}>
                      Payment Aging
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PRODUCTS */}
        <div className="pt-2">
          <button
            onClick={() => setProductOpen(!productOpen)}
            className={menuButtonClass(productOpen)}
          >
            <div className="flex items-center gap-3">
              <span>🛍️</span>
              <span>Products</span>
            </div>
            <span>{productOpen ? "−" : "+"}</span>
          </button>

          {productOpen && (
            <div className="ml-3 mt-2 space-y-1 border-l border-gray-800 pl-3">
              <Link href="/products" className={menuClass("/products")}>
                Product Catalog
              </Link>
            </div>
          )}
        </div>

        {/* UPLOADS */}
        <div className="pt-2">
          <button
            onClick={() => setUploadsOpen(!uploadsOpen)}
            className={menuButtonClass(uploadsOpen)}
          >
            <div className="flex items-center gap-3">
              <span>⬆️</span>
              <span>Uploads</span>
            </div>
            <span>{uploadsOpen ? "−" : "+"}</span>
          </button>

          {uploadsOpen && (
            <div className="ml-3 mt-2 space-y-1 border-l border-gray-800 pl-3">
              <Link href="/stock-upload" className={menuClass("/stock-upload")}>
                Stock Upload
              </Link>
            </div>
          )}
        </div>

        {/* PURCHASE ORDERS */}
        <div className="pt-2">
          <button
            onClick={() => setPurchaseOpen(!purchaseOpen)}
            className={menuButtonClass(purchaseOpen)}
          >
            <div className="flex items-center gap-3">
              <span>💼</span>
              <span>Purchase Order</span>
            </div>
            <span>{purchaseOpen ? "−" : "+"}</span>
          </button>

          {purchaseOpen && (
            <div className="ml-3 mt-2 space-y-1 border-l border-gray-800 pl-3">
              <Link href="/purchase-orders" className={menuClass("/purchase-orders")}>
                📝 Purchase Order Dashboard
              </Link>
              <Link href="/buyers" className={menuClass("/buyers")}>
                👤 Buyers Registry
              </Link>
              <Link href="/vendors" className={menuClass("/vendors")}>
                🏢 Vendors Registry
              </Link>
              <Link
                href="/receipts"
                className={menuClass("/purchase-orders")}
              >
                📦 Purchase Receipt
              </Link>

              <Link
                href="/vendor-bills"
                className={menuClass("/vendor-bills")}
              >
                📦 Vendor Bills
              </Link>
              <Link
                href="/vendor-debit-notes"
                className={menuClass("/vendor-debit-notes")}
              >
                📦 Vendor Debit Notes
              </Link>
            </div>
          )}
        </div>

        {/* INVENTORY MANAGEMENT */}
        <div className="pt-2">
          <button
            onClick={() => setInventoryOpen(!inventoryOpen)}
            className={menuButtonClass(inventoryOpen)}
          >
            <div className="flex items-center gap-3">
              <span>📦</span>
              <span>Inventory Management</span>
            </div>
            <span>{inventoryOpen ? "−" : "+"}</span>
          </button>

          {inventoryOpen && (
            <div className="ml-3 mt-2 space-y-1 border-l border-gray-800 pl-3">
              <Link href="/inventory-dashboard" className={menuClass("/inventory-dashboard")}>
                Inventory
              </Link>
            </div>
          )}
        </div>

        {/* SAP-ORDERS */}
        <div className="pt-2">
          <button
            onClick={() => setSAPOrderOpen(!sapOrderOpen)}
            className={menuButtonClass(sapOrderOpen)}
          >
            <div className="flex items-center gap-3">
              <span>📦</span>
              <span>SAP Orders</span>
            </div>
            <span>{sapOrderOpen ? "−" : "+"}</span>
          </button>

          {sapOrderOpen && (
            <div className="ml-3 mt-2 space-y-1 border-l border-gray-800 pl-3">
              <Link href="/sap-orders" className={menuClass("/sap-orders")}>
                SAP Order
              </Link>
            </div>
          )}
        </div>

        {/* DOCUMENTS */}
        <div className="pt-2">
          <button
            onClick={() => setDocumentOpen(!documentOpen)}
            className={menuButtonClass(documentOpen)}
          >
            <div className="flex items-center gap-3">
              <span>📁</span>
              <span>Documents</span>
            </div>
            <span>{documentOpen ? "−" : "+"}</span>
          </button>

          {documentOpen && (
            <div className="ml-3 mt-2 space-y-1 border-l border-gray-800 pl-3">
              <Link href="/documents" className={menuClass("/documents")}>
                Document Center
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}