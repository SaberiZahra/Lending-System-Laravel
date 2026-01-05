"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { listingsAPI, loansAPI } from "@/lib/api";
import { isAuthenticated, getUser } from "@/lib/auth";
import { ArrowLeftIcon, CalendarIcon, UserIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Listing = {
  id: number;
  title: string;
  description?: string;
  daily_fee: number;
  deposit_amount: number;
  available_from: string;
  available_until: string;
  status: string;
  item: {
    id: number;
    title: string;
    description?: string;
    item_condition: string;
    images_json?: string | null;
    category?: {
      id: number;
      title: string;
    };
    owner?: {
      id: number;
      full_name: string;
      username: string;
      trust_score?: number;
    };
  };
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState("");

  const authenticated = isAuthenticated();
  const user = getUser();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await listingsAPI.getPublicById(listingId);
        setListing(data);
        
        // Set min dates based on listing availability
        if (data) {
          const today = new Date().toISOString().split("T")[0];
          const availableFrom = data.available_from || today;
          const availableUntil = data.available_until;
          
          // Set default min for date inputs
          const minDate = new Date(availableFrom) > new Date(today) 
            ? availableFrom 
            : today;
          
          // Update date input constraints
          if (availableUntil) {
            const untilDate = new Date(availableUntil);
            if (untilDate < new Date()) {
              setError("This product is no longer available. The availability period has ended.");
            }
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const validateDates = (): string | null => {
    if (!listing) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availableFrom = new Date(listing.available_from);
    const availableUntil = new Date(listing.available_until);

    // Check if listing is expired
    if (availableUntil < today) {
      return "This product is no longer available. The availability period has ended.";
    }

    if (!startDate || !endDate) {
      return "Please select both start and end dates";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if start date is in the past
    if (start < today) {
      return "Start date cannot be in the past";
    }

    // Check if dates are within available range
    if (start < availableFrom) {
      return `Start date must be on or after ${availableFrom.toLocaleDateString()}`;
    }

    if (end > availableUntil) {
      return `End date must be on or before ${availableUntil.toLocaleDateString()}`;
    }

    if (end <= start) {
      return "End date must be after start date";
    }

    return null;
  };

  const handleRequestLoan = async () => {
    setRequestError("");

    const validationError = validateDates();
    if (validationError) {
      setRequestError(validationError);
      return;
    }

    if (!authenticated) {
      router.push("/login");
      return;
    }

    try {
      setRequesting(true);
      await loansAPI.create({
        listing_id: listingId,
        start_date: startDate,
        end_date: endDate,
      });
      alert("درخواست امانت با موفقیت ثبت شد!");
      router.push("/dashboard/users/loans");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "خطا در ثبت درخواست امانت";
      setRequestError(errorMessage);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <p className="text-red-600 mb-4 text-lg">{error || "آگهی یافت نشد"}</p>
            <Link
              href="/mainPage"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowLeftIcon className="w-5 h-5 ml-2" />
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = listing.item?.images_json
    ? (typeof listing.item.images_json === "string"
        ? JSON.parse(listing.item.images_json)
        : listing.item.images_json)
    : [];

  const conditionMap: { [key: string]: string } = {
    new: "نو",
    like_new: "در حد نو",
    used: "دست دوم",
    old: "قدیمی",
  };

  const isOwner = authenticated && user && listing.item.owner?.id === user.id;
  const today = new Date().toISOString().split("T")[0];
  const availableFrom = listing.available_from || today;
  const minDate = new Date(availableFrom) > new Date(today) 
    ? availableFrom 
    : today;
  const maxDate = listing.available_until || today;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              {images.length > 0 ? (
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative group">
                  <img
                    src={images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      +{images.length - 1} تصویر دیگر
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">تصویر موجود نیست</span>
                </div>
              )}
            </div>

            {/* Title and Basic Info */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{listing.title}</h1>
              {listing.item.category && (
                <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {listing.item.category.title}
                </div>
              )}
              {listing.available_from && listing.available_until && (
                <div className="flex items-center gap-4 text-gray-600 mb-6">
                  <span className="flex items-center">
                    <CalendarIcon className="w-5 h-5 ml-2" />
                    در دسترس: {new Date(listing.available_from).toLocaleDateString('fa-IR')} - {new Date(listing.available_until).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              )}
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {listing.description || listing.item.description || "توضیحات موجود نیست"}
              </p>
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">جزئیات کالا</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <DetailItem label="دسته‌بندی" value={listing.item?.category?.title || "نامشخص"} />
                <DetailItem label="وضعیت" value={conditionMap[listing.item?.item_condition || ''] || listing.item?.item_condition || "نامشخص"} />
                {listing.available_from && <DetailItem label="از تاریخ" value={new Date(listing.available_from).toLocaleDateString('fa-IR')} />}
                {listing.available_until && <DetailItem label="تا تاریخ" value={new Date(listing.available_until).toLocaleDateString('fa-IR')} />}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-4 border-2 border-blue-100">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {listing.daily_fee.toLocaleString()}
                </div>
                <div className="text-gray-600">تومان / روز</div>
              </div>

              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">ضمانت:</span>
                  <span className="font-semibold text-lg">
                    {listing.deposit_amount.toLocaleString()} تومان
                  </span>
                </div>
              </div>

              {/* Owner Info */}
              {listing.item.owner && (
                <div className="border-t pt-6 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {listing.item.owner.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{listing.item.owner.username}
                      </p>
                    </div>
                  </div>
                  {listing.item.owner.trust_score && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">
                        امتیاز اعتماد: <span className="font-semibold">{listing.item.owner.trust_score}</span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Request Form */}
              {!isOwner && (
                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-bold text-lg text-gray-900">درخواست امانت</h3>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      تاریخ شروع
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setRequestError("");
                      }}
                      min={minDate}
                      max={maxDate}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      تاریخ پایان
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setRequestError("");
                      }}
                      min={startDate || minDate}
                      max={maxDate}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  {requestError && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {requestError}
                    </div>
                  )}

                  <button
                    onClick={handleRequestLoan}
                    disabled={requesting || !authenticated}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {requesting
                      ? "در حال ارسال..."
                      : authenticated
                      ? "ثبت درخواست امانت"
                      : "ورود برای درخواست"}
                  </button>

                  {!authenticated && (
                    <p className="text-sm text-center text-gray-600">
                      <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                        ورود
                      </Link>{" "}
                      یا{" "}
                      <Link href="/signUp" className="text-blue-600 hover:underline font-semibold">
                        ثبت نام
                      </Link>{" "}
                      کنید
                    </p>
                  )}
                </div>
              )}

              {isOwner && (
                <div className="border-t pt-6 text-center">
                  <p className="text-sm text-gray-600">
                    این آگهی متعلق به شماست
                  </p>
                </div>
              )}

              {listing.available_until && new Date(listing.available_until) < new Date() && !isOwner && (
                <div className="border-t pt-6 text-center">
                  <p className="text-sm text-amber-600 font-semibold bg-amber-50 px-4 py-2 rounded-lg">
                    زمان درخواست این محصول گذشته است
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 mb-1">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
