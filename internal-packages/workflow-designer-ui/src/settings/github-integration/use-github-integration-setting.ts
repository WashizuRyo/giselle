import {
	GitHubIntegrationId,
	GitHubIntegrationSetting,
} from "@giselle-sdk/data-type";
import { useGiselleEngine, useWorkflowDesigner } from "giselle-sdk/react";
import { type FormEvent, useCallback, useEffect, useState } from "react";

export function useGitHubIntegrationSetting() {
	const { data: workspace } = useWorkflowDesigner();
	const client = useGiselleEngine();
	const [setting, setSetting] = useState<
		GitHubIntegrationSetting | undefined
	>();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		client
			.getWorkspaceGitHubIntegrationSetting({ workspaceId: workspace.id })
			.then(({ integrationSetting }) => {
				setSetting(integrationSetting);
				setIsLoading(false);
			});
	}, [client, workspace.id]);

	const handleSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			const id = setting?.id ?? GitHubIntegrationId.generate();
			const formData = new FormData(event.currentTarget);
			const githubIntegrationSetting = GitHubIntegrationSetting.parse({
				id,
				workspaceId: workspace.id,
				repositoryNodeId: formData.get("repositoryNodeId") as string,
				callsign: formData.get("callsign") as string,
				event: formData.get("event") as string,
				payloadMaps: JSON.parse(formData.get("payloadMaps") as string),
				nextAction: formData.get("nextAction") as string,
				nextActionPayloadMapId: formData.get("nextAction") as string,
			});
			await client.upsertGitHubIntegrationSetting({
				integrationSetting: githubIntegrationSetting,
			});
		},
		[client, workspace.id, setting],
	);

	return {
		isLoading,
		data: setting,
		handleSubmit,
	};
}
