"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { profileAPI, listingsAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

type User = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone?: string;
  trust_score?: number;
  status: string;
  created_at: string;
  items?: any[];
};

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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, listingsData] = await Promise.all([
          profileAPI.get(),
          listingsAPI.getAll(),
        ]);

        setUser(userData);
        setListings(listingsData || []);
        setEditData({
          full_name: userData.full_name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedUser = await profileAPI.update(editData);
      setUser(updatedUser);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در به‌روزرسانی پروفایل");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Failed to load profile"}</p>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold">
            {user.full_name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{user.full_name}</h1>
            <p className="text-slate-500">@{user.username}</p>

            <div className="mt-2 flex items-center gap-2">
              {user.trust_score && (
                <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                  امتیاز اعتماد: {user.trust_score}
                </span>
              )}
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {user.status === "active" ? "فعال" : "غیرفعال"}
              </span>
            </div>
          </div>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            ویرایش پروفایل
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "ذخیره"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditData({
                  full_name: user.full_name || "",
                  email: user.email || "",
                  phone: user.phone || "",
                  address: user.address || "",
                });
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
            >
              انصراف
            </button>
          </div>
        )}
      </section>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* User Info */}
      <section className="grid md:grid-cols-2 gap-4">
        {editing ? (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                نام کامل
              </label>
              <input
                type="text"
                value={editData.full_name}
                onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                شماره تماس
              </label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                آدرس
              </label>
              <textarea
                value={editData.address}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                rows={3}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        ) : (
          <>
            <InfoItem label="ایمیل" value={user.email} />
            <InfoItem label="شماره تماس" value={user.phone || "وارد نشده"} />
            <InfoItem label="آدرس" value={user.address || "وارد نشده"} />
            <InfoItem
              label="تاریخ عضویت"
              value={formatDate(user.created_at)}
            />
          </>
        )}
      </section>

      {/* My Listings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">آگهی‌های من</h2>

        {listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-gray-600 mb-4">هنوز آگهی‌ای ثبت نکرده‌اید</p>
            <Link
              href="/dashboard/users/listings"
              className="text-blue-600 hover:underline"
            >
              ایجاد اولین آگهی
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.slice(0, 6).map((listing) => (
              <MyListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}

function MyListingCard({ listing }: { listing: Listing }) {
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
    <Link
      href={`/listings/${listing.id}`}
      className="bg-white rounded-xl shadow p-4 space-y-2 hover:shadow-lg transition"
    >
      <div className="h-32 rounded-lg bg-slate-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-semibold">{listing.title}</h3>

      <p className="text-sm text-slate-500">
        روزانه: {listing.daily_fee.toLocaleString()} تومان
      </p>

      <div className="flex justify-between items-center">
        <span
          className={`text-xs px-2 py-1 rounded ${
            listing.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {listing.status === "active" ? "فعال" : "غیرفعال"}
        </span>

        <span className="text-sm text-blue-600 hover:underline">مشاهده</span>
      </div>
    </Link>
  );
}
