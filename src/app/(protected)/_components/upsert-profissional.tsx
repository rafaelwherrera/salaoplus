import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertProfissional } from "@/actions/upsert-profissional";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { professionalsTable } from "@/db/schema";

const formSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    phone: z.string().trim().min(1, { message: "Telefone é obrigatório" }),
    speciality: z
      .string()
      .trim()
      .min(1, { message: "Especialidade é obrigatória" }),
    appointmentPriceInCents: z
      .number()
      .min(1, { message: "Preço do agendamento é obrigatório" }),
    availableFromWeekDay: z
      .string()
      .min(1, { message: "Dia da semana de início é obrigatório" }),
    availableToWeekDay: z
      .string()
      .min(1, { message: "Dia da semana de término é obrigatório" }),
    availableFromTime: z
      .string()
      .min(1, { message: "Horário de início é obrigatório" }),
    availableToTime: z
      .string()
      .min(1, { message: "Horário de término é obrigatório" }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message:
        "O horário de início não pode ser anterior ao horário de término.",
      path: ["availableToTime"],
    },
  );

interface UpsertProfissionalProps {
  professional?: typeof professionalsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertProfissional = ({
  professional,
  onSuccess,
}: UpsertProfissionalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: professional?.name ?? "",
      phone: professional?.phone ?? "",
      speciality: professional?.specialty ?? "",
      appointmentPriceInCents: professional?.appointmentPriceInCents
        ? professional.appointmentPriceInCents / 100
        : 1,
      availableFromWeekDay:
        professional?.availableFromWeekDay?.toString() ?? "1",
      availableToWeekDay: professional?.availableToWeekDay?.toString() ?? "5",
      availableFromTime: professional?.availableFromTime ?? "",
      availableToTime: professional?.availableToTime ?? "",
    },
  });
  const upsertProfissionalAction = useAction(upsertProfissional, {
    onSuccess: () => {
      toast.success("Profissional adicionado com sucesso.");
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao adicionar profissional.");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertProfissionalAction.execute({
      ...values,
      id: professional?.id,
      availableFromWeekDay: parseInt(values.availableFromWeekDay),
      availableToWeekDay: parseInt(values.availableToWeekDay),
      appointmentPriceInCents: values.appointmentPriceInCents * 100,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {professional ? professional.name : "Adicionar profissional"}
        </DialogTitle>
        <DialogDescription>
          {professional
            ? "Edite as informações desse profissional."
            : "Adicione um novo profissional ao seu salão."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* DADOS PESSOAIS */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="speciality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentPriceInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço da consulta</FormLabel>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$ "
                    className="border-input w-full rounded-xl border px-3 py-2"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* DISPONIBILIDADE DE DIAS */}
          <div className="w-full">
            <h4 className="text-muted-foreground mb-4 text-center font-semibold">
              Disponibilidade Semanal
            </h4>

            <div className="flex w-full flex-col justify-center gap-4 md:flex-row">
              <div className="w-full md:w-1/2">
                <FormField
                  control={form.control}
                  name="availableFromWeekDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia inicial</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-xl">
                            <SelectValue placeholder="Selecione um dia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Domingo",
                            "Segunda",
                            "Terça",
                            "Quarta",
                            "Quinta",
                            "Sexta",
                            "Sábado",
                          ].map((day, i) => (
                            <SelectItem key={i} value={String(i)}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full md:w-1/2">
                <FormField
                  control={form.control}
                  name="availableToWeekDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia final</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-xl">
                            <SelectValue placeholder="Selecione um dia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Domingo",
                            "Segunda",
                            "Terça",
                            "Quarta",
                            "Quinta",
                            "Sexta",
                            "Sábado",
                          ].map((day, i) => (
                            <SelectItem key={i} value={String(i)}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* DISPONIBILIDADE DE HORÁRIOS */}
          <div>
            <h4 className="text-muted-foreground mb-2 text-center font-semibold">
              Horários de Atendimento
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="availableFromTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário inicial de disponibilidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Manhã</SelectLabel>
                          <SelectItem value="05:00:00">05:00</SelectItem>
                          <SelectItem value="05:30:00">05:30</SelectItem>
                          <SelectItem value="06:00:00">06:00</SelectItem>
                          <SelectItem value="06:30:00">06:30</SelectItem>
                          <SelectItem value="07:00:00">07:00</SelectItem>
                          <SelectItem value="07:30:00">07:30</SelectItem>
                          <SelectItem value="08:00:00">08:00</SelectItem>
                          <SelectItem value="08:30:00">08:30</SelectItem>
                          <SelectItem value="09:00:00">09:00</SelectItem>
                          <SelectItem value="09:30:00">09:30</SelectItem>
                          <SelectItem value="10:00:00">10:00</SelectItem>
                          <SelectItem value="10:30:00">10:30</SelectItem>
                          <SelectItem value="11:00:00">11:00</SelectItem>
                          <SelectItem value="11:30:00">11:30</SelectItem>
                          <SelectItem value="12:00:00">12:00</SelectItem>
                          <SelectItem value="12:30:00">12:30</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Tarde</SelectLabel>
                          <SelectItem value="13:00:00">13:00</SelectItem>
                          <SelectItem value="13:30:00">13:30</SelectItem>
                          <SelectItem value="14:00:00">14:00</SelectItem>
                          <SelectItem value="14:30:00">14:30</SelectItem>
                          <SelectItem value="15:00:00">15:00</SelectItem>
                          <SelectItem value="15:30:00">15:30</SelectItem>
                          <SelectItem value="16:00:00">16:00</SelectItem>
                          <SelectItem value="16:30:00">16:30</SelectItem>
                          <SelectItem value="17:00:00">17:00</SelectItem>
                          <SelectItem value="17:30:00">17:30</SelectItem>
                          <SelectItem value="18:00:00">18:00</SelectItem>
                          <SelectItem value="18:30:00">18:30</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Noite</SelectLabel>
                          <SelectItem value="19:00:00">19:00</SelectItem>
                          <SelectItem value="19:30:00">19:30</SelectItem>
                          <SelectItem value="20:00:00">20:00</SelectItem>
                          <SelectItem value="20:30:00">20:30</SelectItem>
                          <SelectItem value="21:00:00">21:00</SelectItem>
                          <SelectItem value="21:30:00">21:30</SelectItem>
                          <SelectItem value="22:00:00">22:00</SelectItem>
                          <SelectItem value="22:30:00">22:30</SelectItem>
                          <SelectItem value="23:00:00">23:00</SelectItem>
                          <SelectItem value="23:30:00">23:30</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableToTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário final de disponibilidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Manhã</SelectLabel>
                          <SelectItem value="05:00:00">05:00</SelectItem>
                          <SelectItem value="05:30:00">05:30</SelectItem>
                          <SelectItem value="06:00:00">06:00</SelectItem>
                          <SelectItem value="06:30:00">06:30</SelectItem>
                          <SelectItem value="07:00:00">07:00</SelectItem>
                          <SelectItem value="07:30:00">07:30</SelectItem>
                          <SelectItem value="08:00:00">08:00</SelectItem>
                          <SelectItem value="08:30:00">08:30</SelectItem>
                          <SelectItem value="09:00:00">09:00</SelectItem>
                          <SelectItem value="09:30:00">09:30</SelectItem>
                          <SelectItem value="10:00:00">10:00</SelectItem>
                          <SelectItem value="10:30:00">10:30</SelectItem>
                          <SelectItem value="11:00:00">11:00</SelectItem>
                          <SelectItem value="11:30:00">11:30</SelectItem>
                          <SelectItem value="12:00:00">12:00</SelectItem>
                          <SelectItem value="12:30:00">12:30</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Tarde</SelectLabel>
                          <SelectItem value="13:00:00">13:00</SelectItem>
                          <SelectItem value="13:30:00">13:30</SelectItem>
                          <SelectItem value="14:00:00">14:00</SelectItem>
                          <SelectItem value="14:30:00">14:30</SelectItem>
                          <SelectItem value="15:00:00">15:00</SelectItem>
                          <SelectItem value="15:30:00">15:30</SelectItem>
                          <SelectItem value="16:00:00">16:00</SelectItem>
                          <SelectItem value="16:30:00">16:30</SelectItem>
                          <SelectItem value="17:00:00">17:00</SelectItem>
                          <SelectItem value="17:30:00">17:30</SelectItem>
                          <SelectItem value="18:00:00">18:00</SelectItem>
                          <SelectItem value="18:30:00">18:30</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Noite</SelectLabel>
                          <SelectItem value="19:00:00">19:00</SelectItem>
                          <SelectItem value="19:30:00">19:30</SelectItem>
                          <SelectItem value="20:00:00">20:00</SelectItem>
                          <SelectItem value="20:30:00">20:30</SelectItem>
                          <SelectItem value="21:00:00">21:00</SelectItem>
                          <SelectItem value="21:30:00">21:30</SelectItem>
                          <SelectItem value="22:00:00">22:00</SelectItem>
                          <SelectItem value="22:30:00">22:30</SelectItem>
                          <SelectItem value="23:00:00">23:00</SelectItem>
                          <SelectItem value="23:30:00">23:30</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* BOTÃO */}
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={upsertProfissionalAction.isPending}
              className="w-full cursor-pointer rounded-xl py-6 text-base"
            >
              {upsertProfissionalAction.isPending
                ? "Salvando..."
                : professional
                  ? "Salvar"
                  : "Adicionar Profissional"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertProfissional;
