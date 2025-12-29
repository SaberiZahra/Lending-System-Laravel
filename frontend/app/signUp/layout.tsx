"use client";

import { useState } from "react";

const SignupPage: React.FC = () => {
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      fullname,
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">

      {/* Right: Form */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold text-right mb-8 text-gray-800">
            ایجاد حساب کاربری
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Full name */}
            <div>
              <label className="block text-sm text-gray-600 text-right mb-1">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                           focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 text-right mb-1">
                ایمیل
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-right
                           focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-blue-50 py-2
                         font-semibold text-blue-700
                         hover:bg-blue-600 hover:text-white
                         transition-all duration-300"
            >
              ثبت نام
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
        className="hidden lg:block bg-blue-50 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-2242.jpg?semt=ais_hybrid&w=740&q=80')",
        }}
      />
    </div>
  );
};

export default SignupPage;
