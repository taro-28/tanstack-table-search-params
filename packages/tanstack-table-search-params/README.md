# TanStack Table Search Params

<div>

[![NPM Version](https://img.shields.io/npm/v/tanstack-table-search-params)][1]
[![NPM Downloads](https://img.shields.io/npm/dm/tanstack-table-search-params)][1]
[![GitHub Repo stars](https://img.shields.io/github/stars/taro-28/tanstack-table-search-params)][2]
[![Bundlephobia Minzipped size](https://img.shields.io/bundlephobia/minzip/tanstack-table-search-params)][3]

</div>

React Hook for syncing [TanStack Table](https://github.com/TanStack/table) state with URL search params.

https://github.com/user-attachments/assets/2a4108a2-254c-4c06-b346-f5d6e4c56c12

## 🚀 Quick Start

First, install the package.

```bash
npm i tanstack-table-search-params
```

For example, if you are using Next.js (Pages Router), you can use the hook like this.

```tsx
import { useReactTable } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useTableSearchParams } from "tanstack-table-search-params";

const router = useRouter();

// Get state and onChanges
const stateAndOnChanges = useTableSearchParams({
  query: router.query,
  pathname: router.pathname,
  replace: router.replace,
  // or
  push: router.push,
});

const table = useReactTable({
  // Set state and onChanges
  ...stateAndOnChanges,
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  // ... other options
});
```

Here is the [demo](https://tanstack-table-search-params-next-pages-router-taro28s-projects.vercel.app/).

Of course, you can use it with other routers.

Please refer to the following how to use:

<details>
<summary>Next.js(Pages Router)</summary>

[example code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-pages-router/src/pages/index.tsx)

** Use `next/router` **

```tsx
import { useReactTable } from "@tanstack/react-table";
import { useTableSearchParams } from "tanstack-table-search-params";
import { useRouter } from "next/router";

const router = useRouter();
const stateAndOnChanges = useTableSearchParams(router);

const table = useReactTable({
  // Set state and onChanges
  ...stateAndOnChanges,
  data,
  columns,
  // ... other options
});
```

** Use `next/navigation` **

```tsx
import { useReactTable } from "@tanstack/react-table";
import { useTableSearchParams } from "tanstack-table-search-params";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const { replace } = useRouter();
const stateAndOnChanges = useTableSearchParams({
  pathname: usePathname(),
  query: useSearchParams(),
  replace,
});

const table = useReactTable({
  // Set state and onChanges
  ...stateAndOnChanges,
  data,
  columns,
  // ... other options
});
```

</details>

<details>
<summary>Next.js(App Router)</summary>

[example code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-app-router/src/app/table.tsx)

```tsx
import { useReactTable } from "@tanstack/react-table";
import { useTableSearchParams } from "tanstack-table-search-params";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const { replace } = useRouter();
const stateAndOnChanges = useTableSearchParams({
  pathname: usePathname(),
  query: useSearchParams(),
  replace,
});

const table = useReactTable({
  // Set state and onChanges
  ...stateAndOnChanges,
  data,
  columns,
  // ... other options
});
```

</details>

<details>
<summary>TanStack Router</summary>

[example code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/tanstack-router/src/routes/index.tsx)

```tsx
import { useReactTable } from "@tanstack/react-table";
import { useTableSearchParams } from "tanstack-table-search-params";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  const navigate = Route.useNavigate();
  const query = Route.useSearch();

  const stateAndOnChanges = useTableSearchParams({
    replace: (url) => {
      const searchParams = new URLSearchParams(url.split("?")[1]);
      navigate({ search: Object.fromEntries(searchParams.entries()) });
    },
    query,
    pathname: Route.path,
  });

  const table = useReactTable({
    // Set state and onChanges
    ...stateAndOnChanges,
    data,
    columns,
  });

  // ...
}
```

</details>

<details>
<summary>React Router</summary>

[example code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/react-router-lib/src/basic.tsx)

```tsx
import { useReactTable } from "@tanstack/react-table";
import { useTableSearchParams } from "tanstack-table-search-params";
import { useSearchParams, useNavigate, useLocation } from "react-router";

const [query] = useSearchParams();
const navigate = useNavigate();
const { pathname } = useLocation();
const stateAndOnChanges = useTableSearchParams({
  query,
  pathname,
  replace: (url) => navigate(url, { replace: true }),
});

const table = useReactTable({
  // Set state and onChanges
  ...stateAndOnChanges,
  data,
  columns,
  // ... other options
});
```

</details>

## 🔍 How it works

The `useTableSearchParams` hook primarily does the following two things:

- Decode `query` (query parameter state) and return it as the `state` for Tanstack Table.
- Return a function like `onChangeGlobalFilter` that encodes `state` as a query parameter and performs `replace` (or `push`).

## ⚙️ Options

- [🏷️ Custom query param name](#custom-query-param-name)
- [🪄 Custom default value](#custom-default-value)
- [🔢 Custom encoder/decoder](#custom-encoder-decoder)
- [⏱️ Debounce](#debounce)

<h2 id="custom-query-param-name">🏷️ Custom query param name</h2>

You can customize a query parameter name.

- [demo](https://tanstack-table-search-params-next-pages-router-taro28s-projects.vercel.app/custom-param-name)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-pages-router/src/pages/custom-param-name.tsx)

```tsx
const stateAndOnChanges = useTableSearchParams(router, {
  paramNames: {
    // Customize query parameter name by passing a string
    globalFilter: "userTable-globalFilter",
    // Add prefix by passing a function
    sorting: (defaultParamName) => `userTable-${defaultParamName}`,
  },
});
```

<h2 id="custom-default-value">🔢 Custom default value</h2>

You can customize the default value of a query parameter.

The "default value" is the value that is used as the `state` when the query parameter is not present.

- [demo](https://tanstack-table-search-params-next-pages-router-taro28s-projects.vercel.app/custom-default-value)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-pages-router/src/pages/custom-default-value.tsx)

```tsx
const stateAndOnChanges = useTableSearchParams(router, {
  defaultValues: {
    // Sort by name in descending order when query parameter is not present
    sorting: [{ id: "name", desc: true }],
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

<h2 id="custom-encoder-decoder">🪄 Custom encoder/decoder</h2>

You can customize the encoder/decoder for the query parameter.

- [demo](https://tanstack-table-search-params-next-pages-router-taro28s-projects.vercel.app/custom-encoder-decoder)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-pages-router/src/pages/custom-encoder-decoder.tsx)

```tsx
const stateAndOnChanges = useTableSearchParams(router, {
  // Use JSON.stringify/JSON.parse for encoding/decoding
  encoders: {
    // foo -> { "globalFilter": "foo" }
    globalFilter: (globalFilter) => ({
      globalFilter: JSON.stringify(globalFilter),
    }),
  },
  decoders: {
    // { "globalFilter": "foo" } -> foo
    globalFilter: (query) =>
      query["globalFilter"]
        ? JSON.parse(query["globalFilter"] as string)
        : (query["globalFilter"] ?? ""),
  },
});

// ...

const stateAndOnChanges = useTableSearchParams(router, {
  // Encoders/decoders with different query parameter names can also be used.
  encoders: {
    // [{ id: "name", desc: true }] -> { "userTable-sorting": "[{ \"id\": \"name\", \"desc\": true }]" }
    sorting: (sorting) => ({
      "userTable-sorting": JSON.stringify(sorting),
    }),
  },
  decoders: {
    // { "userTable-sorting": "[{ \"id\": \"name\", \"desc\": true }]" } -> [{ id: "name", desc: true }]
    sorting: (query) =>
      query["userTable-sorting"]
        ? JSON.parse(query["userTable-sorting"] as string)
        : query["userTable-sorting"],
  },
});

// ...

const stateAndOnChanges = useTableSearchParams(router, {
  // Encoders/decoders with different numbers of query parameters can also be used.
  encoders: {
    // [{ id: "name", value: "foo" }] -> { "columnFilters.name": "\"foo\"" }
    columnFilters: (columnFilters) =>
      Object.fromEntries(
        columnFilters.map(({ id, value }) => [
          `columnFilters.${id}`,
          JSON.stringify(value),
        ]),
      ),
  },
  decoders: {
    // { "columnFilters.name": "\"foo\"" } -> [{ id: "name", value: "foo" }]
    columnFilters: (query) =>
      Object.entries(query)
        .filter(([key]) => key.startsWith("columnFilters."))
        .map(([key, value]) => ({
          id: key.replace("columnFilters.", ""),
          value: JSON.parse(value as string),
        })),
  },
});
```

<h2 id="debounce">⏱️ Debounce</h2>

You can debounce the reflection of state changes in the query parameters.

- [demo](https://tanstack-table-search-params-next-pages-router-taro28s-projects.vercel.app/debounce)
- [code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/next-pages-router/src/pages/debounce.tsx)

```tsx
const stateAndOnChanges = useTableSearchParams(router, {
  debounceMilliseconds: {
    // Debounce globalFilter by 500 milliseconds
    globalFilter: 500,
  },
});
```

Also, you can debounce all query parameters at once.

```tsx
const stateAndOnChanges = useTableSearchParams(router, {
  debounceMilliseconds: 500,
});
```

## 💬 Troubleshooting

### Q. The page transitions every time the search params change

If you are using Next.js (Pages Router), you can prevent page transitions by using the `shallow` option.

```tsx
const router = useRouter();
const stateAndOnChanges = useTableSearchParams({
  ...router,
  replace: (query) => router.replace(query, undefined, { shallow: true }),
});
```

### Q. The value during IME conversion is set to search params

Create an input that supports IME conversion with a uncontrolled component.

- [sample code](https://github.com/taro-28/tanstack-table-search-params/tree/main/examples/lib/src/components/SearchInput.tsx)

### Q: How can I preset query parameters when navigating to a page that contains a table?

To pass initial table state via the URL, call one of the `encode*` helpers from  
`tanstack-table-search-params/encoder-decoder` and assign its return value to your link.

```tsx
import { encodeSorting } from "tanstack-table-search-params/encoder-decoder";

<Link
  href={{
    pathname: "/some-page-with-table",
    query: {
      sorting: encodeSorting([{ id: "name", desc: true }]),
    },
  }}
>
  foo
</Link>;
```

## Supported

List of supported TanStack table states
([x] means supported, [ ] means not supported)

- [x] globalFilter
- [x] sorting
- [x] pagination
- [x] columnFilters
- [x] columnOrder
- [ ] columnPinning
- [ ] columnSizing
- [ ] columnSizingInfo
- [x] columnVisibility
- [ ] expanded
- [ ] grouping
- [ ] rowPinning
- [x] rowSelection

## Roadmap

- [ ] Support other table states
- [ ] Disable specific state
- [ ] Add `onChangeXxxQuery` option

## License

MIT

[1]: https://www.npmjs.com/package/tanstack-table-search-params
[2]: https://github.com/taro-28/tanstack-table-search-params
[3]: https://bundlephobia.com/package/tanstack-table-search-params
