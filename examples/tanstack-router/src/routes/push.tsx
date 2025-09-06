import { UserTable } from "@examples/lib/src/components/UserTable";
import {
  userColumns,
  useUserData,
} from "@examples/lib/src/components/userData";
import { createFileRoute } from "@tanstack/react-router";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTableSearchParams } from "tanstack-table-search-params";

export const Route = createFileRoute("/push")({ component: Page });

function Page() {
  const data = useUserData();

  const navigate = Route.useNavigate();
  const query = Route.useSearch();

  const stateAndOnChanges = useTableSearchParams({
    push: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: Route.path,
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
      <h1 className="text-lg font-semibold">Push(instead of replace)</h1>
      <UserTable table={table} />
    </div>
  );
}
