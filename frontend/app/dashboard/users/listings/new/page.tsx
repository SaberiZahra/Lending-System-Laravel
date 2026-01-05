"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { itemsAPI, listingsAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

type Item = {
  id: number;
  title: string;
  description?: string;
};

export default function NewListingPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    item_id: "",
    title: "",
    description: "",
    daily_fee: "",
    deposit_amount: "",
    available_from: "",
    available_until: "",
    status: "active",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await itemsAPI.getAll();
        setItems(data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "خطا در دریافت کالاها");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.item_id || !formData.title || !formData.daily_fee || !formData.deposit_amount || !formData.available_from || !formData.available_until) {
      setError("لطفا تمام فیلدهای الزامی را پر کنید");
      return;
    }

    try {
      setSubmitting(true);
      await listingsAPI.create({
        item_id: parseInt(formData.item_id),
        title: formData.title,
        description: formData.description,
        daily_fee: parseFloat(formData.daily_fee),
        deposit_amount: parseFloat(formData.deposit_amount),
        available_from: formData.available_from,
        available_until: formData.available_until,
        status: formData.status,
      });
      router.push("/dashboard/users/listings");
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در ایجاد آگهی");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-blue-100 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800">ایجاد آگهی جدید</h1>
        <Link
          href="/dashboard/users/listings"
          className="px-4 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-500 transition"
        >
          بازگشت
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            انتخاب کالا <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.item_id}
            onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">انتخاب کنید...</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          {items.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              ابتدا باید یک کالا ایجاد کنید.{" "}
              <Link href="/dashboard/items/new" className="text-blue-600 hover:underline">
                ایجاد کالا
              </Link>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            عنوان آگهی <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            توضیحات
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              هزینه روزانه (تومان) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.daily_fee}
              onChange={(e) => setFormData({ ...formData, daily_fee: e.target.value })}
              min="0"
              step="1000"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              مبلغ ضمانت (تومان) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.deposit_amount}
              onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
              min="0"
              step="10000"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              از تاریخ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.available_from}
              onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تا تاریخ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.available_until}
              onChange={(e) => setFormData({ ...formData, available_until: e.target.value })}
              min={formData.available_from || new Date().toISOString().split("T")[0]}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            وضعیت
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
          >
            <option value="active">فعال</option>
            <option value="paused">متوقف</option>
            <option value="expired">منقضی</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "در حال ایجاد..." : "ایجاد آگهی"}
          </button>
          <Link
            href="/dashboard/users/listings"
            className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            انصراف
          </Link>
        </div>
      </form>
    </div>
  );
}

