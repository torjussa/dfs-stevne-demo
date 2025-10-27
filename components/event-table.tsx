"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Competition } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EventTableProps {
  data: Competition[];
}

export function EventTable({ data }: EventTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<Competition>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2 font-semibold"
            >
              Navn
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return <div className="font-medium">{row.getValue("name")}</div>;
        },
      },
      {
        accessorKey: "eventType",
        header: "Type",
        cell: ({ row }) => {
          const eventType = row.getValue("eventType") as string;
          return (
            <Badge
              variant="outline"
              className={
                eventType === "stevne"
                  ? "border-orange-500 text-orange-600 bg-orange-50"
                  : eventType === "møte"
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-green-500 text-green-600 bg-green-50"
              }
            >
              {eventType === "stevne" && "Stevne"}
              {eventType === "møte" && "Møte"}
              {eventType === "kurs" && "Kurs"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "organizer",
        header: "Arrangør",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("organizer")}</div>
        ),
      },
      {
        accessorKey: "location",
        header: "Lokasjon",
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue("location")}</div>
        ),
      },
      {
        accessorKey: "startDate",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 px-2"
            >
              Dato
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const competition = row.original;
          return (
            <div className="text-sm">
              {competition.startDate === competition.endDate
                ? competition.startDate
                : `${competition.startDate} - ${competition.endDate}`}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge
              variant="outline"
              className={
                status === "open"
                  ? "border-green-500 text-green-600"
                  : status === "full"
                  ? "border-orange-500 text-orange-600"
                  : "border-gray-500 text-gray-600"
              }
            >
              {status === "open" && "Åpen"}
              {status === "full" && "Fullt"}
              {status === "closed" && "Lukket"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const competition = row.original;
          return (
            <Button asChild size="sm" variant="outline">
              <Link href={`/competition/${competition.id}`}>Se detaljer</Link>
            </Button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const competition = row.original;
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={(e) => {
                    // Prevent navigation if clicking on button
                    if ((e.target as HTMLElement).closest("button, a")) {
                      return;
                    }
                    router.push(`/competition/${competition.id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Ingen resultater.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
