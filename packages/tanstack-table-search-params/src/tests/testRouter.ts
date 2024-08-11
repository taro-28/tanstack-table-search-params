import type { useTableSearchParams } from "..";

export const testRouter = {
  push: async (url: string) => window.history.pushState({}, "", url),
} satisfies Parameters<typeof useTableSearchParams>[0];
