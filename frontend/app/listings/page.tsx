"use client";

import { useState } from "react";
import { getListings } from "@/lib/api";
import Link from "next/link";

type Listing = {
  id: number;
  title: string;
  dailyFee: number;
  category: string;
  owner: string;
  status: "available" | "unavailable";
};

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="grid grid-cols-3 gap-6">
      {listings.map((item: any) => (
       <Link
        key={item.id}
        href={`/listings/${item.id}`}
        className="block"
      >
          <h3>{item.title}</h3>
          <p>{item.daily_fee} تومان / روز</p>
        </Link>
      ))}
    </div>
  );
}
