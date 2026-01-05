"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const MenuItem = ({
    href,
    label,
  }: {
    href: string;
    label: string;
  }) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`block w-full text-right px-4 py-2 rounded-lg transition
          ${
            active
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100 text-blue-900"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 relative">
      {/* Trigger bar (لبه کناری مثل پروفایل یوزر) */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed top-1/2 right-0 z-50 h-28 w-6
                   bg-gradient-to-b from-blue-700 to-blue-800
                   rounded-l-full cursor-pointer flex items-center justify-center
                   shadow-lg hover:from-blue-600 hover:to-blue-700 transition"
        title="منوی ادمین"
      >
        <ChevronRightIcon
          className={`w-5 h-5 text-white transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl
          transition-transform duration-300 z-40
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-900">
            پنل ادمین
          </h2>
          <p className="text-sm text-blue-500 mt-1">
            مدیریت سیستم
          </p>
        </div>

        <nav className="p-6 space-y-2">
          <MenuItem href="/dashboard/admin" label="پروفایل ادمین" />
          <MenuItem href="/dashboard/admin/users" label="کاربران" />
          <MenuItem href="/dashboard/admin/reports" label="گزارش‌ها" />
          <MenuItem href="/dashboard/admin/messages" label="پیام‌ها" />
        </nav>
      </aside>

      {/* Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
