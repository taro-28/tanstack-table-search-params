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
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useTableSearchParams } from "tanstack-table-search-params";

export default function CustomParamNamePage() {
  const data = useUserData();

  const [query] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const stateAndOnChanges = useTableSearchParams(
    { query, pathname, replace: (url) => navigate(url, { replace: true }) },
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

  return (
    <div className="space-y-2 mx-6">
      <h1 className="text-lg font-semibold">Custom query param name</h1>
      <UserTable table={table} />
    </div>
  );
}
