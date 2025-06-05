"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { salonsTable, usersToSalonsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createSalon = async (
  name: string,
  street: string,
  number: string,
  complement: string,
  neighborhood: string,
  city: string,
  state: string,
  zipCode: string,
  phone: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autenticado");
  }

  const result = await db
    .insert(salonsTable)
    .values({
      id: crypto.randomUUID(),
      name,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      phone,
    })
    .returning();

  const salon = result[0];

  await db.insert(usersToSalonsTable).values({
    userId: session.user.id,
    salonId: salon.id,
  });
  redirect("/dashboard");
};
