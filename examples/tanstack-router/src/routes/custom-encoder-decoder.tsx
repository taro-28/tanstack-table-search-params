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

export const Route = createFileRoute("/custom-encoder-decoder")({
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
      pathname: Route.path,
    },
    {
      globalFilter: {
        encoder: (globalFilter) => ({
          globalFilter: JSON.stringify(globalFilter),
        }),
        decoder: (query) =>
          query["globalFilter"]
            ? JSON.parse(query["globalFilter"] as string)
            : query["globalFilter"] ?? "",
      },
      sorting: {
        encoder: (sorting) =>
          Object.fromEntries(
            sorting.map(({ id, desc }) => [
              `sorting.${id}`,
              desc ? "desc" : "asc",
            ]),
          ),
        decoder: (query) =>
          Object.entries(query)
            .filter(([key]) => key.startsWith("sorting."))
            .map(([key, desc]) => ({
              id: key.replace("sorting.", ""),
              desc: desc === "desc",
            })),
      },
      pagination: {
        encoder: (pagination) => ({
          pagination: JSON.stringify(pagination),
        }),
        decoder: (query) =>
          query["pagination"]
            ? JSON.parse(query["pagination"] as string)
            : {
                pageIndex: 0,
                pageSize: 10,
              },
      },
      columnFilters: {
        encoder: (columnFilters) =>
          Object.fromEntries(
            columnFilters.map(({ id, value }) => [
              `columnFilters.${id}`,
              JSON.stringify(value),
            ]),
          ),
        decoder: (query) =>
          Object.entries(query)
            .filter(([key]) => key.startsWith("columnFilters."))
            .map(([key, value]) => ({
              id: key.replace("columnFilters.", ""),
              value: JSON.parse(value as string),
            })),
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
