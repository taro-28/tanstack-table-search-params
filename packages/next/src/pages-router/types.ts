import type { useRouter } from "next/router";

export type Query = ReturnType<typeof useRouter>["query"];
