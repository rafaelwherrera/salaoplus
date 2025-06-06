"use client";

import {
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  TrashIcon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteProfissional } from "@/actions/delete-profissional";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { professionalsTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

import { getAvailability } from "../_helpers/availability";
import UpsertProfissional from "./upsert-profissional";

interface ProfissionalCardProps {
  profissional: typeof professionalsTable.$inferSelect;
}

const ProfissionalCard = ({ profissional }: ProfissionalCardProps) => {
  const [isUpsertProfissionalDialogOpen, setIsUpsertProfissionalDialogOpen] =
    useState(false);
  const deleteProfissionalAction = useAction(deleteProfissional, {
    onSuccess: () => {
      toast.success("Profissional deletado com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao deletar profissional.");
    },
  });
  const handleDeleteProfissionalClick = () => {
    if (!profissional) return;
    deleteProfissionalAction.execute({ id: profissional.id });
  };

  const profissionalInitials = profissional.name
    .split(" ")
    .map((name) => name[0])
    .join("");
  const availability = getAvailability(profissional);

  return (
    <Card className="bg-pink-100">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{profissionalInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{profissional.name}</h3>
            <p className="text-muted-foreground text-xs">
              {profissional.specialty}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-1">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          {availability.from.format("dddd")} a {availability.to.format("dddd")}
        </Badge>
        <Badge variant="outline">
          <ClockIcon className="mr-1" />
          {availability.from.format("HH:mm")} às{" "}
          {availability.to.format("HH:mm")}
        </Badge>
        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {formatCurrencyInCents(profissional.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog
          open={isUpsertProfissionalDialogOpen}
          onOpenChange={setIsUpsertProfissionalDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full cursor-pointer">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertProfissional
            professional={{
              ...profissional,
              availableFromTime: availability.from.format("HH:mm:ss"),
              availableToTime: availability.to.format("HH:mm:ss"),
            }}
            onSuccess={() => setIsUpsertProfissionalDialogOpen(false)}
            isOpen={isUpsertProfissionalDialogOpen}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full cursor-pointer">
              <TrashIcon />
              Deletar profissional
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja deletar esse profissional?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser revertida. Isso irá deletar o
                profissional e todas as consultas agendadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={handleDeleteProfissionalClick}
              >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ProfissionalCard;
