"use client";

import { useState } from "react";

type Report = {
  id: number;
  user: string;
  subject: string;
  status: "pending" | "resolved";
  date: string;
};

export default function AdminReportsPage() {
  const [search, setSearch] = useState("");

  const reports: Report[] = [
    { id: 1, user: "علی محمدی", subject: "گزارش تخلف", status: "pending", date: "2025-12-29" },
    { id: 2, user: "مریم رضایی", subject: "خطای سیستم", status: "resolved", date: "2025-12-28" },
    { id: 3, user: "حسین احمدی", subject: "درخواست حذف آگهی", status: "pending", date: "2025-12-27" },
  ];

  const filteredReports = reports.filter(
    (r) =>
      r.user.includes(search) ||
      r.subject.includes(search) ||
      r.status.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">گزارش‌ها</h1>
        <p className="text-sm text-slate-500">
          مشاهده و مدیریت گزارش‌های ثبت‌شده توسط کاربران
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="جستجو بر اساس نام کاربر، موضوع یا وضعیت"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-right">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-blue-800">کاربر</th>
              <th className="px-4 py-2 text-sm font-medium text-blue-800">موضوع</th>
              <th className="px-4 py-2 text-sm font-medium text-blue-800">وضعیت</th>
              <th className="px-4 py-2 text-sm font-medium text-blue-800">تاریخ</th>
              <th className="px-4 py-2 text-sm font-medium text-blue-800">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="border-b hover:bg-blue-50">
                <td className="px-4 py-2">{report.user}</td>
                <td className="px-4 py-2">{report.subject}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {report.status === "pending" ? "در انتظار" : "رفع شده"}
                  </span>
                </td>
                <td className="px-4 py-2">{report.date}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm">
                    مشاهده
                  </button>
                  <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 text-sm">
                    رفع
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
