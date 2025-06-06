"use server";

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
      throw new Error("Unauthorized");
    }
    if (!session?.user.salon?.id) {
      throw new Error("Salon not found");
    }

    await db
      .insert(clientsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id ?? "",
        salonId: session?.user.salon?.id,
      })
      .onConflictDoUpdate({
        target: [clientsTable.id],
        set: {
          ...parsedInput,
        },
      });
    revalidatePath("/clientes");
  });
