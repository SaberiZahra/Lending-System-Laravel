"use client";


import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false); // سایدبار
  const [listingOpen, setListingOpen] = useState(false); // آگهی‌های من
  const pathname = usePathname();

  const MenuItem = ({ label, href }: { label: string; href: string }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`block w-full text-right px-4 py-2 rounded-lg transition
          ${active ? "bg-blue-700 text-white" : "hover:bg-blue-100 text-blue-900"}`}
      >
        {label}
      </Link>
    );
  };
  

  return (
    <div className="min-h-screen bg-blue-50 relative">
      
      {/* Trigger bar */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed top-1/2 right-0 z-50 h-24 w-6 bg-gradient-to-b from-blue-700 to-blue-800 rounded-l-full cursor-pointer flex items-center justify-center shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
        title="باز کردن منو"
      >
        <ChevronRightIcon
          className={`w-5 h-5 text-white transform transition-transform ${
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
        <nav className="p-6 space-y-2">
          <MenuItem label="پروفایل" href="/dashboard/users/profile" />

          {/* آگهی‌های من کشویی */}
          <div>
            <button
              onClick={() => setListingOpen(!listingOpen)}
              className="w-full text-right px-4 py-2 rounded-lg transition hover:bg-blue-100 text-blue-900 font-medium flex justify-between items-center"
            >
              آگهی‌های من
              <span className={`transform transition-transform ${listingOpen ? "rotate-90" : ""}`}>▶</span>
            </button>

            {listingOpen && (
              <div className="mt-1 pl-4 space-y-1">
                <MenuItem label="آگهی‌های فعال" href="/dashboard/users/listings/active" />
                <MenuItem label="آگهی‌های منقضی" href="/dashboard/users/listings/expired" />
              </div>
            )}
          </div>

          <MenuItem label="درخواست‌ها" href="/dashboard/users/loans" />
          <MenuItem label="پیام‌ها" href="/dashboard/users/messages" />
          <MenuItem label="آگهی ها" href="/listings" />
          <MenuItem label="تنظیمات" href="/settings" />
        </nav>
      </aside>

      

      {/* Main content */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
