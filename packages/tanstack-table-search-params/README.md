# TanStack Table Search Params

<div>

[![NPM Version](https://img.shields.io/npm/v/tanstack-table-search-params)][1]
[![NPM Downloads](https://img.shields.io/npm/dm/tanstack-table-search-params)][1]
[![GitHub Repo stars](https://img.shields.io/github/stars/taro-28/tanstack-table-search-params)][2]
[![Bundlephobia Minzipped size](https://img.shields.io/bundlephobia/minzip/tanstack-table-search-params)][3]

</div>

React Hook for syncing TanStack Table state with URL search params.

https://github.com/user-attachments/assets/1f1b4a65-fdec-4a80-a5d5-783642befaa3

# Usage

## Installation

```bash
npm i tanstack-table-search-params
```

## Basic

- [Next.js(Pages Router)](#nextjspages-router)
- [Next.js(App Router)](#nextjsapp-router)
- [TanStack Router](#tanstack-router)

### Next.js(Pages Router)

- [demo](https://tanstack-table-search-params-next-pages-router-taro28s-projects.vercel.app/)
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

### Next.js(App Router)

- [demo](https://tanstack-table-search-params-next-app-router-taro28s-projects.vercel.app/)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-app-router)

```tsx
import { useReactTable } from "tanstack-table";
import { useRouter } from "next/router";
import { useTableSearchParams } from "tanstack-table-search-params";

const push = useRouter().push;
const query = useSearchParams();
// 1. Pass push and query and get the state and onChanges from the hook
const stateAndOnChanges = useTableSearchParams({ push, query });

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

### TanStack Router

- [demo](https://tanstack-table-search-params-tanstack-router-taro28s-projects.vercel.app/)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/tanstack-router)

```tsx
import { useReactTable } from "tanstack-table";
import { useTableSearchParams } from "tanstack-table-search-params";

export const Route = createFileRoute("/")({
  component: Page,
});

// ...

const navigate = Route.useNavigate();
const query = Route.useSearch();

// 1. Pass push and query and get the state and onChanges from the hook
const stateAndOnChanges = useTableSearchParams({
  push: (url) => {
    const searchParams = new URLSearchParams(url.split("?")[1]);
    navigate({ search: Object.fromEntries(searchParams.entries()) });
  },
  query,
});

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

## Advanced

- [Custom query param name](#custom-query-param-name)
- [Custom encoder/decoder](#custom-encoderdecoder)
- [Custom default value](#custom-default-value)

### Custom query param name

Query parameter names can be customized.

- [demo](https://tanstack-table-search-paramsexample-git-56132d-taro28s-projects.vercel.app/custom-param-name)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-pages-router/src/pages/custom-param-name.tsx)

```tsx
const stateAndOnChanges = useTableSearchParams(router, {
  globalFilter: {
    // Customize query parameter name by passing a string
    paramName: "userTable-globalFilter",
  },
  sorting: {
    // Add prefix by passing a function
    paramName: (defaultParamName) => `userTable-${defaultParamName}`,
  },
});
```

### Custom encoder/decoder

Encoder and decoder can be customized.

- [demo](https://tanstack-table-search-paramsexample-git-56132d-taro28s-projects.vercel.app/custom-encoder-decoder)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-pages-router/src/pages/custom-encoder-decoder.tsx)

```tsx
const stateAndOnChanges = useTableSearchParams(router, {
  // Use JSON.stringify/JSON.parse for encoding/decoding
  globalFilter: {
    // foo -> { "globalFilter": "foo" }
    encoder: (globalFilter) => ({
      globalFilter: JSON.stringify(globalFilter),
    }),
    // { "globalFilter": "foo" } -> foo
    decoder: (query) =>
      query["globalFilter"]
        ? JSON.parse(query["globalFilter"] as string)
        : (query["globalFilter"] ?? ""),
  },
  // Encoders/decoders with different query parameter names can also be used.
  sorting: {
    // [{ id: "name", desc: true }] -> { "userTable-sorting": "[{ \"id\": \"name\", \"desc\": true }]" }
    encoder: (sorting) => ({
      "userTable-sorting": JSON.stringify(sorting),
    }),
    // { "userTable-sorting": "[{ \"id\": \"name\", \"desc\": true }]" } -> [{ id: "name", desc: true }]
    decoder: (query) =>
      query["userTable-sorting"]
        ? JSON.parse(query["userTable-sorting"] as string)
        : query["userTable-sorting"],
  },
  // Encoders/decoders with different numbers of query parameters can also be used.
  columnFilters: {
    // [{ id: "name", value: "foo" }] -> { "columnFilters.name": "\"foo\"" }
    encoder: (columnFilters) =>
      Object.fromEntries(
        columnFilters.map(({ id, value }) => [
          `columnFilters.${id}`,
          JSON.stringify(value),
        ]),
      ),
    // { "columnFilters.name": "\"foo\"" } -> [{ id: "name", value: "foo" }]
    decoder: (query) =>
      Object.entries(query)
        .filter(([key]) => key.startsWith("columnFilters."))
        .map(([key, value]) => ({
          id: key.replace("columnFilters.", ""),
          value: JSON.parse(value as string),
        })),
  },
});
```

### Custom default value

Default values can be customized.

"default value" means the value that is used as value of `state` when the query parameter is not present.

- [demo](https://tanstack-table-search-paramsexample-git-56132d-taro28s-projects.vercel.app/custom-default-value)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-pages-router/src/pages/custom-default-value.tsx)

```tsx
const stateAndOnChanges = useTableSearchParams(router, {
  sorting: {
    // Sort by name in descending order when query parameter is not present
    defaultValue: [{ id: "name", desc: true }],
  },
});
```

If you want to set initial values for query parameters, either transition with the query parameter or add the query parameter after the transition, depending on the router you are using.

```tsx
// Transition with the query parameter
<Link href={{ pathname: "/users", query: { globalFilter: "foo" } }}>
  Users
</Link>;

// Add the query parameter after the transition
useEffect(() => {
  router.replace({ query: { globalFilter: "foo" } });
}, [router.replace]);
```

## Supported

List of supported TanStack table states

- [x] globalFilter
- [x] sorting
- [x] pagination
- [x] columnFilters
- [ ] columnOrder
- [ ] columnPinning
- [ ] columnSizing
- [ ] columnSizingInfo
- [ ] columnVisibility
- [ ] expanded
- [ ] grouping
- [ ] rowPinning
- [ ] rowSelection

## TODO

- [ ] disable specific state

# License

MIT

[1]: https://www.npmjs.com/package/tanstack-table-search-params
[2]: https://github.com/taro-28/tanstack-table-search-params
[3]: https://bundlephobia.com/package/tanstack-table-search-params
