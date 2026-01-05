"use client";
import Image from "next/image";

import { useState } from "react";
import Link from "next/link";
import {
  UserIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <main>
      

      <div>{children}</div>
    </main>
  );
}
