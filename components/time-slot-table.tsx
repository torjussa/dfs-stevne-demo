"use client";

import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TimeSlot } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export type SlotRow = {
  slotKey: string;
  targetId: string;
  slot: TimeSlot;
  target: { id: string; targetNumber: number } | undefined;
  isBookedByUser: boolean;
  isAvailable: boolean;
};

interface TimeSlotTableProps {
  slots: SlotRow[];
  isAuthenticated: boolean;
  onReserve: (targetId: string, slotId: string, date: string) => void;
  onUnbook: (targetId: string, slotId: string) => void;
}

export function TimeSlotTable({
  slots,
  isAuthenticated,
  onReserve,
  onUnbook,
}: TimeSlotTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns: ColumnDef<SlotRow>[] = React.useMemo(
    () => [
      {
        accessorKey: "target.targetNumber",
        header: "Skive",
        cell: ({ row }) => (
          <span className="font-semibold">
            {row.original.target?.targetNumber}
          </span>
        ),
      },
      {
        accessorKey: "slot.bookedByName",
        header: "Navn",
        cell: ({ row }) =>
          row.original.slot.isBooked && row.original.slot.bookedByName ? (
            <span className="text-sm truncate block">
              {row.original.slot.bookedByName}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          ),
      },
      {
        accessorKey: "slot.bookedByClass",
        header: "Klasse",
        cell: ({ row }) =>
          row.original.slot.isBooked && row.original.slot.bookedByClass ? (
            <span className="text-sm font-medium">
              {row.original.slot.bookedByClass}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          ),
      },
      {
        id: "actions",
        header: "Status",
        cell: ({ row }) => {
          const { slot, isBookedByUser, isAvailable } = row.original;

          return (
            <div className="flex items-center justify-end gap-2">
              {slot.isBooked ? (
                isBookedByUser ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onUnbook(slot.targetId, slot.id)}
                  >
                    Meld av
                  </Button>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-foreground/80 border-border"
                  >
                    Reservert
                  </Badge>
                )
              ) : slot.isLocked ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 cursor-default">
                      Låst
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      En annen skytter holder på å reservere denne tiden.
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : !isAuthenticated && !slot.isBooked && !slot.isLocked ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                  Ledig
                </Badge>
              ) : !isAvailable && slot.allowedClasses ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-gray-200 text-gray-600 border-gray-300 cursor-default flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      Kun {slot.allowedClasses.join(", ")}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <div className="font-medium mb-1">
                        Begrenset til klasser:
                      </div>
                      <div>{slot.allowedClasses.join(", ")}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : !isAvailable ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-gray-200 text-gray-600 border-gray-300 cursor-default flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      Utilgjengelig
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      Ikke tilgjengelig for dine klasser.
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : slot.allowedClasses && slot.allowedClasses.length > 0 ? (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="sm"
                      onClick={() =>
                        onReserve(row.original.targetId, slot.id, slot.date)
                      }
                    >
                      Reserver
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <div className="font-medium mb-1">
                        Begrenset til klasser:
                      </div>
                      <div>{slot.allowedClasses.join(", ")}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : isAuthenticated && isAvailable ? (
                <Button
                  size="sm"
                  onClick={() =>
                    onReserve(row.original.targetId, slot.id, slot.date)
                  }
                >
                  Reserver
                </Button>
              ) : null}
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [isAuthenticated, onReserve, onUnbook]
  );

  const table = useReactTable({
    data: slots,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Ingen ledige tider.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
