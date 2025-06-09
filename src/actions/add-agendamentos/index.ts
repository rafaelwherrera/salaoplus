"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";

import { getAvailableTimes } from "../get-available-times";
import { addAgendamentoSchema } from "./schema";

export const addAgendamento = actionClient
  .schema(addAgendamentoSchema)
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
    const availableTimes = await getAvailableTimes({
      professionalId: parsedInput.professionalId,
      date: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    });
    if (!availableTimes?.data) {
      throw new Error("No available times");
    }
    const isTimeAvailable = availableTimes.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    );
    if (!isTimeAvailable) {
      throw new Error("Time not available");
    }
    const agendamentoDateTime = dayjs(parsedInput.date)
      .set("hour", parseInt(parsedInput.time.split(":")[0]))
      .set("minute", parseInt(parsedInput.time.split(":")[1]))
      .toDate();

    await db.insert(appointmentsTable).values({
      id: crypto.randomUUID(),
      clientId: parsedInput.clientId,
      professionalId: parsedInput.professionalId,
      date: agendamentoDateTime,
      appointmentPriceInCents: parsedInput.agendamentoPriceInCents,
      salonId: session?.user.salon?.id,
      time: parsedInput.time,
      status: parsedInput.status || "confirmado",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/agendamentos");
  });
