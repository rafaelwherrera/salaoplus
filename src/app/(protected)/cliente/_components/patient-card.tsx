"use client";

import { Mail, Phone, User } from "lucide-react";
import { useState } from "react";

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
import { UpsertClienteForm } from "@/components/UpsertClienteForm";
import { clientsTable } from "@/db/schema";

interface ClientCardProps {
  client: typeof clientsTable.$inferSelect;
}

const ClientCard = ({ client }: ClientCardProps) => {
  const [isUpsertClientDialogOpen, setIsUpsertClientDialogOpen] =
    useState(false);

  const clientInitials = client.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");
    // Format as (XX) XXXXX-XXXX
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getSexLabel = (sex: "male" | "female") => {
    return sex === "male" ? "Masculino" : "Feminino";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{clientInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{client.name}</h3>
            <p className="text-muted-foreground text-sm">
              {getSexLabel(client.sex)}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <Mail className="mr-1 h-3 w-3" />
          {client.email}
        </Badge>
        <Badge variant="outline">
          <Phone className="mr-1 h-3 w-3" />
          {formatPhoneNumber(client.phoneNumber)}
        </Badge>
        <Badge variant="outline">
          <User className="mr-1 h-3 w-3" />
          {getSexLabel(client.sex)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog
          open={isUpsertClientDialogOpen}
          onOpenChange={setIsUpsertClientDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertClienteForm
            initialData={client}
            onSuccess={() => setIsUpsertClientDialogOpen(false)}
            isOpen={isUpsertClientDialogOpen}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
