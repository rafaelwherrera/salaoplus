"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";

const updateStatusSchema = z.object({
  agendamentoId: z.string(),
  status: z.enum(["confirmado", "cancelado"]),
});

export async function updateAgendamentoStatus(
  input: z.infer<typeof updateStatusSchema>,
) {
  const parsed = updateStatusSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }

  const { agendamentoId, status } = parsed.data;

  await db
    .update(appointmentsTable)
    .set({ status })
    .where(eq(appointmentsTable.id, agendamentoId));

  return { success: true };
}
