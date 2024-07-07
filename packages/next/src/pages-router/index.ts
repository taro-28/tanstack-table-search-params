import type { RowData, TableOptions, TableState } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { onChangesGenerator } from "./onChangesGenerator";
import { decode } from "./decode";

export type State = Pick<TableState, "globalFilter" | "sorting">;

export type OnChanges<TData extends RowData = unknown> = Pick<
	TableOptions<TData>,
	"onGlobalFilterChange" | "onSortingChange"
>;

export const paramNames = {
	globalFilter: "globalFilter",
	sorting: "sorting",
} as const satisfies Record<keyof State, keyof State>;

export const onChangeNames = {
	globalFilter: "onGlobalFilterChange",
	sorting: "onSortingChange",
} as const satisfies Record<keyof State, keyof OnChanges>;

type Returns<TData extends RowData> = {
	state: State;
} & OnChanges<TData>;

export const useTableSearchParams = <T extends RowData>(): Returns<T> => {
	const router = useRouter();
	const state = useMemo(() => decode(router.query), [router.query]);
	return {
		state,
		...onChangesGenerator<T>({ router, state }),
	};
};
