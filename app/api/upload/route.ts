export const runtime = "nodejs"; // ⬅️ IMPORTANT pour autoriser fs + Uint8Array

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    // Convertir le fichier → Uint8Array (compatible writeFile)
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Sécuriser le nom
    const fileName =
      Date.now() + "_" + file.name.replace(/\s+/g, "_").toLowerCase();

    // Dossier uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    // Écriture fichier
    await writeFile(filePath, bytes); // ⬅️ PAS Buffer, mais Uint8Array → OK

    return NextResponse.json({
      success: true,
      url: "/uploads/" + fileName,
    });
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur", detail: error.message },
      { status: 500 }
    );
  }
}
