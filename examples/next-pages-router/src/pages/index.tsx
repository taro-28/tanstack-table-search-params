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
import { useRouter } from "next/router";
import { useTableSearchParams } from "tanstack-table-search-params";

export default function Basic() {
  const data = useUserData();

  const router = useRouter();
  const stateAndOnChanges = useTableSearchParams(router, {
    enabled: { globalFilter: false, sorting: false },
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

  return (
    <div className="space-y-2 mx-6">
      <h1 className="text-lg font-semibold">Basic</h1>
      <UserTable table={table} />
    </div>
  );
}
