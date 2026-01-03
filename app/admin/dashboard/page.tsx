import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminStats } from "../components/AdminStats";
import { ProductTable } from "../components/ProductTable";
import { UserTable } from "../components/UserTable";
import { ReservationTable } from "../components/ReservationTable";
import AdminTabs from "../components/AdminTabs";   // ⬅️ composant client

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") redirect("/login");

  const [products, users, reservations, stats] = await Promise.all([
    prisma.product.findMany({
      include: {
        images: true,
        _count: { select: { reservations: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      include: { _count: { select: { reservations: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.reservation.findMany({
      include: {
        product: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: "confirmed" } }),
      prisma.reservation.count({ where: { status: "pending" } }),
    ]),
  ]);

  const [
    totalProducts,
    totalUsers,
    totalReservations,
    confirmedReservations,
    pendingReservations,
  ] = stats;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Retour au site
          </Link>
        </div>

        {/* STATS */}
        <AdminStats
          totalProducts={totalProducts}
          totalUsers={totalUsers}
          totalReservations={totalReservations}
          confirmedReservations={confirmedReservations}
          pendingReservations={pendingReservations}
        />

        {/* ONGLET FIXÉ */}
        <AdminTabs
          tabs={[
            { id: "products", name: "Produits", count: totalProducts, icon: "📦" },
            { id: "users", name: "Utilisateurs", count: totalUsers, icon: "👥" },
            { id: "reservations", name: "Réservations", count: totalReservations, icon: "📅" },
          ]}
        />

        {/* SECTION PRODUITS */}
        <section id="products" className="mt-8">
          <h2 className="text-xl font-semibold">Produits</h2>
          <ProductTable products={products} />
        </section>

        {/* SECTION USERS */}
        <section id="users" className="mt-8">
          <h2 className="text-xl font-semibold">Utilisateurs</h2>
          <UserTable users={users} />
        </section>

        {/* SECTION RÉSERVATIONS */}
        <section id="reservations" className="mt-8">
          <h2 className="text-xl font-semibold">Réservations</h2>
          <ReservationTable reservations={reservations} />
        </section>

      </div>
    </div>
  );
}
