"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Hammer, Home, Cpu, Gift, Activity } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

type Item = {
  id: number;
  title: string;
  imageUrl: string;
  link?: string;
};

type BannerImage = {
  id: number;
  title?: string;
  imageUrl: string;
  link?: string;
};

export default function Page() {
  const [latestItems, setLatestItems] = useState<Item[]>([]);
  const [mostBorrowedItems, setMostBorrowedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { id: 1, title: "کتاب", icon: BookOpen },
    { id: 2, title: "ابزار", icon: Hammer },
    { id: 3, title: "لوازم خانگی", icon: Home },
    { id: 4, title: "الکترونیکی", icon: Cpu },
    { id: 5, title: "اسباب بازی", icon: Gift },
    { id: 6, title: "ورزشی", icon: Activity },
  ];

  const images: BannerImage[] = [
    { id: 1, imageUrl: "https://berozkala.com/Upload/Files/png/bf247ebe71754014a4e64fd72851b280.png" },
    { id: 2, imageUrl: "https://media.rtlcdn.com/2022/03/4c8644462eb3e6dfe231c057453140e5f1f1b61918efba-1050x520.jpg" },
    { id: 3, imageUrl: "https://pikfree.ir/wp-content/uploads/edd/2022/07/grand-opening-sale-banner-template-with-luxury-red-silk-velvet-curtains-Top.jpg" },
  ];

  // بارگذاری داده‌ها از API
  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    const fetchData = async () => {
      try {
        const [latestRes, mostRes] = await Promise.all([
          fetch("http://localhost:8000/api/items?sort=newest&limit=6", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/items?sort=most_borrowed&limit=6", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!latestRes.ok || !mostRes.ok) {
          throw new Error("خطا در دریافت محصولات");
        }

        const latestData: Item[] = await latestRes.json();
        const mostData: Item[] = await mostRes.json();

        setLatestItems(latestData);
        setMostBorrowedItems(mostData);
      } catch (err: any) {
        setError(err.message || "خطا در بارگذاری محصولات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">در حال بارگذاری محصولات...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  // تابع نمایش یک بخش از آیتم‌ها
  const renderSection = (title: string, items: Item[]) => (
    <section className="flex flex-col gap-6">
      <p className="text-right text-2xl font-bold">:{title}</p>
      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
        {items.map((item) => (
          <div key={item.id} className="shrink-0 w-64 md:w-72">
            <div className="group flex flex-col rounded-2xl bg-white shadow-md overflow-hidden
                            hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-32 w-full border rounded-lg overflow-hidden mx-4 mt-4">
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4 flex flex-col gap-3 items-center">
                <h3 className="text-center font-semibold text-lg">{item.title}</h3>
                <Link
                  href={item.link || "#"}
                  className="w-full inline-flex justify-center rounded-md bg-blue-50 px-6 py-2
                             text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white
                             transition-all duration-300"
                >
                  مشاهده محصول
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="flex min-h-screen flex-col p-6 gap-10">
      {/* دسته‌بندی‌ها */}
      <section className="flex flex-col gap-2 px-6">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar justify-end">
          <div className="flex gap-4">
            {categories.map(category => (
              <div key={category.id} className="shrink-0">
                <Link
                  href="/categories"
                  className="flex flex-row-reverse items-center gap-3 rounded-lg
                             bg-gradient-to-r from-blue-500 to-indigo-500
                             px-5 py-2 text-sm font-semibold text-white shadow-md
                             hover:scale-105 hover:shadow-xl transition-all duration-300 md:text-base"
                >
                  <span>{category.title}</span>
                  {category.icon && <category.icon className="w-5 h-5" />}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-right text-2xl font-bold flex-shrink-0">:دسته‌بندی‌ها</p>
        </div>
      </section>

      {/* Hero Banner */}
      <div className="w-full mt-2 px-6">
        <Swiper modules={[Autoplay]} spaceBetween={0} slidesPerView={1} autoplay={{ delay: 3000 }} loop={true}>
          {images.map((banner) => (
            <SwiperSlide key={banner.id}>
              <a href={banner.link || "#"}>
                <div className="relative w-full h-64 md:h-80 lg:h-[500px]">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || `banner-${banner.id}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* جدیدترین‌ها */}
      {renderSection("جدیدترین‌ها", latestItems)}

      {/* بیشترین امانت‌شده‌ها */}
      {renderSection("بیشترین امانت‌شده‌ها", mostBorrowedItems)}
    </main>
  );
}
