"use client";

import {
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  PencilIcon,
} from "lucide-react";

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

import UpsertProfissional from "../_components/upsert-profissional";
import { getAvailability } from "../profissionais/_helpers/availability";

interface ProfissionalCardProps {
  profissional: typeof professionalsTable.$inferSelect;
}

const ProfissionalCard = ({ profissional }: ProfissionalCardProps) => {
  const profissionalInitials = profissional.name
    .split(" ")
    .map((name) => name[0])
    .join("");
  const availability = getAvailability(profissional);
  return (
    <Card className="bg-pink-100">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
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
      <CardContent className="flex flex-col gap-2">
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
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full cursor-pointer bg-pink-500 text-white hover:bg-pink-600 hover:text-white"
            >
              <PencilIcon className="mr-1" />
              Ver Detalhes
            </Button>
          </DialogTrigger>
          <UpsertProfissional professional={profissional} />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ProfissionalCard;
