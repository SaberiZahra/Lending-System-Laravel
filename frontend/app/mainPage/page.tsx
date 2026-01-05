"use client";
import { useState, useEffect } from "react";
import { ArrowRightIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {lusitana700} from '@/app/ui/fonts';
import { BookOpen, Hammer, Home, Cpu, Gift, Activity } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { listingsAPI, categoriesAPI } from "@/lib/api";
import Footer from "@/components/Footer";

type BannerImage = {
  id: number;
  title?: string;
  imageUrl: string;
  link?: string;
};

type Listing = {
  id: number;
  title: string;
  description?: string;
  daily_fee: number;
  deposit_amount: number;
  item: {
    id: number;
    title: string;
    images_json?: string[] | null;
    category?: {
      id: number;
      name: string;
    };
  };
};

type Category = {
  id: number;
  title: string;
  name?: string;
  icon?: string;
  parent_id?: number | null;
  children?: Category[];
};

export default function Page() {
  const [newestListings, setNewestListings] = useState<Listing[]>([]);
  const [mostViewedListings, setMostViewedListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [newestData, mostViewedData, categoriesData] = await Promise.all([
          listingsAPI.getNewest(),
          listingsAPI.getMostViewed(),
          categoriesAPI.getAll(),
        ]);
        setNewestListings(newestData || []);
        setMostViewedListings(mostViewedData || []);
        setCategories(categoriesData || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "خطا در دریافت اطلاعات");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert listings to items for display
  const convertToListingItems = (listings: Listing[]) => {
    return listings.slice(0, 6).map((listing) => {
      const images = listing.item?.images_json
        ? (typeof listing.item.images_json === "string"
            ? JSON.parse(listing.item.images_json)
            : listing.item.images_json)
        : [];
      return {
        id: listing.id,
        title: listing.title || listing.item?.title || "بدون عنوان",
        imageUrl: images[0] || "https://via.placeholder.com/400x300/cccccc/000000?text=No+Image",
        link: `/listings/${listing.id}`,
        dailyFee: listing.daily_fee,
      };
    });
  };

  const newestItems = convertToListingItems(newestListings);
  const mostViewedItems = convertToListingItems(mostViewedListings);

  // Icon mapping for categories
  const categoryIcons: { [key: string]: any } = {
    "کتاب": BookOpen,
    "ابزار": Hammer,
    "لوازم خانگی": Home,
    "الکترونیکی": Cpu,
    "اسباب بازی": Gift,
    "ورزشی": Activity,
  };

  const getCategoryIcon = (categoryName: string) => {
    return categoryIcons[categoryName] || Activity;
  };
const images: BannerImage[] = [
    {
      id: 1,
      title: "اجاره کنید، قرض بدهید، صرفه‌جویی کنید           ",
      imageUrl: "/slider/img1.png",
      link: "#",
    },
    {
      id: 2,
      title: "کالاهای متنوع برای هر نیاز و بودجه                   ",
      imageUrl: "	/slider/img2.png",
      link: "#",
    },
    {
      id: 3,
      title: "پروسه آسان، سریع و امن",
      imageUrl: "/slider/img3.png",
      link: "#",
    },
  ];


  if (loading) {
    return (
      <main className="flex min-h-screen flex-col p-6 gap-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-600">در حال بارگذاری...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col p-6 gap-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  // Filter only parent categories
  const parentCategories = categories.filter(
    (cat) => !cat.parent_id || cat.parent_id === null
  );

  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-6 flex-1">
        {/* Category section */}
        <section className="flex flex-col gap-4 px-6 mb-8 mt-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {parentCategories.map((category) => {
              const categoryName = category.title || category.name || "";
              const Icon = getCategoryIcon(categoryName);
              const hasChildren =
                category.children && category.children.length > 0;
              return (
                <div key={category.id} className="group relative">
                  <Link
                    href={`/listings?category=${category.id}`}
                    className="block relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-visible"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 rounded-xl">
                      <div
                        className="absolute inset-0 bg-white rounded-xl"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-1.5 group-hover:bg-white/30 transition">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-bold text-xs leading-tight line-clamp-2">
                        {categoryName}
                      </span>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition rounded-xl"></div>
                  </Link>

                  {/* Children Dropdown on Hover */}
                  {hasChildren && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      {category.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          {child.title || child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Hero Banner */}
        <div className="w-full mt-2 px-6">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            loop={true}
          >
            {images.map((banner) => (
              <SwiperSlide key={banner.id}>
                <a href={banner.link}>
                  <div className="relative w-full h-64 md:h-80 lg:h-[500px]">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || `banner-${banner.id}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {banner.title && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
                          {banner.title}
                        </h2>
                      </div>
                    )}
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>


        {/* ========== جدیدترین‌ها ========== */}
        {newestItems.length > 0 && (
          <section className="flex flex-col gap-6 mt-6 md:mt-10 lg:mt-12 mb-8 px-6">
            <h2 className="text-right text-3xl font-bold text-gray-900 mb-2">
              جدیدترین‌ها
            </h2>
            <p className="text-right text-gray-600 mb-4">
              آخرین آگهی‌های اضافه شده به سایت
            </p>

            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
              {newestItems.map((item) => (
                <div key={item.id} className="shrink-0 w-64 md:w-72">
                  <div className="group flex flex-col rounded-2xl bg-white shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {/* کادر عکس */}
                    <div className="h-32 w-full border rounded-lg overflow-hidden mx-4 mt-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* متن و دکمه */}
                    <div className="p-4 flex flex-col gap-3 items-center">
                      <h3 className="text-center font-semibold text-lg">
                        {item.title}
                      </h3>
                      <Link
                        href={item.link || "#"}
                        className="w-full inline-flex justify-center rounded-md bg-blue-50 px-6 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-300"
                      >
                        مشاهده محصول
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========== پربازدیدترین‌ها ========== */}
        {mostViewedItems.length > 0 && (
          <section className="flex flex-col gap-6 mb-8 px-6">
            <h2 className="text-right text-3xl font-bold text-gray-900 mb-2">
              پربازدیدترین‌ها
            </h2>
            <p className="text-right text-gray-600 mb-4">
              محبوب‌ترین آگهی‌ها بر اساس تعداد بازدید
            </p>

            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
              {mostViewedItems.map((item) => (
                <div key={item.id} className="shrink-0 w-64 md:w-72">
                  <div className="group flex flex-col rounded-2xl bg-white shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {/* کادر عکس */}
                    <div className="h-32 w-full border rounded-lg overflow-hidden mx-4 mt-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* متن و دکمه */}
                    <div className="p-4 flex flex-col gap-3 items-center">
                      <h3 className="text-center font-semibold text-lg">
                        {item.title}
                      </h3>
                      <Link
                        href={item.link || "#"}
                        className="w-full inline-flex justify-center rounded-md bg-blue-50 px-6 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-300"
                      >
                        مشاهده محصول
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to action */}
        <section className="bg-blue-600 text-white py-16 text-center rounded-3xl mx-6">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              وسیله‌ای دارید که استفاده نمی‌کنید؟
            </h2>
            <p className="text-xl mb-10">
              آن را اجاره دهید و درآمد کسب کنید
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition"
            >
              همین حالا شروع کنید
              <ArrowRightIcon className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
