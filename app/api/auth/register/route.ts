export const runtime = "nodejs";   // ⬅️ IMPORTANT : Active les Buffer + fs

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = form.get("name")?.toString() || "";
    const email = form.get("email")?.toString() || "";
    const phone = form.get("phone")?.toString() || "";
    const password = form.get("password")?.toString() || "";

    const avatarFile = form.get("avatar") as File | null;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    let avatarUrl: string | null = null;

    if (avatarFile && avatarFile.size > 0) {
      const arrayBuffer = await avatarFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const filename = `${Date.now()}_${avatarFile.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "avatars");

      await mkdir(uploadDir, { recursive: true });

      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, bytes); // ⬅️ plus de Buffer → Uint8Array OK

      avatarUrl = "/avatars/" + filename;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        avatar: avatarUrl,
        role: "USER",
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur", detail: err.message },
      { status: 500 }
    );
  }
}

