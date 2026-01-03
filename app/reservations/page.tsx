import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ReservationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reservations = await prisma.reservation.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Mes réservations</h1>

      <div className="space-y-4">
        {reservations.map((r) => {
          const images = [r.product.image].filter(Boolean);

          return (
            <div
              key={r.id}
              className="rounded-xl bg-white p-4 shadow flex gap-4"
            >
              {/* ⭐ Galerie d’images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-40">
                {images.length > 0 ? (
                  images.slice(0, 3).map((img, i) => (
                    <img
                      key={i}
                      src={img ?? "/placeholder.png"}
                      className="w-full h-32 object-cover rounded-lg"
                      alt={`product-image-${i}`}
                    />
                  ))
                ) : (
                  <img
                    src="/placeholder.png"
                    className="w-full h-32 object-cover rounded-lg"
                    alt="placeholder"
                  />
                )}
              </div>

              {/* ⭐ Infos réservation */}
              <div className="flex-1 space-y-1">
                <Link
                  href={`/products/${r.productId}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {r.product.title}
                </Link>

                <div className="text-sm text-gray-600">
                  {new Date(r.startDate).toLocaleDateString()} —{" "}
                  {new Date(r.endDate).toLocaleDateString()}
                </div>

                <div className="text-sm">
                  <span className="font-semibold">{r.totalPrice} MAD</span>{" "}
                  <span className="ml-2 text-xs uppercase text-gray-500">
                    {r.status ?? "en attente"}
                  </span>
                </div>

                {/* ⭐ AFFICHAGE CLIENT */}
                {r.fullName && (
                  <div className="text-sm text-gray-800">
                    👤 <span className="font-medium">Client :</span>{" "}
                    {r.fullName}
                  </div>
                )}

                {r.phone && (
                  <div className="text-sm text-gray-800">
                    📞 <span className="font-medium">Téléphone :</span>{" "}
                    {r.phone}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {reservations.length === 0 && (
          <p className="text-sm text-gray-500">
            Aucune réservation pour l&apos;instant.
          </p>
        )}
      </div>
    </div>
  );
}
