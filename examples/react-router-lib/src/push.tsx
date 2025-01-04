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
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useTableSearchParams } from "tanstack-table-search-params";

export default function PushPage() {
  const data = useUserData();

  const [query] = useSearchParams();
  const push = useNavigate();
  const { pathname } = useLocation();
  const stateAndOnChanges = useTableSearchParams({ query, pathname, push });

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
      <h1 className="text-lg font-semibold">Push(instead of replace)</h1>
      <UserTable table={table} />
    </div>
  );
}
