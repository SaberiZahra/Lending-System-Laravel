import { getListing } from "@/lib/api";

interface Props {
  params: { id: string };
}

export default async function ListingDetailsPage({ params }: Props) {
  const listing = await getListing(params.id);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        {listing.title}
      </h1>

      <p className="text-gray-600 mb-4">
        {listing.description}
      </p>

      <div className="text-lg font-semibold">
        قیمت: {listing.price} تومان
      </div>
    </div>
  );
}
