"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loansAPI } from "@/lib/api";
import { isAuthenticated, getUser } from "@/lib/auth";

type Loan = {
  id: number;
  status: string;
  start_date: string;
  end_date: string;
  request_date: string;
  listing: {
    id: number;
    title: string;
    item: {
      id: number;
      title: string;
      images_json?: string | null;
    };
  };
  borrower?: {
    id: number;
    full_name: string;
    username: string;
  };
};

export default function LoansPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchLoans = async () => {
      try {
        setLoading(true);
        const data = await loansAPI.getMyLoans();
        setLoans(data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load loans");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [router]);

  const handleApprove = async (loanId: number) => {
    if (!confirm("Are you sure you want to approve this loan?")) return;

    try {
      await loansAPI.approve(loanId);
      setLoans((prev) =>
        prev.map((loan) =>
          loan.id === loanId ? { ...loan, status: "approved" } : loan
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve loan");
    }
  };

  const handleReject = async (loanId: number) => {
    if (!confirm("Are you sure you want to reject this loan?")) return;

    try {
      await loansAPI.reject(loanId);
      setLoans((prev) =>
        prev.map((loan) =>
          loan.id === loanId ? { ...loan, status: "rejected" } : loan
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reject loan");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loans...</p>
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
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-bold">درخواست‌های امانت</h1>
        <p className="text-slate-500 mt-1">
          وضعیت درخواست‌ها و امانت‌های شما
        </p>
      </header>

      {/* Loans List */}
      {loans.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-gray-600">درخواستی یافت نشد</p>
        </div>
      ) : (
        <section className="space-y-4">
          {loans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              currentUserId={user?.id}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function LoanCard({
  loan,
  currentUserId,
  onApprove,
  onReject,
}: {
  loan: Loan;
  currentUserId?: number;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const statusMap: {
    [key: string]: { label: string; className: string };
  } = {
    requested: {
      label: "در انتظار تأیید",
      className: "bg-amber-100 text-amber-700",
    },
    approved: {
      label: "تأیید شده",
      className: "bg-blue-100 text-blue-700",
    },
    borrowed: {
      label: "امانت گرفته شده",
      className: "bg-green-100 text-green-700",
    },
    returned: {
      label: "بازگردانده شده",
      className: "bg-gray-100 text-gray-700",
    },
    rejected: {
      label: "رد شده",
      className: "bg-red-100 text-red-700",
    },
  };

  const status = statusMap[loan.status] || statusMap.requested;
  const isOwner = loan.listing.item && currentUserId === loan.listing.item.id;

  const images = loan.listing.item.images_json
    ? (typeof loan.listing.item.images_json === "string"
        ? JSON.parse(loan.listing.item.images_json)
        : loan.listing.item.images_json)
    : [];
  const imageUrl =
    images.length > 0
      ? images[0]
      : "https://via.placeholder.com/400x300/cccccc/000000?text=No+Image";

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-3">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={loan.listing.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{loan.listing.title}</h3>
            <span
              className={`text-xs px-3 py-1 rounded-full ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <div className="text-sm text-slate-600 space-y-1 mt-2">
            {loan.borrower && (
              <p>
                امانت‌گیرنده: {loan.borrower.full_name} (@{loan.borrower.username})
              </p>
            )}
            <p>
              بازه امانت: {new Date(loan.start_date).toLocaleDateString('fa-IR')} -{" "}
              {new Date(loan.end_date).toLocaleDateString('fa-IR')}
            </p>
            <p>درخواست شده: {new Date(loan.request_date).toLocaleDateString('fa-IR')}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {loan.status === "requested" && isOwner && (
        <div className="flex gap-2 pt-2 border-t">
          <button
            onClick={() => onApprove(loan.id)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
          >
            تأیید
          </button>
          <button
            onClick={() => onReject(loan.id)}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
          >
            رد
          </button>
        </div>
      )}
    </div>
  );
}
