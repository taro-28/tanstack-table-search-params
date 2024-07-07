import type { RowData, Updater } from "@tanstack/react-table";
import { paramNames, type State, type OnChanges, onChangeNames } from ".";
import { encoders } from "./encode";
import { typedObjectEntries } from "../../../utils/object";
import type { useRouter } from "next/router";

type OnChangeGeneratorProps = {
	state: State;
	router: Pick<ReturnType<typeof useRouter>, "pathname" | "push" | "query">;
};

const onChangeGenerator =
	(key: keyof State, { router, state }: OnChangeGeneratorProps) =>
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

type Props = Pick<Parameters<typeof onChangeGenerator>[1], "router" | "state">;

export const onChangesGenerator = <T extends RowData>({
	state,
	router,
}: Props): OnChanges<T> =>
	Object.fromEntries(
		typedObjectEntries(onChangeNames).map(([key, value]) => [
			value,
			onChangeGenerator(key, { router, state }),
		]),
	);
