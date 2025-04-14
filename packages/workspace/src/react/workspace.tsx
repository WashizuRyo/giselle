"use client";

import type { Workspace, WorkspaceId } from "@giselle-sdk/data-type";
import {
	GenerationRunnerSystemProvider,
	useGiselleEngine,
} from "@giselle-sdk/giselle-engine/react";
import { RunSystemContextProvider } from "@giselle-sdk/giselle-engine/react";
import {
	IntegrationProvider,
	type IntegrationProviderProps,
} from "@giselle-sdk/integration/react";
import type { TelemetrySettings } from "@giselle-sdk/telemetry";
import { TelemetryProvider } from "@giselle-sdk/telemetry/react";
import type { UsageLimits } from "@giselle-sdk/usage-limits";
import { UsageLimitsProvider } from "@giselle-sdk/usage-limits/react";
import { WorkflowDesignerProvider } from "@giselle-sdk/workflow-designer/react";
import { type ReactNode, useEffect, useState } from "react";

export function WorkspaceProvider({
	children,
	workspaceId,
	integration,
	usageLimits,
	telemetry,
}: {
	children: ReactNode;
	workspaceId: WorkspaceId;
	integration?: IntegrationProviderProps;
	usageLimits?: UsageLimits;
	telemetry?: TelemetrySettings;
}) {
	const client = useGiselleEngine();

	const [workspace, setWorkspace] = useState<Workspace | undefined>();
	useEffect(() => {
		client
			.getWorkspace({
				workspaceId,
			})
			.then((workspace) => {
				setWorkspace(workspace);
			});
	}, [workspaceId, client]);
	if (workspace === undefined) {
		return null;
	}
	return (
		<TelemetryProvider settings={telemetry}>
			<UsageLimitsProvider limits={usageLimits}>
				<IntegrationProvider {...integration}>
					<WorkflowDesignerProvider data={workspace}>
						<GenerationRunnerSystemProvider>
							<RunSystemContextProvider workspaceId={workspaceId}>
								{children}
							</RunSystemContextProvider>
						</GenerationRunnerSystemProvider>
					</WorkflowDesignerProvider>
				</IntegrationProvider>
			</UsageLimitsProvider>
		</TelemetryProvider>
	);
}
