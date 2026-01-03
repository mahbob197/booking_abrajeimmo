import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Booking Abrajeimmo",
  description: "web booking app abrajeimmo, resirver , Location vacances"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Abrajeimmo
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/products" className="hover:underline">
                Produits
              </Link>
              {user && (
                <>
                  <Link href="/reservations" className="hover:underline">
                    Mes réservations
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link href="/admin/dashboard" className="text-red-600 font-semibold hover:underline">
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg border bg-white shadow-sm">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="font-medium">{user.name || "Utilisateur"}</span>
                    <Link href="/api/auth/logout" className="text-red-500 hover:underline text-xs">
                      Logout
                    </Link>
                  </div>
                </>
              )}
              {!user && (
                <>
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                  <Link href="/register" className="hover:underline">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
