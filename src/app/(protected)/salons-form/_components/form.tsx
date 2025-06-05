"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createSalon } from "@/actions/create-salon";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
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

// Schema
const salonsFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  zipCode: z.string().min(8, "CEP é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  number: z.string().optional(),
  complement: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
});

const SalonsForm = () => {
  const form = useForm<z.infer<typeof salonsFormSchema>>({
    resolver: zodResolver(salonsFormSchema),
    defaultValues: {
      name: "",
      zipCode: "",
      street: "",
      neighborhood: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      phone: "",
    },
  });

  // Autocomplete de endereço via ViaCEP
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "zipCode") {
        const zip = value.zipCode?.replace(/\D/g, "");
        if (zip?.length === 8) {
          fetch(`https://viacep.com.br/ws/${zip}/json/`)
            .then((res) => res.json())
            .then((data) => {
              if (data.erro) {
                toast.error("CEP não encontrado");
                return;
              }
              form.setValue("street", data.logradouro || "");
              form.setValue("neighborhood", data.bairro || "");
              form.setValue("city", data.localidade || "");
              form.setValue("state", data.uf || "");
            })
            .catch(() => toast.error("Erro ao buscar o CEP"));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: z.infer<typeof salonsFormSchema>) => {
    try {
      await createSalon(
        data.name,
        data.street,
        data.number || "",
        data.complement || "",
        data.neighborhood,
        data.city,
        data.state,
        data.zipCode,
        data.phone,
      );
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }
      console.error(error);
      toast.error("Erro ao criar salão");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Salão da Maria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem className="col-span-full flex flex-col items-center">
              <FormLabel className="text-center">CEP</FormLabel>
              <FormControl>
                <Input
                  className="col-span-4 w-60 text-center"
                  placeholder="Digite o CEP"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input placeholder="Rua principal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input placeholder="Bairro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input placeholder="Opcional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Cidade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Estado</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AC">Acre</SelectItem>
                  <SelectItem value="AL">Alagoas</SelectItem>
                  <SelectItem value="AP">Amapá</SelectItem>
                  <SelectItem value="AM">Amazonas</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="MA">Maranhão</SelectItem>
                  <SelectItem value="MT">Mato Grosso</SelectItem>
                  <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PA">Pará</SelectItem>
                  <SelectItem value="PB">Paraíba</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="PI">Piauí</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="RO">Rondônia</SelectItem>
                  <SelectItem value="RR">Roraima</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="SE">Sergipe</SelectItem>
                  <SelectItem value="TO">Tocantins</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-3">
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(11) 91234-5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-4">
          <DialogFooter>
            <DialogClose asChild />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.formState.isSubmitting ? "Criando..." : "Criar Salão"}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
};

export default SalonsForm;
