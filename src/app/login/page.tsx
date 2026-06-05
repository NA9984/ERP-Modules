"use client";

import {
  useState,
} from "react";

import {
  loginUser,
} from "../services/authService";

import {
  getUserByUserName,
} from "../services/userService";

export default function LoginPage() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* BACKGROUND GLOW */}

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>

      {/* LOGIN CARD */}

      <div className="relative z-10 w-full max-w-md">
        {/* LOGO */}

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl">
            ERP
          </div>

          <h1 className="text-4xl font-black text-white mt-5 tracking-tight">
            ERP System
          </h1>

          <p className="text-blue-100 text-sm mt-2">
            Enterprise Customer
            Management
          </p>
        </div>

        {/* FORM */}

        <div className="backdrop-blur-2xl erp-card/10 border border-white/10 rounded-3xl p-7 shadow-2xl">
          <div className="space-y-5">
            {/* USERNAME */}

            <div>
              <label className="text-sm font-semibold text-blue-100 block mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter username"
                className="w-full erp-card/10 border border-white/10 text-white placeholder:text-blue-200 px-5 py-4 rounded-2xl outline-none focus:border-blue-400 focus:erp-card/15 transition"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="text-sm font-semibold text-blue-100 block mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                className="w-full erp-card/10 border border-white/10 text-white placeholder:text-blue-200 px-5 py-4 rounded-2xl outline-none focus:border-blue-400 focus:erp-card/15 transition"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />
            </div>

            {/* LOGIN BUTTON */}

            <button
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);

                  const loginResponse =
                    await loginUser(
                      username,
                      password
                    );

                  if (
                    loginResponse.result ===
                    1
                  ) {
                    const userData =
                      await getUserByUserName(
                        username
                      );

                    const user = {
                      id: userData.id,

                      userName:
                        userData.userName,

                      name: userData.name,

                      role:
                        userData.roleName,
                    };

                    localStorage.setItem(
                      "user",
                      JSON.stringify(
                        user
                      )
                    );

                    window.location.href =
                      "/";
                  } else {
                    alert(
                      loginResponse.description
                    );
                  }
                } catch (error) {
                  console.error(
                    error
                  );

                  alert(
                    "API Error"
                  );
                } finally {
                  setLoading(
                    false
                  );
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please Wait..."
                : "Login"}
            </button>
          </div>

          {/* FOOTER */}

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-blue-200">
              Secure Enterprise CRM
              Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}