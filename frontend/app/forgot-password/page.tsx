"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { authAPI } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("کد بازیابی به ایمیل شما ارسال شد");
      setStep("code");
    } catch (err: any) {
      setError("خطا در ارسال کد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // In a real app, this would verify the code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep("password");
    } catch (err: any) {
      setError("کد نامعتبر است");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // In a real app, this would reset the password
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("رمز عبور با موفقیت تغییر یافت");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError("خطا در تغییر رمز عبور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-right mb-8 text-gray-800">
            بازیابی رمز عبور
          </h1>

          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  ایمیل
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-right">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-right">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "در حال ارسال..." : "ارسال کد"}
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  کد بازیابی
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-right">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "در حال بررسی..." : "تایید کد"}
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-right">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-right">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "در حال تغییر..." : "تغییر رمز عبور"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            <Link href="/login" className="text-blue-600 hover:underline">
              بازگشت به صفحه ورود
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

