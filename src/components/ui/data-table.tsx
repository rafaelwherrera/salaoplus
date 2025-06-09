"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { CalendarIcon } from "lucide-react";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  filters?: {
    id: string;
    label: string;
    placeholder?: string;
    options?: string[];
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
}: DataTableProps<TData, TValue>) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    filters?.map((filter) => ({
      id: filter.id,
      value: "",
    })) || [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        setColumnFilters(updaterOrValue(columnFilters));
      } else {
        setColumnFilters(updaterOrValue);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const renderFilter = (filterId: string) => {
    const filter = filters?.find((f) => f.id === filterId);
    if (!filter) return null;
    const column = table.getColumn(filter.id);
    if (!column) return null;

    const currentValue =
      (columnFilters.find((f) => f.id === filter.id)?.value as string) || "";

    // Filtro de data personalizado
    if (filter.id === "date") {
      const selectedDate = column.getFilterValue()
        ? new Date(`${column.getFilterValue()}T12:00:00`)
        : undefined;

      return (
        <div key={filter.id} className="flex flex-col">
          <label className="text-muted-foreground mb-1 text-sm font-medium">
            {filter.label}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-pink-500" />
                {selectedDate
                  ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                  : "Escolher data"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="flex w-auto flex-col gap-4 rounded-xl border border-pink-500 bg-white p-4 shadow-md">
              {/* Botões rápidos */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                  onClick={() => {
                    const today = new Date();
                    setSelectedDate(today);
                    column.setFilterValue(format(today, "yyyy-MM-dd"));
                  }}
                >
                  Hoje
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                  onClick={() => {
                    setSelectedDate(undefined);
                    column.setFilterValue(undefined);
                  }}
                >
                  Limpar
                </Button>
              </div>

              {/* Calendário */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  column.setFilterValue(
                    date ? format(date, "yyyy-MM-dd") : undefined,
                  );
                }}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    }

    // Filtro com opções pré-definidas (ex: status)
    if (filter.options) {
      return (
        <div key={filter.id} className="flex flex-col">
          <label className="text-muted-foreground text-sm font-medium">
            {filter.label}
          </label>
          <select
            value={currentValue}
            onChange={(e) => column.setFilterValue(e.target.value)}
            className="rounded-md border px-2 py-1"
          >
            <option value="">Todos</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // Filtro de texto genérico
    return (
      <div key={filter.id} className="flex flex-col">
        <label className="text-muted-foreground text-sm font-medium">
          {filter.label}
        </label>
        <input
          type="text"
          placeholder={filter.placeholder}
          value={currentValue}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="rounded-md border px-2 py-1"
        />
      </div>
    );
  };

  return (
    <>
      {/* Filtros antes da tabela, exceto status */}
      {filters && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          {/* Filtros exceto status, alinhados à esquerda */}
          <div className="flex flex-wrap gap-4">
            {filters
              .filter((filter) => filter.id !== "status")
              .map((filter) => renderFilter(filter.id))}
          </div>

          {/* Filtro de status, alinhado à direita */}
          <div>{renderFilter("status")}</div>
        </div>
      )}

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
