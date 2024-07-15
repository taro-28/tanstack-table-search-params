# TanStack Table Search Params

React hook to sync TanStack Table state with URL search params.

## Usage

```tsx
// 1. Get the state and onChanges from the hook
const stateAndOnChanges = useTableSearchParams();
const table = useReactTable({
  // 2. Pass the state and onChanges to the table
  ...stateAndOnChanges,
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // ... other options
});
```

## Supported

List of supported TanStack table states

- [x] globalFilter
- [x] sorting
- [ ] columnFilters
- [ ] columnOrder
- [ ] columnPinning
- [ ] columnSizing
- [ ] columnSizingInfo
- [ ] columnVisibility
- [ ] expanded
- [ ] grouping
- [ ] pagination
- [ ] rowPinning
- [ ] rowSelection
