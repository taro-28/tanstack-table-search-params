"use client";

import { UserTable } from "@examples/lib/src/components/UserTable";
import {
  userColumns,
  useUserData,
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

  const { replace } = useRouter();
  const stateAndOnChanges = useTableSearchParams(
    {
      pathname: usePathname(),
      query: useSearchParams(),
      replace,
    },
    {
      defaultValues: {
        globalFilter: "a",
        sorting: [{ id: "name", desc: true }],
        pagination: { pageIndex: 2, pageSize: 20 },
        columnFilters: [{ id: "name", value: "b" }],
        columnOrder: userColumns.reverse().map((c) => c.id as string),
        rowSelection: { "1": true },
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
