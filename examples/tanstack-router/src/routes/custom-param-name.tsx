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

export const Route = createFileRoute("/custom-param-name")({
  component: Page,
});

function Page() {
  const data = useUserData();

  const navigate = Route.useNavigate();
  const query = Route.useSearch();

  const stateAndOnChanges = useTableSearchParams(
    {
      push: (url) => {
        const searchParams = new URLSearchParams(url.split("?")[1]);
        navigate({ search: Object.fromEntries(searchParams.entries()) });
      },
      query,
    },
    {
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
      <h1 className="text-lg font-semibold">Custom query param name</h1>
      <UserTable table={table} />
    </div>
  );
}
