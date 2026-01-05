"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { listingsAPI, categoriesAPI } from "@/lib/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Listing = {
  id: number;
  title: string;
  description?: string;
  daily_fee: number;
  deposit_amount: number;
  status: string;
  item: {
    id: number;
    title: string;
    images_json?: string | null;
    category?: {
      id: number;
      name: string;
    };
    owner?: {
      id: number;
      full_name: string;
      username: string;
    };
  };
};

type Category = {
  id: number;
  title: string;
  name?: string;
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [listingsData, categoriesData] = await Promise.all([
          listingsAPI.getPublic(),
          categoriesAPI.getAll(),
        ]);
        setListings(listingsData || []);
        setCategories(categoriesData || []);
        
        // Get search query and category from URL
        const search = searchParams?.get("search");
        const category = searchParams?.get("category");
        if (search) {
          setSearchQuery(search);
        }
        if (category) {
          setSelectedCategory(parseInt(category));
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === null ||
      listing.item.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-right">همه آگهی‌ها</h1>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl transition ${
                selectedCategory === null
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
            >
              همه دسته‌بندی‌ها
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl transition ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                {category.title || category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">آگهی‌ای یافت نشد</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => {
              const images = listing.item.images_json
                ? (typeof listing.item.images_json === "string"
                    ? JSON.parse(listing.item.images_json)
                    : listing.item.images_json)
                : [];
              const imageUrl =
                images.length > 0
                  ? images[0]
                  : "https://via.placeholder.com/400x300/cccccc/000000?text=No+Image";

              return (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    {listing.item.category && (
                      <p className="text-sm text-gray-500 mb-2">
                        {listing.item.category.title || listing.item.category.name}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">
                        {listing.daily_fee.toLocaleString()} تومان/روز
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          listing.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {listing.status === "active" ? "در دسترس" : "ناموجود"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
