"use client";

import { useEffect, useState } from "react";
import {
  getMyLoans,
  approveLoan,
  rejectLoan,
} from "@/lib/api";

type LoanStatus = "pending" | "approved" | "returned" | "rejected";

interface Loan {
  id: number;
  item: {
    title: string;
  };
  borrower?: {
    name: string;
  };
  start_date: string;
  end_date: string;
  status: LoanStatus;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLoans() {
    try {
      const data = await getMyLoans();
      setLoans(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLoans();
  }, []);

  if (loading) {
    return <p>در حال بارگذاری...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <header>
        <h1 className="text-2xl font-bold">درخواست‌ها</h1>
        <p className="text-slate-500 mt-1">
          وضعیت درخواست‌های امانت شما
        </p>
      </header>

      {/* Loans List */}
      <section className="space-y-4">
        {loans.map((loan) => (
          <LoanCard
            key={loan.id}
            loan={loan}
            onAction={loadLoans}
          />
        ))}
      </section>
    </div>
  );
}

function LoanCard({
  loan,
  onAction,
}: {
  loan: Loan;
  onAction: () => void;
}) {
  const statusMap = {
    pending: {
      label: "در انتظار تأیید",
      className: "bg-amber-100 text-amber-700",
    },
    approved: {
      label: "تأیید شده",
      className: "bg-blue-100 text-blue-700",
    },
    returned: {
      label: "بازگردانده شده",
      className: "bg-green-100 text-green-700",
    },
    rejected: {
      label: "رد شده",
      className: "bg-red-100 text-red-700",
    },
  };

  const s = statusMap[loan.status];

  async function handleApprove() {
    await approveLoan(loan.id);
    onAction();
  }

  async function handleReject() {
    await rejectLoan(loan.id);
    onAction();
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">
          {loan.item.title}
        </h3>
        <span
          className={`text-xs px-3 py-1 rounded-full ${s.className}`}
        >
          {s.label}
        </span>
      </div>

      <div className="text-sm text-slate-600 space-y-1">
        <p>
          امانت‌گیرنده:{" "}
          {loan.borrower?.name || "—"}
        </p>
        <p>
          بازه امانت: {loan.start_date} تا{" "}
          {loan.end_date}
        </p>
      </div>

      {/* Actions */}
      {loan.status === "pending" && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleApprove}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
          >
            تأیید
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
          >
            رد
          </button>
        </div>
      )}
    </div>
  );
}
