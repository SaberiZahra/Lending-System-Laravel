"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// تابع لاگین که API لاراول را فراخوانی می‌کند
const login = async (username: string, password: string) => {
  const res = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("نام کاربری یا رمز عبور اشتباه است");
  }

  return res.json(); // انتظار داریم { token, role }
};

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(username, password);

      // ذخیره توکن و نقش
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // ذخیره remember
      if (remember) localStorage.setItem("remember", "true");

      // هدایت بر اساس نقش
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err.message || "مشکلی در ورود به حساب رخ داده است");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Right: Form */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-right mb-8 text-gray-800">
            ورود به حساب کاربری
          </h1>

          {error && (
            <p className="mb-4 text-sm text-red-600 text-right">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm text-gray-600 text-right mb-1">
                نام کاربری
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                           focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

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
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <a href="#" className="text-blue-600 hover:underline">
                فراموشی رمز؟
              </a>
              <label className="flex items-center gap-2">
                <span>مرا به خاطر بسپار</span>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-blue-50 py-2
                         font-semibold text-blue-700
                         hover:bg-blue-600 hover:text-white
                         transition-all duration-300"
            >
              ورود
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            حساب کاربری ندارید؟
            <a
              href="/signUp"
              className="text-blue-600 font-medium mr-1 hover:underline"
            >
              ثبت نام
            </a>
          </p>
        </div>
      </div>

      {/* Left: Image */}
      <div
        className="hidden lg:block bg-blue-50 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?semt=ais_hybrid&w=740&q=80')",
        }}
      />
    </div>
  );
};

export default LoginPage;
