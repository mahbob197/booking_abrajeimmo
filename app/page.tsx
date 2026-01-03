import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  // Liste des produits
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Récupération des réservations avec type auto-dérivé
  const reservations = await prisma.reservation.findMany({
    select: { productId: true, endDate: true },
  });

  // Map des produits réservés + leur date de fin
  const reservedMap = new Map<number, Date>();

  reservations.forEach((r: any) => {
    reservedMap.set(r.productId, r.endDate);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Liste des produits</h1>

        <Link
          href="/products/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p: any) => {
          const endDate = reservedMap.get(p.id);
          const isReserved = Boolean(endDate);

          return (
            <div
              key={p.id}
              className={`relative rounded-xl bg-white shadow hover:shadow-lg transition overflow-hidden ${
                isReserved ? "opacity-60" : ""
              }`}
            >
              {/* Badge réservé + date de fin */}
              {isReserved && (
                <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Réservé jusqu’au {new Date(endDate!).toLocaleDateString()}
                </span>
              )}

              <Link href={`/products/${p.id}`}>
                <img
                  src={p.image || "/placeholder.png"}
                  className="w-full h-48 object-cover"
                  alt={p.title}
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold">{p.title}</h2>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {p.description}
                  </p>

                  <div className="mt-3 flex justify-between text-sm">
                    <span className="font-bold">{p.price} MAD</span>
                    <span className="text-gray-500">{p.city}</span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {products.length === 0 && (
          <p className="text-sm text-gray-500">
            Aucun produit pour l&apos;instant.
          </p>
        )}
      </div>
    </div>
  );
}
