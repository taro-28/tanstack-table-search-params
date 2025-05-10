import { UserTable } from "@examples/lib/src/components/UserTable";
import {
  useUserData,
  userColumns,
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

export const Route = createFileRoute("/custom-default-value")({
  component: Page,
});

function Page() {
  const data = useUserData();

  const navigate = Route.useNavigate();
  const query = Route.useSearch();

  const stateAndOnChanges = useTableSearchParams(
    {
      replace: (url) => {
        const searchParams = new URLSearchParams(url.split("?")[1]);
        navigate({
          search: Object.fromEntries(searchParams.entries()),
          replace: true,
        });
      },
      query,
      pathname: Route.path,
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

  return (
    <div className="space-y-2 mx-6">
      <h1 className="text-lg font-semibold">Custom default value</h1>
      <UserTable table={table} />
    </div>
  );
}
