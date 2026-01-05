"use client";

import Header from "@/components/Header";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              اجاره کنید، قرض بدهید، صرفه‌جویی کنید
            </h1>
            <p className="text-xl md:text-2xl mb-10">
              هزاران وسیله با قیمت مناسب در دسترس شماست
            </p>
            <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="چیزی که نیاز داری رو جستجو کن"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-14 rounded-full text-gray-900 text-lg text-right focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <MagnifyingGlassIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-500" />
            </form>
        </div>
          </div>
        </section>
    <div>{children}</div>
  </main>
);
}
