"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type Listing = {
  id: number;
  title: string;
  dailyFee: number;
  category: string;
  owner: string;
  status: "available" | "unavailable";
};

export default function ListingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listingOpen, setListingOpen] = useState(false);
  const [category, setCategory] = useState("all");
const [status, setStatus] = useState("all");
const [maxPrice, setMaxPrice] = useState("");



  const listings: Listing[] = [
    {
      id: 1,
      title: "دوربین DSLR Canon",
      dailyFee: 150000,
      category: "دوربین",
      owner: "علی محمدی",
      status: "available",
    },
    {
      id: 2,
      title: "پلی‌استیشن 5",
      dailyFee: 200000,
      category: "کنسول بازی",
      owner: "محمد رضایی",
      status: "unavailable",
    },
  ];

  const MenuItem = ({ label, href }: { label: string; href: string }) => (
    <Link
      href={href}
      className="block w-full text-right px-4 py-2 rounded-lg hover:bg-blue-100 text-blue-900 transition"
    >
      {label}
    </Link>
  );
  const filteredListings = listings.filter((l) => {
  const categoryMatch =
    category === "all" || l.category === category;

  const statusMatch =
    status === "all" || l.status === status;

  const priceMatch =
    !maxPrice || l.dailyFee <= Number(maxPrice);

  return categoryMatch && statusMatch && priceMatch;
});


  return (
    <div className="min-h-screen bg-blue-50 relative">
      {/* Trigger bar */}
      <div
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-1/2 right-0 z-50 h-32 w-6 bg-gradient-to-b from-blue-700 to-blue-800 rounded-l-full cursor-pointer flex items-center justify-center shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
        title="باز کردن منو"
      >
        <ChevronRightIcon
          className={`w-5 h-5 text-white transform transition-transform duration-300 ${
            sidebarOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="p-6 space-y-2">
          <MenuItem label="پروفایل" href="/dashboard/users/profile" />

          <div>
            <button
              onClick={() => setListingOpen(!listingOpen)}
              className="w-full text-right px-4 py-2 rounded-lg transition hover:bg-blue-100 text-blue-900 font-medium flex justify-between items-center"
            >
              آگهی‌های من
              <span
                className={`transform transition-transform ${
                  listingOpen ? "rotate-90" : ""
                }`}
              >
                ▶
              </span>
            </button>
            {listingOpen && (
              <div className="mt-1 pl-4 space-y-1">
                <MenuItem
                  label="آگهی‌های فعال"
                  href="/dashboard/users/listings/active"
                />
                <MenuItem
                  label="آگهی‌های منقضی"
                  href="/dashboard/users/listings/expired"
                />
              </div>
            )}
          </div>

          <MenuItem label="درخواست‌ها" href="/dashboard/users/loans" />
          <MenuItem label="پیام‌ها" href="/dashboard/users/messages" />
          <MenuItem label="آگهی‌ها" href="/listings" />
          <MenuItem label="تنظیمات" href="/settings" />
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">آگهی‌ها</h1>
        {/* Filters */}
<div className="bg-white rounded-2xl shadow-md p-5">
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Category */}
    <div>
      <label className="block text-sm font-medium text-blue-900 mb-1">
        دسته‌بندی
      </label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="all">همه</option>
        <option value="دوربین">دوربین</option>
        <option value="کنسول بازی">کنسول بازی</option>
      </select>
    </div>

    {/* Status */}
    <div>
      <label className="block text-sm font-medium text-blue-900 mb-1">
        وضعیت
      </label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="all">همه</option>
        <option value="available">در دسترس</option>
        <option value="unavailable">ناموجود</option>
      </select>
    </div>

    {/* Max Price */}
    <div>
      <label className="block text-sm font-medium text-blue-900 mb-1">
        حداکثر قیمت (تومان)
      </label>
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="مثلاً 200000"
        className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    {/* Reset */}
    <div className="flex items-end">
      <button
        onClick={() => {
          setCategory("all");
          setStatus("all");
          setMaxPrice("");
        }}
        className="w-full px-4 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
      >
        پاک کردن فیلترها
      </button>
    </div>
  </div>
</div>


        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* تصویر */}
              <div className="w-full md:w-48 h-40 bg-gray-200 flex-shrink-0" />

              {/* اطلاعات */}
              <div className="flex-1 p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex-1 text-right space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    دسته‌بندی: {listing.category}
                  </p>
                  <p className="text-sm text-gray-500">مالک: {listing.owner}</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="font-bold text-blue-700">
                    {listing.dailyFee.toLocaleString()} تومان / روز
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      listing.status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {listing.status === "available" ? "در دسترس" : "ناموجود"}
                  </span>

                  <button className="mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition">
                    مشاهده جزئیات
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 