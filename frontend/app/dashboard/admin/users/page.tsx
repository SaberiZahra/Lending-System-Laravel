"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminAPI, authAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

type User = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone?: string;
  role: number;
  status: string;
  trust_score?: number;
  items_count?: number;
  loans_count?: number;
  created_at: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
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
        const [usersData, userData] = await Promise.all([
          adminAPI.getUsers(),
          authAPI.me().catch(() => null),
        ]);
        setUsers(usersData?.data || usersData || []);
        setUser(userData);
        
        if (userData?.role !== 1) {
          router.push("/dashboard");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "خطا در دریافت کاربران");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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

  if (user?.role !== 1) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-blue-100 p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-800">مدیریت کاربران</h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-500 transition"
        >
          بازگشت
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نام کاربری</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ایمیل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نقش</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">آگهی‌ها</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">درخواست‌ها</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">امتیاز</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {u.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    @{u.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      u.role === 1 ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {u.role === 1 ? "مدیر" : "کاربر"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      u.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {u.status === "active" ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.items_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.loans_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.trust_score?.toFixed(1) || "0.0"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
