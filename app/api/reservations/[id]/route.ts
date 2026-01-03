import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/* =======================================================
   UPDATE RESERVATION STATUS (PUT)
======================================================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Auth
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Params → must await
  const { id } = await context.params;
  const reservationId = Number(id);

  if (isNaN(reservationId)) {
    return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
  }

  // Body
  const { status } = await req.json();

  const reservation = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status },
  });

  return NextResponse.json(reservation);
}

/* =======================================================
   DELETE RESERVATION
======================================================= */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Auth
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Params → must await
  const { id } = await context.params;
  const reservationId = Number(id);

  if (isNaN(reservationId)) {
    return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 });
  }

  await prisma.reservation.delete({
    where: { id: reservationId },
  });

  return NextResponse.json({ ok: true });
}
