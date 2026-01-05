"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">حریم خصوصی</h1>
          <p className="text-blue-100">اطلاعات مربوط به نحوه جمع‌آوری و استفاده از اطلاعات شما</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 text-right">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">1. جمع‌آوری اطلاعات</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              ما اطلاعاتی که شما به صورت داوطلبانه در اختیار ما قرار می‌دهید را جمع‌آوری می‌کنیم، 
              از جمله نام، ایمیل، شماره تماس و آدرس.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">2. استفاده از اطلاعات</h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-right">
              اطلاعات جمع‌آوری شده برای موارد زیر استفاده می‌شود:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-right pr-4">
              <li>ارائه و بهبود سرویس</li>
              <li>ارتباط با کاربران</li>
              <li>پردازش تراکنش‌ها</li>
              <li>ارسال اطلاع‌رسانی‌های مهم</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">3. محافظت از اطلاعات</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              ما از روش‌های امنیتی استاندارد برای محافظت از اطلاعات شما استفاده می‌کنیم. 
              با این حال، هیچ روش انتقال اطلاعات در اینترنت کاملاً امن نیست.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">4. اشتراک‌گذاری اطلاعات</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              ما اطلاعات شما را به اشخاص ثالث نمی‌فروشیم یا به اشتراک نمی‌گذاریم، 
              مگر در مواردی که برای ارائه سرویس ضروری باشد یا طبق قانون الزامی باشد.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-right">5. کوکی‌ها</h2>
            <p className="text-gray-700 leading-relaxed text-right">
              ما از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کنیم. 
              شما می‌توانید تنظیمات مرورگر خود را برای غیرفعال کردن کوکی‌ها تغییر دهید.
            </p>
          </section>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}