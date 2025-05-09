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

  const { replace } = useRouter();
  const stateAndOnChanges = useTableSearchParams(
    {
      pathname: usePathname(),
      query: useSearchParams(),
      replace,
    },
    {
      debounceMilliseconds: {
        globalFilter: 1000,
        sorting: 1000,
        pagination: 1000,
        columnFilters: 1000,
        columnOrder: 1000,
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
