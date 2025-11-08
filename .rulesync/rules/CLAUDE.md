---
root: true
targets:
  - '*'
description: ''
globs:
  - '**/*'
---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for `tanstack-table-search-params`, a React hook library that syncs TanStack Table state with URL search parameters. The library enables table state (sorting, filtering, pagination, etc.) to persist in the URL, making it shareable and bookmarkable.

## Monorepo Structure

- **`packages/tanstack-table-search-params/`**: Main library package (published to npm)
- **`packages/tsconfig/`**: Shared TypeScript configuration
- **`examples/`**: Example implementations for different routers:
  - `next-pages-router/`: Next.js Pages Router example
  - `next-app-router/`: Next.js App Router example
  - `tanstack-router/`: TanStack Router example
  - `react-router-lib/`: React Router example
  - `lib/`: Shared components used across examples

## Development Commands

### Build, Test, and Lint

```bash
# Build all packages and examples (uses Turbo)
pnpm build

# Type-check all packages
pnpm type-check

# Run tests (runs tests in main package)
pnpm test

# Lint and format with Biome
pnpm check-write

# Prettier formatting
pnpm prettier

# Check for unused dependencies
pnpm knip
```

### Working with Specific Packages

```bash
# Main package commands
pnpm tanstack-table-search-params <command>
pnpm tanstack-table-search-params build
pnpm tanstack-table-search-params test
pnpm tanstack-table-search-params type-check

# Example project commands
pnpm examples/next-pages-router <command>
pnpm examples/next-app-router <command>
pnpm examples/tanstack-router <command>
pnpm examples/react-router-lib <command>
```

### Testing

```bash
# Run tests in watch mode
cd packages/tanstack-table-search-params
pnpm test

# Run specific test file
pnpm test src/tests/globalFilter.test.ts
```

## Architecture

### Main Hook: `useTableSearchParams`

The core export is `useTableSearchParams`, which orchestrates multiple state-specific hooks:

1. **State-specific hooks** (e.g., `useGlobalFilter`, `useSorting`, `usePagination`):
   - Each manages one TanStack Table state
   - Decodes query params → state
   - Encodes state → query params
   - Handles debouncing via `useDebounce`
   - Returns state, onChange handler, and encoder function

2. **Main hook** (`useTableSearchParams`):
   - Composes all state-specific hooks
   - Manages enabled/disabled states
   - Provides `onStateChange` for batch updates
   - Returns partial TableState + onChange handlers

### Encoder/Decoder Pattern

Each table state has paired encoder/decoder functions in `src/encoder-decoder/`:

- **Decoders**: `Query → State` (e.g., `"desc"` → `[{id: "name", desc: true}]`)
- **Encoders**: `State → Query` (e.g., `[{id: "name", desc: true}]` → `"sorting.name"`)
- Default implementations can be customized via options
- Exported separately for preset query params on navigation

### Router Abstraction

The library is router-agnostic via the `Router` type (`src/types.ts`):

```typescript
type Router = {
  query: Query; // Current query params
  navigate(url): void; // Navigation function (push or replace)
  pathname: string; // Current pathname
};
```

### Query Update Flow

1. User interacts with table → TanStack Table calls onChange handler
2. onChange handler in state-specific hook:
   - Encodes new state to query params
   - Calls `updateQuery()` to merge with existing query
3. `updateQuery()` builds new URL and calls router's navigate function
4. Router updates URL → query params change → hook re-renders with new decoded state

## Testing Strategy

Tests are organized in `packages/tanstack-table-search-params/src/tests/`:

- **General tests**: Test with generic router mock (`testRouter.ts`)
- **`next-pages-router/` tests**: Test Next.js-specific behavior with `next-router-mock`
- Each state has its own test file (e.g., `globalFilter.test.ts`, `sorting.test.ts`)
- Tests verify encoding/decoding, debouncing, and custom options

## Key Implementation Details

- **Supported states**: globalFilter, sorting, pagination, columnFilters, columnOrder, rowSelection, columnVisibility
- **Default encoding**: Most states use array notation (e.g., `sorting.0.id=name&sorting.0.desc=true`)
- **Debouncing**: Optional per-state debouncing via `useDebounce` hook
- **Custom encoders/decoders**: Users can provide custom encoding logic (e.g., JSON, flat params)
- **Dual exports**: Main hook from `"tanstack-table-search-params"`, encoders from `"tanstack-table-search-params/encoder-decoder"`

## Build Configuration

- **Builder**: tsup (`tsup.config.ts`)
- **Entry points**: `src/index.ts` (main hook), `src/encoder-decoder/index.ts` (encoder/decoder exports)
- **Output formats**: CJS and ESM
- **Target**: `esnext`
- TypeScript declarations generated automatically
