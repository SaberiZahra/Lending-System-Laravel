"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { authAPI } from "@/lib/api";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({
        login: login.trim(),
        password,
      });

      if (response.access_token) {
        // Save remember me preference
        if (remember) {
          localStorage.setItem("remember_me", "true");
        } else {
          localStorage.removeItem("remember_me");
        }
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "خطا در ورود. لطفاً دوباره تلاش کنید."
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
              ورود به حساب کاربری
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Username or Email */}
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  نام کاربری یا ایمیل
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-600 text-right mb-1">
                  رمز عبور
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                             focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-right">
                  {error}
                </div>
              )}

              {/* Remember and Forgot Password */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <Link href="/forgot-password" className="text-blue-600 hover:underline">
                  فراموشی رمز عبور؟
                </Link>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span>مرا به خاطر بسپار</span>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </label>
              </div>

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
                {loading ? "در حال ورود..." : "ورود"}
              </button>
            </form>

            {/* Signup */}
            <p className="mt-6 text-center text-sm text-gray-600">
              حساب کاربری ندارید؟
              <Link href="/signUp" className="text-blue-600 font-medium mr-1 hover:underline">
                ثبت نام
              </Link>
            </p>
          </div>
        </div>

        {/* Left: Image */}
        <div
          className="hidden lg:block bg-gradient-to-br from-blue-600 to-indigo-600 bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?semt=ais_hybrid&w=740&q=80')",
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
