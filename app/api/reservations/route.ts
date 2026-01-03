export const runtime = "nodejs"; // ⬅️ Obligatoire pour writeFile + fs

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reservations = await prisma.reservation.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reservations);
}

export async function POST(req: Request) {
  try {
    console.log("📩 POST /api/reservations — FormData received");

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();

    const productId = Number(form.get("productId"));
    const startDate = form.get("startDate")?.toString();
    const endDate = form.get("endDate")?.toString();
    const totalPrice = Number(form.get("totalPrice"));

    const fullName = form.get("fullName")?.toString() ?? null;
    const phone = form.get("phone")?.toString() ?? null;
    const address = form.get("address")?.toString() ?? null;
    const totalPersons = Number(form.get("totalPersons") ?? 1);

    const cinFile = form.get("cinFile") as File | null;
    const passportFile = form.get("passportFile") as File | null;
    const contractFile = form.get("contractFile") as File | null;

    if (!productId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // ================================
    // 🔵 Fonction pour sauvegarder un fichier
    // ================================
    async function saveUpload(file: File | null) {
      if (!file || file.size === 0) return null;

      // Convertir en Uint8Array (compatible Next.js writeFile)
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await mkdir(uploadDir, { recursive: true });

      const fullPath = path.join(uploadDir, filename);
      await writeFile(fullPath, bytes);

      return `/uploads/${filename}`;
    }

    const cinPath = await saveUpload(cinFile);
    const passportPath = await saveUpload(passportFile);
    const contractPath = await saveUpload(contractFile);

    console.log("📌 Saving reservation to DB...");

    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        productId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        fullName,
        phone,
        address,
        totalPersons,
        cinFile: cinPath,
        passportFile: passportPath,
        contractFile: contractPath,
      },
    });

    console.log("✅ Reservation created:", reservation);

    return NextResponse.json(reservation);

  } catch (err: any) {
    console.error("❌ SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur", detail: err.message },
      { status: 500 }
    );
  }
}
