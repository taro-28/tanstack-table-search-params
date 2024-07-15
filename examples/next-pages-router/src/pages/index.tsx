import { faker } from "@faker-js/faker";
import { useTableSearchParams } from "@tanstack-table-search-params/core/src";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const createUser = () => ({
  id: faker.string.uuid(),
  name: faker.internet.userName(),
  age: faker.number.int({ min: 18, max: 100 }),
});

type User = ReturnType<typeof createUser>;
const columnHelper = createColumnHelper<User>();

export default function Home() {
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    setData(faker.helpers.multiple(createUser, { count: 100 }));
  }, []);

  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("age", { header: "Age" }),
  ];

  const router = useRouter();
  const stateAndOnChanges = useTableSearchParams({ router });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...stateAndOnChanges,
  });

  return (
    <div className="flex">
      <div>
        <label>
          Global Filter
          <input
            placeholder="Search..."
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            value={table.getState().globalFilter ?? ""}
          />
        </label>
        <table>
          <thead>
            <tr>
              {table.getFlatHeaders().map((header) => (
                <th key={header.id}>
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {(() => {
                      switch (header.column.getIsSorted()) {
                        case "asc":
                          return " ⬆️";
                        case "desc":
                          return " ⬇️";
                        default:
                          return " ↕️";
                      }
                    })()}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre>
        {JSON.stringify(
          {
            globalFilter: table.getState().globalFilter,
            sorting: table.getState().sorting,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
