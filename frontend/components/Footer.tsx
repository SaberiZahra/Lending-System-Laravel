"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ا</span>
              </div>
              <span className="text-xl font-bold text-white">اجاره چی</span>
            </div>
            <p className="text-sm text-gray-400">
              سیستم امانت کالا برای به اشتراک گذاری وسایل و صرفه‌جویی در هزینه‌ها
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mainPage" className="hover:text-white transition">
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link href="/listings" className="hover:text-white transition">
                  همه آگهی‌ها
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  داشبورد
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@ejarechi.com" className="hover:text-white transition">
                  info@ejarechi.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+989123456789" className="hover:text-white transition">
                  09123456789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>تهران، ایران</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">قوانین و مقررات</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  شرایط استفاده
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  حریم خصوصی
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-white transition">
                  قوانین امانت
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  درباره ما
                </Link>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} اجاره چی. تمام حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}

