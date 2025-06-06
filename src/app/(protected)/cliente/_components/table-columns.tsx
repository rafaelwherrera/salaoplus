"use client";

import { ColumnDef } from "@tanstack/react-table";

import { clientsTable } from "@/db/schema";

import ClienteTableActions from "./table-actions";

type Client = typeof clientsTable.$inferSelect;

export const clientsTableColumns: ColumnDef<Client>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: (params) => {
      const client = params.row.original;
      const phoneNumber = client.phoneNumber;
      if (!phoneNumber) return "";
      const formatted = phoneNumber.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3",
      );
      return formatted;
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
    cell: (params) => {
      const client = params.row.original;
      return client.sex === "male" ? "Masculino" : "Feminino";
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const client = params.row.original;
      return <ClienteTableActions client={client} />;
    },
  },
];
