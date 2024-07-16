import type { InferResponse } from "@/lib/api";
import { useCallback } from "react";
import invariant from "tiny-invariant";
import type { POST } from "./route";

type UseBuildBlueprintActionOptions = {
	onBuild?: () => void;
};
export const useBuildBlueprintAction = (
	blueprintId: number | undefined,
	options?: UseBuildBlueprintActionOptions,
) => {
	const build = useCallback(async () => {
		invariant(blueprintId != null, "blueprintId is required");
		const json = await execApi(blueprintId);
		options?.onBuild?.();
		return json;
	}, [blueprintId, options]);
	return { build };
};

type AssertResponse = (
	json: unknown,
) => asserts json is InferResponse<typeof POST>;
/** @todo */
const assertResponse: AssertResponse = (json) => {};
const execApi = async (blueprintId: number) => {
	const json = await fetch(`/agents/blueprints/${blueprintId}/build`, {
		method: "POST",
	}).then((res) => res.json());
	assertResponse(json);
	return json;
};
