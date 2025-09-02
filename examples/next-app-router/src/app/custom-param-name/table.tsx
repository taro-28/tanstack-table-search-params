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
      paramNames: {
        globalFilter: "userTable-globalFilter",
        sorting: (defaultParamName) => `userTable-${defaultParamName}`,
        pagination: {
          pageIndex: "userTable-pageIndex",
          pageSize: "userTable-pageSize",
        },
        columnFilters: (defaultParamName) => `userTable-${defaultParamName}`,
        columnOrder: (defaultParamName) => `userTable-${defaultParamName}`,
        rowSelection: (defaultParamName) => `userTable-${defaultParamName}`,
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
