import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

/* ============================================================
   🔵 LISTE DES PRODUITS
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
   🔵 CREATE PRODUCT + UPLOAD IMAGES (main + gallery)
============================================================ */
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /** 📌 Lire FormData */
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
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    /* ============================================================
       🔵 Fonction utilitaire pour upload fichier
    ============================================================ */
    async function uploadFile(file: File | null) {
      if (!file) return null;

      const bytes = Buffer.from(await file.arrayBuffer());
      const cleanName = file.name.replace(/\s+/g, "_");
      const filename = `${Date.now()}_${cleanName}`;

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, bytes);

      return "/uploads/" + filename;
    }

    /* ============================================================
       🔵 Upload main image
    ============================================================ */
    const mainImageUrl = await uploadFile(mainImage);

    /* ============================================================
       🔵 Création du produit
    ============================================================ */
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

    /* ============================================================
       🔵 Upload gallery images
    ============================================================ */
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
