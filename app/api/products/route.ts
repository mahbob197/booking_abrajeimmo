export const runtime = "nodejs"; // 🔵 Obligatoire pour writeFile + fs sur Next.js

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/* ============================================================
   🔵 GET — LISTE DES PRODUITS
============================================================ */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });

    return NextResponse.json(products);
  } catch (err: any) {
    console.error("GET /products ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ============================================================
   🔵 POST — CREATE PRODUCT + UPLOAD IMAGES
============================================================ */
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();

    const title = form.get("title")?.toString() || "";
    const description = form.get("description")?.toString() || "";
    const price = Number(form.get("price") || 0);
    const city = form.get("city")?.toString() || "";
    const latitude = form.get("latitude") ? Number(form.get("latitude")) : null;
    const longitude = form.get("longitude") ? Number(form.get("longitude")) : null;

    const mainImage = form.get("mainImage") as File | null;
    const gallery = form.getAll("gallery") as File[];

    if (!title || !description || !price || !city) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    /* ============================================================
       🔵 Fonction Upload (avec Uint8Array)
    ============================================================= */
    async function uploadFile(file: File | null) {
      if (!file || file.size === 0) return null;

      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, bytes);

      return "/uploads/" + filename;
    }

    /* 🔵 Upload main image */
    const mainImageUrl = await uploadFile(mainImage);

    /* 🔵 Create product */
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        city,
        latitude,
        longitude,
        image: mainImageUrl,
      },
    });

    /* 🔵 Upload gallery files */
    for (const file of gallery) {
      const url = await uploadFile(file);
      if (url) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url,
          },
        });
      }
    }

    return NextResponse.json({ ok: true, id: product.id });

  } catch (err: any) {
    console.error("POST /products ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
