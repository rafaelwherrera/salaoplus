"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertClientSchema } from "./schema";

export const upsertClient = actionClient
  .schema(upsertClientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Usuário não encontrado");
    }
    if (!session?.user.salon?.id) {
      throw new Error("Salão não encontrado");
    }

    const clientId = parsedInput.id ?? randomUUID();

    await db
      .insert(clientsTable)
      .values({
        id: clientId,
        name: parsedInput.name,
        email: parsedInput.email,
        phoneNumber: parsedInput.phoneNumber,
        sex: parsedInput.sex,
        salonId: session.user.salon.id,
      })
      .onConflictDoUpdate({
        target: [clientsTable.id],
        set: {
          name: parsedInput.name,
          email: parsedInput.email,
          phoneNumber: parsedInput.phoneNumber,
          sex: parsedInput.sex,
        },
      });
    revalidatePath("/clientes");
  });
