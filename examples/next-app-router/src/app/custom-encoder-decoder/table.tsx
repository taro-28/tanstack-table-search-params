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
import { usePathname, useSearchParams } from "next/navigation";
import { useTableSearchParams } from "tanstack-table-search-params";

export const Table = () => {
  const data = useUserData();

  const query = useSearchParams();
  const pathname = usePathname();

  const stateAndOnChanges = useTableSearchParams(
    {
      replace: (url) => {
        const searchParams = new URLSearchParams(url.split("?")[1]);
        window.history.replaceState(null, "", `?${searchParams.toString()}`);
      },
      query,
      pathname,
    },
    {
      encoders: {
        globalFilter: (globalFilter) => ({
          globalFilter: JSON.stringify(globalFilter),
        }),
        sorting: (sorting) =>
          Object.fromEntries(
            sorting.map(({ id, desc }) => [
              `sorting.${id}`,
              desc ? "desc" : "asc",
            ]),
          ),
        pagination: (pagination) => ({
          pagination: JSON.stringify(pagination),
        }),
        columnFilters: (columnFilters) =>
          Object.fromEntries(
            columnFilters.map(({ id, value }) => [
              `columnFilters.${id}`,
              JSON.stringify(value),
            ]),
          ),
        columnOrder: (columnOrder) => ({
          columnOrder: JSON.stringify(columnOrder),
        }),
      },
      decoders: {
        globalFilter: (query) =>
          query["globalFilter"]
            ? JSON.parse(query["globalFilter"] as string)
            : (query["globalFilter"] ?? ""),
        sorting: (query) =>
          Object.entries(query)
            .filter(([key]) => key.startsWith("sorting."))
            .map(([key, desc]) => ({
              id: key.replace("sorting.", ""),
              desc: desc === "desc",
            })),
        pagination: (query) =>
          query["pagination"]
            ? JSON.parse(query["pagination"] as string)
            : {
                pageIndex: 0,
                pageSize: 10,
              },
        columnFilters: (query) =>
          Object.entries(query)
            .filter(([key]) => key.startsWith("columnFilters."))
            .map(([key, value]) => ({
              id: key.replace("columnFilters.", ""),
              value: JSON.parse(value as string),
            })),
        columnOrder: (query) =>
          query["columnOrder"]
            ? JSON.parse(query["columnOrder"] as string)
            : [],
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
