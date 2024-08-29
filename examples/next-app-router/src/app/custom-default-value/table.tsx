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
      defaultValues: {
        globalFilter: "a",
        sorting: [{ id: "name", desc: true }],
        pagination: { pageIndex: 2, pageSize: 20 },
        columnFilters: [{ id: "name", value: "b" }],
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
