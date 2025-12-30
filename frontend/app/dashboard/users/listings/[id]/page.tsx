"use client";

import { useEffect, useState } from "react";
import { getListing , updateListing } from "@/lib/api";

export default function EditListing({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getListing(params.id).then(setData);
  }, [params.id]);

  async function save() {
    await updateListing(params.id, data);
    alert("ذخیره شد");
  }

  if (!data) return <p>در حال بارگذاری...</p>;

  return (
    <div>
      <input
        value={data.title}
        onChange={(e) =>
          setData({ ...data, title: e.target.value })
        }
      />

      <button onClick={save}>ذخیره</button>
    </div>
  );
}
