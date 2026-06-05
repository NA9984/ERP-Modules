"use client";

import {
  useEffect,
  useState,
} from "react";

export default function Navbar() {
  const [userName, setUserName] =
    useState("");

  useEffect(() => {
    const user =
      localStorage.getItem(
        "user"
      );

    if (user) {
      const parsed =
        JSON.parse(user);

      setUserName(
        parsed.name ||
          parsed.userName
      );
    }
  }, []);

  return (
    <div className="h-16 erp-card border-b erp-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* LEFT */}

      <div>
        <h1 className="text-xl font-bold text-gray-900">
          ERP System
        </h1>

        <p className="text-xs text-gray-500 mt-0.5">
          Enterprise Resource
          Planning
        </p>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">
        {/* SEARCH */}

        <div className="hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-72 border erp-border erp-page px-4 py-2.5 rounded-xl text-sm outline-none focus:border-blue-500 focus:erp-card transition"
          />
        </div>

        {/* USER */}

        <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            {userName
              ?.charAt(0)
              ?.toUpperCase() ||
              "U"}
          </div>

          <div className="hidden md:block">
            <div className="text-sm font-semibold text-gray-900 leading-tight">
              {userName ||
                "User"}
            </div>

            <div className="text-xs text-gray-500 mt-0.5">
              Online
            </div>
          </div>
        </div>

        {/* LOGOUT */}

        <button
          onClick={() => {
            localStorage.removeItem(
              "user"
            );

            window.location.href =
              "/login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}