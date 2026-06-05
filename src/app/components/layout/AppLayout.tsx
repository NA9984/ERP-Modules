"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

type UserType = {
  id: string;
  userName: string;
  name: string;
  role: string;
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<UserType | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (!storedUser) {
        window.location.href =
          "/login";

        return;
      }

      const parsedUser =
        JSON.parse(
          storedUser
        );

      if (
        !parsedUser ||
        !parsedUser.role
      ) {
        localStorage.removeItem(
          "user"
        );

        window.location.href =
          "/login";

        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error(error);

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
     <div
  className="h-screen flex items-center justify-center"
  style={{
    background: "var(--bg)",
    color: "var(--text)",
  }}
>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

          <p
  className="mt-4 font-medium"
  style={{
    color: "var(--text)",
  }}
>
            Loading ERP...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
  <div
    className="h-screen flex overflow-hidden transition-all duration-300"
    style={{
      background: "var(--bg)",
      color: "var(--text)",
    }}
  >
    {/* SIDEBAR */}

    <div className="hidden lg:block">
      <Sidebar role={user.role} />
    </div>

    {/* MAIN */}

    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar />

      <main
        className="flex-1 overflow-auto p-4 md:p-5 lg:p-6 transition-all duration-300"
        style={{
          background: "var(--bg)",
          color: "var(--text)",
        }}
      >
        <div className="max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  </div>
)};