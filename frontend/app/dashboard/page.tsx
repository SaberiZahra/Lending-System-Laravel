"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { authAPI, listingsAPI, loansAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

type DashboardStats = {
  totalListings: number;
  activeListings: number;
  totalLoans: number;
  pendingLoans: number;
};

type Loan = {
  id: number;
  status: string;
  request_date: string;
  start_date: string | null;
  end_date: string | null;
  listing: {
    id: number;
    title: string;
    item: {
      id: number;
      title: string;
      owner_id?: number;
      owner?: {
        id: number;
        full_name: string;
        username: string;
      };
    };
  };
  borrower?: {
    id: number;
    full_name: string;
    username: string;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    totalLoans: 0,
    pendingLoans: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [adminLoans, setAdminLoans] = useState<Loan[]>([]);
  const isAdmin = user?.role === 1;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, listingsData, myLoansData, allLoansData] =
          await Promise.all([
            authAPI.me(),
            listingsAPI.getAll().catch(() => []),
            loansAPI.getMyLoans().catch(() => []),
            loansAPI.getAll().catch(() => []),
          ]);

        setUser(userData);
        setLoans(myLoansData || []);
        setAdminLoans(allLoansData || []);

        const activeListings = Array.isArray(listingsData)
          ? listingsData.filter((l: any) => l.status === "active")
          : [];
        const pendingLoans = Array.isArray(myLoansData)
          ? myLoansData.filter((l: any) => l.status === "requested")
          : [];

        setStats({
          totalListings: Array.isArray(listingsData) ? listingsData.length : 0,
          activeListings: activeListings.length,
          totalLoans: Array.isArray(myLoansData) ? myLoansData.length : 0,
          pendingLoans: pendingLoans.length,
        });
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // ---------- Derived data for user ----------
  const myId = user?.id;

  const myLoanRequests = loans.filter(
    (loan) => loan.borrower && loan.borrower.id === myId
  );

  const incomingRequests = loans.filter(
    (loan) =>
      loan.listing?.item?.owner &&
      loan.listing.item.owner.id === myId &&
      loan.borrower &&
      loan.borrower.id !== myId
  );

  const isActiveStatus = (status: string) =>
    ["requested", "approved", "borrowed"].includes(status);

  const myBorrowedActive = myLoanRequests.filter((l) =>
    isActiveStatus(l.status)
  );
  const myBorrowedHistory = myLoanRequests.filter(
    (l) => !isActiveStatus(l.status)
  );

  const lentActive = incomingRequests.filter((l) => isActiveStatus(l.status));
  const lentHistory = incomingRequests.filter((l) => !isActiveStatus(l.status));

  // ---------- Derived data for admin ----------
  const adminPendingLoans = adminLoans.filter(
    (l) => l.status === "requested"
  );
  const adminActiveLoans = adminLoans.filter((l) =>
    ["approved", "borrowed"].includes(l.status)
  );
  const adminPastLoans = adminLoans.filter(
    (l) => !["requested", "approved", "borrowed"].includes(l.status)
  );

  const formatDate = (value: string | null) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("fa-IR");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">داشبورد</h1>
          {user && (
            <div className="flex items-center justify-between">
              <p className="text-blue-100">
                خوش آمدید، {user.full_name || user.username}!
              </p>
              {isAdmin && (
                <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold">
                  مدیر سیستم
                </span>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="کل آگهی‌ها"
            value={stats.totalListings}
            icon="📋"
            link="/dashboard/users/listings"
          />
          <StatCard
            title="آگهی‌های فعال"
            value={stats.activeListings}
            icon="✅"
            link="/dashboard/users/listings"
          />
          <StatCard
            title="کل درخواست‌ها"
            value={stats.totalLoans}
            icon="📦"
            link="/dashboard/users/loans"
          />
          <StatCard
            title="درخواست‌های در انتظار"
            value={stats.pendingLoans}
            icon="⏳"
            link="/dashboard/users/loans"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">دسترسی سریع</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/users/listings"
              className="p-4 border rounded-xl hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold mb-2">
                {isAdmin ? "همه آگهی‌ها" : "مدیریت آگهی‌ها"}
              </h3>
              <p className="text-sm text-gray-600">
                {isAdmin ? "مشاهده و مدیریت تمام آگهی‌ها" : "مشاهده و مدیریت آگهی‌های شما"}
              </p>
            </Link>
            <Link
              href="/dashboard/users/loans"
              className="p-4 border rounded-xl hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold mb-2">مشاهده درخواست‌ها</h3>
              <p className="text-sm text-gray-600">
                بررسی وضعیت درخواست‌های امانت
              </p>
            </Link>
            <Link
              href="/dashboard/users/profile"
              className="p-4 border rounded-xl hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold mb-2">ویرایش پروفایل</h3>
              <p className="text-sm text-gray-600">
                به‌روزرسانی اطلاعات پروفایل
              </p>
            </Link>
            {!isAdmin && (
              <Link
                href="/dashboard/users/messages"
                className="p-4 border rounded-xl hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold mb-2">چت با ادمین</h3>
                <p className="text-sm text-gray-600">
                  ارسال پیام و گفتگو با پشتیبانی
                </p>
              </Link>
            )}
            {isAdmin && (
              <>
                <Link
                  href="/dashboard/admin/categories"
                  className="p-4 border rounded-xl hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold mb-2">مدیریت دسته‌بندی‌ها</h3>
                  <p className="text-sm text-gray-600">
                    افزودن و ویرایش دسته‌بندی‌ها
                  </p>
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className="p-4 border rounded-xl hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold mb-2">مدیریت کاربران</h3>
                  <p className="text-sm text-gray-600">
                    مشاهده و مدیریت کاربران
                  </p>
                </Link>
                <Link
                  href="/dashboard/admin/messages"
                  className="p-4 border rounded-xl hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold mb-2">مدیریت پیام‌ها</h3>
                  <p className="text-sm text-gray-600">
                    مشاهده و پاسخ به همه چت‌ها
                  </p>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* User loan summary sections */}
        {!isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* My requests */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">درخواست‌های من برای امانت</h2>
              {myLoanRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">درخواستی ثبت نکرده‌اید.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {myLoanRequests.slice(0, 5).map((l) => (
                    <li
                      key={l.id}
                      className="flex justify-between items-center border rounded-xl px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">
                          {l.listing?.title || "آگهی"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          از {formatDate(l.start_date)} تا {formatDate(l.end_date)}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                        {l.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 text-left">
                <Link
                  href="/dashboard/users/loans"
                  className="text-blue-600 text-xs hover:underline"
                >
                  مشاهده همه
                </Link>
              </div>
            </div>

            {/* Requests on my items */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">درخواست‌ها برای وسایل من</h2>
              {incomingRequests.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  درخواستی برای وسایل شما ثبت نشده است.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {incomingRequests.slice(0, 5).map((l) => (
                    <li
                      key={l.id}
                      className="flex justify-between items-center border rounded-xl px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">
                          {l.listing?.title || "آگهی"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          درخواست توسط {l.borrower?.full_name || l.borrower?.username || "کاربر"}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                        {l.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 text-left">
                <Link
                  href="/dashboard/users/loans"
                  className="text-blue-600 text-xs hover:underline"
                >
                  مدیریت درخواست‌ها
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Admin loan overview */}
        {isAdmin && (
          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">درخواست‌های امانت در انتظار تأیید</h2>
              {adminPendingLoans.length === 0 ? (
                <p className="text-gray-500 text-sm">درخواست در انتظاری وجود ندارد.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {adminPendingLoans.slice(0, 8).map((l) => (
                    <li
                      key={l.id}
                      className="flex justify-between items-center border rounded-xl px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">
                          {l.listing?.title || "آگهی"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          از {l.borrower?.full_name || l.borrower?.username || "کاربر"}{" "}
                          برای {l.listing?.item?.title}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                        {formatDate(l.request_date)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 text-left">
                <Link
                  href="/dashboard/users/loans"
                  className="text-blue-600 text-xs hover:underline"
                >
                  مدیریت کامل درخواست‌ها
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">امانت‌های فعال</h2>
              {adminActiveLoans.length === 0 ? (
                <p className="text-gray-500 text-sm">امانتی در حال حاضر فعال نیست.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {adminActiveLoans.slice(0, 8).map((l) => (
                    <li
                      key={l.id}
                      className="flex justify-between items-center border rounded-xl px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">
                          {l.listing?.title || "آگهی"}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          از {l.borrower?.full_name || l.borrower?.username || "کاربر"}{" "}
                          تا {formatDate(l.end_date)}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                        {l.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  link,
}: {
  title: string;
  value: number;
  icon: string;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Link>
  );
}
