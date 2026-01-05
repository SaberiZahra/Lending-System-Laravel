"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { authAPI } from "@/lib/api";

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [fullname, setFullname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.register({
        full_name: fullname.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
      });

      if (response.access_token) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "خطا در ثبت نام. لطفاً دوباره تلاش کنید.";
      setError(
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Right: Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-right mb-8 text-gray-800">
              ایجاد حساب کاربری
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Full name */}
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  نام و نام خانوادگی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  نام کاربری <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  ایمیل <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  شماره تماس
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  آدرس
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="آدرس خود را وارد کنید"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  رمز عبور <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-right">
                  {error}
                </div>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-blue-600 py-3
                           font-semibold text-white
                           hover:bg-blue-700
                           transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "در حال ثبت نام..." : "ثبت نام"}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              قبلاً حساب دارید؟
              <a
                href="/login"
                className="text-blue-600 font-medium mr-1 hover:underline"
              >
                ورود
              </a>
            </p>
          </div>
        </div>

        {/* Left: Image */}
        <div
          className="hidden lg:block bg-gradient-to-br from-blue-600 to-indigo-600 bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-2242.jpg?semt=ais_hybrid&w=740&q=80')",
          }}
        />
      </div>
    </div>
  );
};

export default SignupPage;
