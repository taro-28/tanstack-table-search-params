# TanStack Table Search Params

React Hook for syncing TanStack Table state with URL search params.

# Usage

## Installation

```bash
npm i tanstack-table-search-params
```

## Example

### Next.js(Pages Router)

- [demo](https://tanstack-table-search-paramsexample-git-56132d-taro28s-projects.vercel.app)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-pages-router)

```tsx
import { useReactTable } from "tanstack-table";
import { useRouter } from "next/router";
import { useTableSearchParams } from "tanstack-table-search-params";

// 1. Pass router and get the state and onChanges from the hook
const router = useRouter();
const stateAndOnChanges = useTableSearchParams(router);

const table = useReactTable({
  // 2. Pass the state and onChanges to the table
  ...stateAndOnChanges,
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  // ... other options
});
```

## Supported

List of supported TanStack table states

- [x] globalFilter
- [x] sorting
- [x] pagination
- [ ] columnFilters
- [ ] columnOrder
- [ ] columnPinning
- [ ] columnSizing
- [ ] columnSizingInfo
- [ ] columnVisibility
- [ ] expanded
- [ ] grouping
- [ ] rowPinning
- [ ] rowSelection

# License

MIT
