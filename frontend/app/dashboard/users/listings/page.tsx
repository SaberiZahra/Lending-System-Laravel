"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { listingsAPI, authAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

type Listing = {
  id: number;
  title: string;
  daily_fee: number;
  status: string;
  item: {
    id: number;
    title: string;
    images_json?: string | null;
  };
};

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [listingsData, userData] = await Promise.all([
          listingsAPI.getAll(),
          authAPI.me().catch(() => null),
        ]);
        setListings(listingsData || []);
        setUser(userData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const isAdmin = user?.role === 1;

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await listingsAPI.delete(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete listing");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-100 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800">
          {isAdmin ? "همه آگهی‌ها" : "آگهی‌های من"}
        </h1>
        {!isAdmin && (
          <Link
            href="/dashboard/users/listings/new"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            + افزودن آگهی جدید
          </Link>
        )}
      </div>

      {/* Listings */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-gray-600 mb-4">
            {isAdmin ? "هیچ آگهی‌ای یافت نشد" : "هنوز آگهی‌ای ثبت نکرده‌اید"}
          </p>
          {!isAdmin && (
            <Link
              href="/dashboard/users/listings/new"
              className="text-blue-600 hover:underline"
            >
              ایجاد اولین آگهی
            </Link>
          )}
        </div>
      ) : (
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function ListingCard({
  listing,
  onDelete,
}: {
  listing: Listing;
  onDelete: (id: number) => void;
}) {
  const images = listing.item?.images_json
    ? (typeof listing.item.images_json === "string"
        ? JSON.parse(listing.item.images_json)
        : listing.item.images_json)
    : [];
  const imageUrl =
    images.length > 0
      ? images[0]
      : "https://via.placeholder.com/400x300/cccccc/000000?text=No+Image";

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3 hover:shadow-xl transition">
      <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-semibold text-gray-800">{listing.title}</h3>

      <p className="text-sm text-gray-500">
        {listing.daily_fee.toLocaleString()} تومان / روز
      </p>

      <div className="flex justify-between items-center">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            listing.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {listing.status === "active" ? "فعال" : "غیرفعال"}
        </span>

        <div className="flex gap-2">
          <Link
            href={`/listings/${listing.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            مشاهده
          </Link>
          <button
            onClick={() => onDelete(listing.id)}
            className="text-sm text-red-600 hover:underline"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
