"use client";

import { useState } from "react";

type Listing = {
  id: number;
  title: string;
  dailyFee: number;
  status: "active" | "inactive";
};

export default function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([
    { id: 1, title: "دوربین DSLR Canon", dailyFee: 150000, status: "active" },
    { id: 2, title: "پلی‌استیشن 5", dailyFee: 200000, status: "inactive" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [dailyFee, setDailyFee] = useState("");

  function addListing() {
    if (!title || !dailyFee) return;

    setListings((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        dailyFee: Number(dailyFee),
        status: "active",
      },
    ]);

    setTitle("");
    setDailyFee("");
    setShowForm(false);
  }

  function deleteListing(id: number) {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-100 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800">آگهی‌های من</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition"
        >
          + افزودن آگهی
        </button>
      </div>

      {/* Add Listing Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-lg text-gray-800">آگهی جدید</h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان آگهی"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            value={dailyFee}
            onChange={(e) => setDailyFee(e.target.value)}
            placeholder="قیمت روزانه (تومان)"
            type="number"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-2">
            <button
              onClick={addListing}
              className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
            >
              ثبت آگهی
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* Listings */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-2xl shadow p-4 space-y-3 hover:shadow-xl transition"
          >
            <div className="h-32 bg-gray-200 rounded-lg" />

            <h3 className="font-semibold text-gray-800">{listing.title}</h3>

            <p className="text-sm text-gray-500">
              {listing.dailyFee.toLocaleString()} تومان / روز
            </p>

            <div className="flex justify-between items-center">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  listing.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {listing.status === "active" ? "فعال" : "رزرو شده"}
              </span>

              <button
                onClick={() => deleteListing(listing.id)}
                className="text-sm text-red-600 hover:underline"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
