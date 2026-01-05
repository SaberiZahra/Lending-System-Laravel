"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { categoriesAPI, authAPI } from "@/lib/api";
import { isAuthenticated, getUser, clearAuth } from "@/lib/auth";
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, UserIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

type Category = {
  id: number;
  title: string;
  children?: Category[];
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthenticated(isAuthenticated());
    setUser(getUser());
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAuth();
      router.push("/mainPage");
    }
  };

  const isActive = (path: string) => pathname === path;
  const isDashboard = pathname?.startsWith("/dashboard");

  // Don't show header on login/signup pages
  if (pathname === "/login" || pathname === "/signUp" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <Link href="/mainPage" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition">
              <span className="text-white font-bold text-xl">ا</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                اجاره چی
              </span>
              <span className="text-xs text-gray-500">سیستم امانت کالا</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/mainPage"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/mainPage")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              صفحه اصلی
            </Link>

{/* Categories Dropdown */}
<div className="relative">
  <button
    onClick={() => setCategoriesOpen(!categoriesOpen)}
    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-1 ${
      categoriesOpen
        ? "text-blue-600 bg-blue-50"
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    }`}
  >
    دسته‌بندی‌ها
    <ChevronDownIcon className={`w-4 h-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
  </button>

  {categoriesOpen && (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={() => setCategoriesOpen(false)}
      />
      <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-20 max-h-96 overflow-y-auto">
        {categories.length === 0 ? (
          <div className="px-4 py-2 text-gray-500 text-sm text-center">
            دسته‌بندی‌ای موجود نیست
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 p-2">
            {categories.map((category) => (
              <div key={category.id} className="group">
                {/* لینک اصلی دسته‌بندی */}
                <Link
                  href={`/listings?category=${category.id}`}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm"
                  onClick={() => setCategoriesOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-blue-600 transition"></div>
                    {category.title}
                  </div>
                </Link>

                {/* زیرمجموعه‌ها */}
                {category.children && category.children.length > 0 && (
                  <div className="pr-6 mt-1">
                    {category.children.slice(0, 3).map((child) => (
                      <Link
                        key={child.id}
                        href={`/listings?category=${child.id}`}
                        className="block px-4 py-2 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition rounded-lg"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        └ {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )}
</div>
                

            <Link
              href="/listings"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/listings")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              همه آگهی‌ها
            </Link>

            <Link
              href="/about"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isActive("/about")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              درباره ما
            </Link>
          </nav>

          {/* Search and Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>

            {/* Auth Buttons */}
            {authenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{user?.full_name || user?.username || "کاربر"}</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        داشبورد
                      </Link>
                      <Link
                        href="/dashboard/users/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        پروفایل
                      </Link>
                      <Link
                        href="/dashboard/users/listings"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        آگهی‌های من
                      </Link>
                      <Link
                        href="/dashboard/users/loans"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        درخواست‌ها
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        خروج
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                >
                  ورود
                </Link>
                <Link
                  href="/signUp"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  ثبت نام
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative px-4">
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              />
              <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>

            <nav className="px-4 space-y-2">
              <Link
                href="/mainPage"
                className="block px-3 py-2 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                صفحه اصلی
              </Link>
              <Link
                href="/listings"
                className="block px-3 py-2 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                همه آگهی‌ها
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                درباره ما
              </Link>
              {authenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    داشبورد
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-red-600 rounded-lg text-center"
                  >
                    خروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ورود
                  </Link>
                  <Link
                    href="/signUp"
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ثبت نام
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
