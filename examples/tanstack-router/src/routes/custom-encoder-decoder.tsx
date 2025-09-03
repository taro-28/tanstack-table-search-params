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

export const Route = createFileRoute("/custom-encoder-decoder")({
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
      encoders: {
        globalFilter: (globalFilter) => ({
          globalFilter: JSON.stringify(globalFilter),
        }),
        sorting: (sorting) =>
          Object.fromEntries(
            sorting.map(({ id, desc }) => [
              `sorting.${id}`,
              desc ? "desc" : "asc",
            ]),
          ),
        pagination: (pagination) => ({
          pagination: JSON.stringify(pagination),
        }),
        columnFilters: (columnFilters) =>
          Object.fromEntries(
            columnFilters.map(({ id, value }) => [
              `columnFilters.${id}`,
              JSON.stringify(value),
            ]),
          ),
        columnOrder: (columnOrder) => ({
          columnOrder: JSON.stringify(columnOrder),
        }),
        rowSelection: (rowSelection) => ({
          rowSelection: JSON.stringify(rowSelection),
        }),
      },
      decoders: {
        globalFilter: (query) =>
          query["globalFilter"]
            ? JSON.parse(query["globalFilter"] as string)
            : (query["globalFilter"] ?? ""),
        sorting: (query) =>
          Object.entries(query)
            .filter(([key]) => key.startsWith("sorting."))
            .map(([key, desc]) => ({
              id: key.replace("sorting.", ""),
              desc: desc === "desc",
            })),
        pagination: (query) =>
          query["pagination"]
            ? JSON.parse(query["pagination"] as string)
            : {
                pageIndex: 0,
                pageSize: 10,
              },
        columnFilters: (query) =>
          Object.entries(query)
            .filter(([key]) => key.startsWith("columnFilters."))
            .map(([key, value]) => ({
              id: key.replace("columnFilters.", ""),
              value: JSON.parse(value as string),
            })),
        columnOrder: (query) =>
          query["columnOrder"]
            ? JSON.parse(query["columnOrder"] as string)
            : [],
        rowSelection: (query) =>
          query["rowSelection"]
            ? JSON.parse(query["rowSelection"] as string)
            : {},
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
      <h1 className="text-lg font-semibold">Custom encoder/decoder</h1>
      <UserTable table={table} />
    </div>
  );
}
