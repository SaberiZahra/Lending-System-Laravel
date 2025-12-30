"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// نوع داده‌های کاربر
type User = {
  name: string;
  username: string;
  email: string;
  phone: string;
  join_date: string;
  trust_score: number;
  status: string;
  listings: Listing[];
  imageUrl: string;
  title:string;
};

type Listing = {
  id: number;
  title: string;
  price: string;
  imageUrl: string;
  status: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // هدایت به لاگین اگر توکن موجود نباشد
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("خطا در دریافت اطلاعات کاربر");

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "خطا در بارگذاری اطلاعات");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
        <div className="h-24 w-24 rounded-full verflow-hidden" >
          <img
          src={user.imageUrl}     // <-- اینجا عکس واقعی
          alt={user.title}         // توضیح عکس برای دسترس‌پذیری
          className="h-full w-full object-cover"
        />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-slate-500">@{user.username}</p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              Trust Score: {user.trust_score}
            </span>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {user.status}
            </span>
          </div>
        </div>
      </section>

      {/* User Info */}
      <section className="grid md:grid-cols-2 gap-4">
        <InfoItem label="ایمیل" value={user.email} />
        <InfoItem label="شماره تماس" value={user.phone} />
        <InfoItem label="تاریخ عضویت" value={user.join_date} />
      </section>

      {/* My Listings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">آگهی‌های من</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.listings.map((listing) => (
            <MyListingCard key={listing.id} listing={listing}  />
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}

function MyListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-2">
      <div className="h-32 rounded-lg verflow-hidden" >
        <img
          src={listing.imageUrl}     // <-- اینجا عکس واقعی
          alt={listing.title}         // توضیح عکس برای دسترس‌پذیری
          className="h-full w-full object-cover"
        />
      </div>  
      <h3 className="font-semibold">{listing.title}</h3>

      <p className="text-sm text-slate-500">
        اجاره روزانه: {listing.price}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
          {listing.status}
        </span>

        <button className="text-sm text-blue-600 hover:underline">
          مشاهده
        </button>
      </div>
    </div>
  );
}
