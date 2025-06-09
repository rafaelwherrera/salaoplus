"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateAgendamentoStatus } from "@/actions/upsert-status-agendamento/update-agendamento-status";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appointmentsTable } from "@/db/schema";

import AppointmentsTableActions from "./table-actions";

interface StatusDropdownProps {
  agendamentoId: string;
  currentStatus: "confirmado" | "cancelado";
  onStatusChange?: (newStatus: "confirmado" | "cancelado") => void;
}

export const StatusDropdown = ({
  agendamentoId,
  currentStatus,
  onStatusChange,
}: StatusDropdownProps) => {
  const [, startTransition] = useTransition();

  const handleChange = (newStatus: "confirmado" | "cancelado") => {
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      try {
        await updateAgendamentoStatus({ agendamentoId, status: newStatus });
        toast.success("Status atualizado com sucesso.");
        onStatusChange?.(newStatus);
      } catch {
        toast.error("Erro ao atualizar status.");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`capitalize ${
            currentStatus === "confirmado"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          {currentStatus}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => handleChange("confirmado")}>
          Confirmado
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("cancelado")}>
          Cancelado
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  client: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    sex: "male" | "female";
  };
  professional: {
    id: string;
    name: string;
    specialty: string;
  };
};

export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: "client",
    accessorKey: "client.name",
    header: "Cliente",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.client.name}</span>
    ),
  },
  {
    id: "professional",
    accessorKey: "professional.name",
    header: "Profissional",
    cell: ({ row }) => row.original.professional.name,
  },
  {
    id: "specialty",
    accessorKey: "professional.specialty",
    header: "Especialidade",
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) =>
      format(new Date(row.original.date), "dd/MM/yyyy", { locale: ptBR }),
    filterFn: (row, columnId, value) => {
      if (!value) return true; // sem filtro, mostra tudo
      const rowDate = format(new Date(row.getValue(columnId)), "yyyy-MM-dd");
      return rowDate === value; // compara só o dia (string yyyy-MM-dd)
    },
  },
  {
    id: "time",
    accessorKey: "time",
    header: "Horário",
    cell: ({ row }) => {
      return row.original.time;
    },
  },
  {
    id: "price",
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell: ({ row }) => {
      const price = row.original.appointmentPriceInCents / 100;
      return (
        <span className="text-sm font-semibold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(price)}
        </span>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const agendamentoId = row.original.id;
      const status = row.original.status as "confirmado" | "cancelado";

      return (
        <StatusDropdown
          agendamentoId={agendamentoId}
          currentStatus={status}
          onStatusChange={() => {}}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: (info) => (
      <AppointmentsTableActions
        appointment={info.row.original}
        clients={[]}
        professionals={[]}
      />
    ),
  },
];
