import { z } from "zod";

export const addAgendamentoSchema = z.object({
  clientId: z.string().uuid({
    message: "Cliente é obrigatório.",
  }),
  professionalId: z.string().uuid({
    message: "Profissional é obrigatório.",
  }),
  date: z.date({
    message: "Data é obrigatória.",
  }),
  time: z.string().min(1, {
    message: "Horário é obrigatório.",
  }),
  agendamentoPriceInCents: z.number().min(1, {
    message: "Valor da consulta é obrigatório.",
  }),
  status: z.enum(["confirmado", "cancelado"]).optional(),
});
