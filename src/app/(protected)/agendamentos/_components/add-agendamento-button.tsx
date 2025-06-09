"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { clientsTable, professionalsTable } from "@/db/schema";

import AddAgendamentoForm from "./add-appointment-form";

interface AddAgendamentoButtonProps {
  clients: (typeof clientsTable.$inferSelect)[];
  professionals: (typeof professionalsTable.$inferSelect)[];
}

const AddAgendamentoButton = ({
  clients,
  professionals,
}: AddAgendamentoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <AddAgendamentoForm
        isOpen={isOpen}
        clients={clients}
        professionals={professionals}
        onSuccess={() => setIsOpen(false)}
        isEdit={false}
      />
    </Dialog>
  );
};

export default AddAgendamentoButton;
