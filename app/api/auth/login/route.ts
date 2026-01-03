import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 400 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 400 });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ success: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return res;
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Erreur serveur", detail: err.message }, { status: 500 });
  }
}
