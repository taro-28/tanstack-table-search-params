import type { Updater } from "@tanstack/react-table";
import { paramNames, type State } from ".";
import type { useRouter } from "next/router";

type Props<K extends keyof State> = {
	state: State;
	router: Pick<ReturnType<typeof useRouter>, "pathname" | "push" | "query">;
	encoder: (value: State[K]) => string | undefined;
};

export const onChangeGenerator =
	(key: keyof State, { router, state, encoder }: Props<typeof key>) =>
	(updaterOrValue: Readonly<Updater<State[typeof key]>>) => {
		const next = encoder(
			typeof updaterOrValue === "function"
				? updaterOrValue(state[key])
				: updaterOrValue,
		);

		const { [paramNames[key]]: _, ...excludedQuery } = router.query;
		router.push({
			pathname: router.pathname,
			query: next ? { ...router.query, [key]: next } : excludedQuery,
		});
	};
