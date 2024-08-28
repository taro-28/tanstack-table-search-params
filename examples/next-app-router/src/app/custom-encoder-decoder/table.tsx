"use client";

import { UserTable } from "@examples/lib/src/components/UserTable";
import {
  useUserData,
  userColumns,
} from "@examples/lib/src/components/userData";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTableSearchParams } from "tanstack-table-search-params";

export const Table = () => {
  const data = useUserData();

  const push = useRouter().push;
  const query = useSearchParams();
  const pathname = usePathname();

  const stateAndOnChanges = useTableSearchParams(
    { push, query, pathname },
    {
      globalFilter: {
        encoder: (globalFilter) => ({
          globalFilter: JSON.stringify(globalFilter),
        }),
        decoder: (query) =>
          query["globalFilter"]
            ? JSON.parse(query["globalFilter"] as string)
            : query["globalFilter"] ?? "",
      },
      sorting: {
        encoder: (sorting) =>
          Object.fromEntries(
            sorting.map(({ id, desc }) => [
              `sorting.${id}`,
              desc ? "desc" : "asc",
            ]),
          ),
        decoder: (query) =>
          Object.entries(query)
            .filter(([key]) => key.startsWith("sorting."))
            .map(([key, desc]) => ({
              id: key.replace("sorting.", ""),
              desc: desc === "desc",
            })),
      },
      pagination: {
        encoder: (pagination) => ({
          pagination: JSON.stringify(pagination),
        }),
        decoder: (query) =>
          query["pagination"]
            ? JSON.parse(query["pagination"] as string)
            : {
                pageIndex: 0,
                pageSize: 10,
              },
      },
      columnFilters: {
        encoder: (columnFilters) =>
          Object.fromEntries(
            columnFilters.map(({ id, value }) => [
              `columnFilters.${id}`,
              JSON.stringify(value),
            ]),
          ),
        decoder: (query) =>
          Object.entries(query)
            .filter(([key]) => key.startsWith("columnFilters."))
            .map(([key, value]) => ({
              id: key.replace("columnFilters.", ""),
              value: JSON.parse(value as string),
            })),
      },
    },
  );

  const table = useReactTable({
    data,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...stateAndOnChanges,
  });
  return <UserTable table={table} />;
};
