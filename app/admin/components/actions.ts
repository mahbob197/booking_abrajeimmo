'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* =======================================================================
    UTILS — fonction solide pour update avec champ optionnel
======================================================================= */

async function safeUpdate(model: any, where: any, data: any) {
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );

  return model.update({ where, data: filteredData });
}

/* =======================================================================
    PRODUCTS ACTIONS
======================================================================= */

export async function activateProduct(formData: FormData) {
  const id = Number(formData.get("id"));
  const active = formData.get("active") === "true";

  await safeUpdate(prisma.product, { id }, { active });

  revalidatePath("/admin");
}

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin");
}

/* =======================================================================
    USERS ACTIONS
======================================================================= */

export async function activateUser(formData: FormData) {
  const id = Number(formData.get("id"));
  const active = formData.get("active") === "true";

  await safeUpdate(prisma.user, { id }, { active });

  revalidatePath("/admin");
}

/* =======================================================================
    RESERVATIONS ACTIONS
======================================================================= */

export async function updateReservationStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = formData.get("status")?.toString();

  await safeUpdate(prisma.reservation, { id }, { status });

  revalidatePath("/admin");
}

export async function deleteReservation(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.reservation.delete({ where: { id } });

  revalidatePath("/admin");
}
