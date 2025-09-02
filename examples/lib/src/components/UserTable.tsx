import { flexRender, type Table } from "@tanstack/react-table";
import { type JSX, useState } from "react";
import { SearchInput } from "./SearchInput";
import type { User } from "./userData";

const Cell = ({ className, ...props }: JSX.IntrinsicElements["div"]) => (
  <div {...props} className={`table-cell py-1 px-2 text-center ${className}`} />
);

const Button = (
  props: Omit<JSX.IntrinsicElements["button"], "type" | "className">,
) => (
  <button
    {...props}
    type="button"
    className="border rounded px-2 hover:bg-gray-100"
  />
);

type Props = {
  table: Table<User>;
};

export const UserTable = ({ table }: Props) => {
  const [isReversed, setIsReversed] = useState(false);
  return (
    <div className="flex space-x-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <SearchInput
            className="font-normal"
            onSearch={(value) => table.setGlobalFilter(value)}
            defaultValue={table.getState().globalFilter ?? ""}
          />
          <Button
            onClick={() => {
              setIsReversed((prev) => !prev);
              table.setColumnOrder(
                isReversed
                  ? []
                  : table
                      .getAllLeafColumns()
                      .reverse()
                      .map((c) => c.id),
              );
            }}
          >
            {isReversed ? "Reset Order" : "Reverse Order"}
          </Button>
          <Button onClick={table.reset}>Reset State</Button>
        </div>
        <div className="table border-2 border-gray-200 rounded-md ">
          <div className="table-header-group bg-slate-200">
            <div className="table-row">
              <Cell>
                <input
                  type="checkbox"
                  checked={table.getIsAllRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />
              </Cell>
              {table.getFlatHeaders().map((header) => (
                <Cell key={header.id} className="space-y-1">
                  <button
                    className="font-semibold"
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
                  <div>
                    {header.column.id === "age" ? (
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={
                            (
                              header.column.getFilterValue() as [number, number]
                            )?.[0] ?? ""
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(
                              (old: [number, number]) => [
                                e.target.value,
                                old?.[1],
                              ],
                            )
                          }
                          placeholder="Min"
                          className="border w-16 rounded-md px-2"
                        />
                        <input
                          type="number"
                          value={
                            (
                              header.column.getFilterValue() as [number, number]
                            )?.[1] ?? ""
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(
                              (old: [number, number]) => [
                                old?.[0],
                                e.target.value,
                              ],
                            )
                          }
                          placeholder="Max"
                          className="border w-16 rounded-md px-2"
                        />
                      </div>
                    ) : (
                      <SearchInput
                        onSearch={(value) =>
                          header.column.setFilterValue(value)
                        }
                        defaultValue={
                          (header.column.getFilterValue() ?? "") as string
                        }
                      />
                    )}
                  </div>
                </Cell>
              ))}
            </div>
          </div>
          <div className="table-row-group">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="table-row">
                <div className="table-cell py-1 px-2 text-center">
                  <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </div>
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="table-cell py-1 px-2 text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="border rounded w-12"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            type="button"
            className="border rounded w-12"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            type="button"
            className="border rounded w-12"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            type="button"
            className="border rounded w-12"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border px-2 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border px-2 rounded"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div>
          Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
          {table.getRowCount().toLocaleString()} Rows
        </div>
      </div>
      <div className="border-2 border-gray-200 rounded p-2 space-y-2">
        <div className="font-semibold">Table State</div>
        <pre>
          {JSON.stringify(
            {
              globalFilter: table.getState().globalFilter,
              sorting: table.getState().sorting,
              pagination: table.getState().pagination,
              columnFilters: table.getState().columnFilters,
              columnOrder: table.getState().columnOrder,
              rowSelection: table.getState().rowSelection,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
};
