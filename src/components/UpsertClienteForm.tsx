"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { z } from "zod";

import { upsertClient } from "@/actions/upsert-cliente";
import { Button } from "@/components/ui/button";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phoneNumber: z.string().min(1, "O telefone é obrigatório"),
  sex: z.enum(["male", "female"], {
    required_error: "O sexo é obrigatório",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  initialData?: FormData;
  onSuccess?: () => void;
}

export function UpsertClienteForm({ initialData, onSuccess }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phoneNumber: "",
      sex: undefined,
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      await upsertClient(data);
      form.reset();
      onSuccess?.();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome do cliente" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email do cliente" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <IMaskInput mask="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="male">Masculino</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
