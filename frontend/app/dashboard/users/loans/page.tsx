"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loansAPI, authAPI } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { Loan } from "@/lib/api";

export default function LoansPage() {
  const router = useRouter();

  const [allLoans, setAllLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] =
      useState<"my-requests" | "incoming">("my-requests");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await authAPI.me();
        const loansData = await loansAPI.getMyLoans();

        setUser(userData);
        setAllLoans(loansData || []);
      } catch (err: any) {
        alert("خطا در بارگذاری درخواست‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const currentUserId = user?.id;

  // توابع تأیید و رد درخواست (فقط برای مالک کالا)
  const handleApprove = async (loanId: number) => {
    if (!confirm("آیا از تأیید این درخواست مطمئن هستید؟")) return;

    try {
      await loansAPI.approve(loanId);
      setAllLoans((prev) =>
          prev.map((loan) =>
              loan.id === loanId ? { ...loan, status: "approved" } : loan
          )
      );
    } catch (err: any) {
      alert("تأیید درخواست انجام نشد.");
    }
  };

  const handleReject = async (loanId: number) => {
    if (!confirm("آیا از رد این درخواست مطمئن هستید؟")) return;

    try {
      await loansAPI.reject(loanId);
      setAllLoans((prev) =>
          prev.map((loan) =>
              loan.id === loanId ? { ...loan, status: "rejected" } : loan
          )
      );
    } catch (err: any) {
      alert("رد درخواست انجام نشد.");
    }
  };

  /* =====================
     Helpers
  ===================== */

  const formatDate = (date?: string) =>
      date ? new Date(date).toLocaleDateString("fa-IR") : "—";

  const getImageUrl = (images_json?: string | null) => {
    if (!images_json) return null;
    try {
      const images = typeof images_json === "string" ? JSON.parse(images_json) : images_json;
      return images?.[0] ?? null;
    } catch {
      return null;
    }
  };

  const getOwnerName = (loan: Loan) =>
      loan.listing?.item?.owner?.full_name ||
      loan.listing?.item?.owner?.username ||
      "نامشخص";

  const getBorrowerName = (loan: Loan) =>
      loan.borrower?.full_name || loan.borrower?.username || "نامشخص";

  // تنظیمات وضعیت
  const statusConfig = {
    requested: { label: "در انتظار تأیید", color: "bg-amber-100 text-amber-700", icon: "⏳" },
    approved: { label: "تأیید شده", color: "bg-blue-100 text-blue-700", icon: "✅" },
    borrowed: { label: "امانت داده شده", color: "bg-green-100 text-green-700", icon: "📦" },
    returned: { label: "بازگردانده شده", color: "bg-gray-100 text-gray-700", icon: "↩️" },
    rejected: { label: "رد شده", color: "bg-red-100 text-red-700", icon: "❌" },
    cancelled: { label: "لغو شده", color: "bg-purple-100 text-purple-700", icon: "🚫" },
  };

  const getStatus = (status: string) =>
      statusConfig[status as keyof typeof statusConfig] || statusConfig.requested;

  /* =====================
     Filters
  ===================== */

  const myRequests = allLoans.filter(
      (loan) => loan.borrower?.id === currentUserId
  );

  const incomingRequests = allLoans.filter(
      (loan) => loan.listing?.item?.owner_id === currentUserId
  );

  /* =====================
     Render Single Loan Card
  ===================== */

  const renderLoanCard = (loan: Loan) => {
    if (!loan.listing || !loan.listing.item) return null;

    const imageUrl = getImageUrl(loan.listing.item.images_json);
    const status = getStatus(loan.status);
    const isOwner = loan.listing.item.owner_id === currentUserId;

    return (
        <div
            key={loan.id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* تصویر */}
            <div className="md:w-40 flex-shrink-0">
              <div className="h-40 rounded-2xl overflow-hidden shadow">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={loan.listing.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                      بدون تصویر
                    </div>
                )}
              </div>
            </div>

            {/* اطلاعات */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {loan.listing.title}
                  </h3>
                  <p className="text-base text-gray-600">
                    کالا: <span className="font-medium">{loan.listing.item.title}</span>
                  </p>

                  {isOwner ? (
                      <p className="text-sm text-gray-500">
                        درخواست‌کننده: <span className="font-medium">{getBorrowerName(loan)}</span>
                      </p>
                  ) : (
                      <p className="text-sm text-gray-500">
                        مالک: <span className="font-medium">{getOwnerName(loan)}</span>
                      </p>
                  )}
                </div>

                {/* وضعیت */}
                <span className={`px-5 py-2 rounded-full text-base font-medium ${status.color}`}>
                {status.icon} {status.label}
              </span>
              </div>

              <div className="flex flex-wrap gap-6 text-sm bg-gray-50 p-4 rounded-2xl">
                <div>
                  <span className="text-gray-600 font-medium">بازه امانت:</span>{" "}
                  <span className="font-semibold">
                  {formatDate(loan.start_date)} تا {formatDate(loan.end_date)}
                </span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">تاریخ درخواست:</span>{" "}
                  <span className="font-semibold">{formatDate(loan.request_date)}</span>
                </div>
              </div>

              {/* دکمه‌های تأیید/رد فقط برای مالک و فقط وقتی در انتظار باشه */}
              {isOwner && loan.status === "requested" && (
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => handleApprove(loan.id)}
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition shadow"
                    >
                      ✅ تأیید درخواست
                    </button>
                    <button
                        onClick={() => handleReject(loan.id)}
                        className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl hover:from-red-600 hover:to-rose-700 transition shadow"
                    >
                      ❌ رد درخواست
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>
    );
  };

  /* =====================
     Render Tab Content
  ===================== */

  const renderTabContent = () => {
    if (loading) {
      return <p className="text-center text-xl py-20">در حال بارگذاری...</p>;
    }

    const loansToShow = activeTab === "my-requests" ? myRequests : incomingRequests;
    const title = activeTab === "my-requests" ? "درخواست‌های من" : "درخواست‌های دریافتی";

    if (loansToShow.length === 0) {
      return (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <p className="text-xl text-gray-600">هیچ درخواستی وجود ندارد</p>
          </div>
      );
    }

    return (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {loansToShow.map(renderLoanCard)}
        </div>
    );
  };

  return (
      <div className="min-h-screen bg-gray-50">
        {/* هدر */}
        <div
            dir="rtl"
            className="bg-gradient-to-r from-indigo-600 to-blue-600 p-10 rounded-3xl mx-6 my-10 text-white"
        >
          <h1 className="text-4xl font-bold">درخواست‌های امانت</h1>
          <p className="text-blue-100 mt-2">مدیریت درخواست‌های شما</p>
        </div>

        <div dir="rtl" className="max-w-6xl mx-auto px-6 pb-20">
          {/* تب‌ها */}
          <div className="flex gap-8 border-b mb-10 overflow-x-auto">
            <button
                onClick={() => setActiveTab("my-requests")}
                className={`pb-4 px-2 text-lg font-semibold border-b-4 transition whitespace-nowrap ${
                    activeTab === "my-requests"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-600"
                }`}
            >
              درخواست‌های من ({myRequests.length})
            </button>
            <button
                onClick={() => setActiveTab("incoming")}
                className={`pb-4 px-2 text-lg font-semibold border-b-4 transition whitespace-nowrap ${
                    activeTab === "incoming"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-600"
                }`}
            >
              درخواست‌های دریافتی ({incomingRequests.length})
            </button>
          </div>

          {/* محتوای تب */}
          {renderTabContent()}
        </div>
      </div>
  );
}