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
import { useRouter, useSearchParams } from "next/navigation";
import { useTableSearchParams } from "tanstack-table-search-params";

export const Table = () => {
  const data = useUserData();

  const push = useRouter().push;
  const query = useSearchParams();

  const router = { push, query };

  const stateAndOnChanges = useTableSearchParams(router, {
    globalFilter: {
      paramName: "userTable-globalFilter",
    },
    sorting: {
      paramName: (defaultParamName) => `userTable-${defaultParamName}`,
    },
    pagination: {
      paramName: {
        pageIndex: "userTable-pageIndex",
        pageSize: "userTable-pageSize",
      },
    },
    columnFilters: {
      paramName: (defaultParamName) => `userTable-${defaultParamName}`,
    },
  });

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
