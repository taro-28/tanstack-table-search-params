import type { Updater } from "@tanstack/react-table";
import { paramNames, type State } from ".";
import { encoders } from "./encode";
import type { useRouter } from "next/router";

type Props = {
	state: State;
	router: Pick<ReturnType<typeof useRouter>, "pathname" | "push" | "query">;
};

export const onChangeGenerator =
	(key: keyof State, { router, state }: Props) =>
	(updaterOrValue: Readonly<Updater<State[typeof key]>>) => {
		const next = encoders[key](
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
