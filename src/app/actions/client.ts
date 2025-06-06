"use server";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

const upsertClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  sex: z.enum(["male", "female"]),
});

export async function upsertClient(input: z.infer<typeof upsertClientSchema>) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id, ...data } = upsertClientSchema.parse(input);

  if (id) {
    await db
      .update(clientsTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(clientsTable.id, id));
  } else {
    await db.insert(clientsTable).values({
      id: nanoid(),
      ...data,
      salonId: session.user.salonId,
    });
  }

  revalidatePath("/protected/clients");
}
