"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { professionalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { upsertProfissionalSchema } from "./schema";

export const upsertProfissional = actionClient
  .schema(upsertProfissionalSchema)
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
    await db
      .insert(professionalsTable)
      .values({
        id: parsedInput.id || "",
        name: parsedInput.name,
        appointmentPriceInCents: parsedInput.appointmentPriceInCents,
        availableFromWeekDay: parsedInput.availableFromWeekDay,
        availableToWeekDay: parsedInput.availableToWeekDay,
        availableFromTime: parsedInput.availableFromTime,
        availableToTime: parsedInput.availableToTime,
        salonId: session?.user.salon?.id,
        specialty: parsedInput.speciality,
      })
      .onConflictDoUpdate({
        target: [professionalsTable.id],
        set: {
          name: parsedInput.name,
          appointmentPriceInCents: parsedInput.appointmentPriceInCents,
          availableFromWeekDay: parsedInput.availableFromWeekDay,
          availableToWeekDay: parsedInput.availableToWeekDay,
          availableFromTime: parsedInput.availableFromTime,
          availableToTime: parsedInput.availableToTime,
          salonId: session?.user.salon?.id,
          specialty: parsedInput.speciality,
        },
      });
  });
