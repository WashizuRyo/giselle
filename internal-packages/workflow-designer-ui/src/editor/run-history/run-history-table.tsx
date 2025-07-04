import { Button } from "@giselle-internal/ui/button";
import { EmptyState } from "@giselle-internal/ui/empty-state";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@giselle-internal/ui/table";
import {
	useGiselleEngine,
	useWorkflowDesigner,
} from "@giselle-sdk/giselle-engine/react";
import { RefreshCcwIcon } from "lucide-react";
import useSWR from "swr";

function formatDateTime(timestamp: number): string {
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function formatDuration(ms: number): string {
	return `${(ms / 1000).toFixed(1)}s`;
}

export function RunHistoryTable() {
	const client = useGiselleEngine();
	const { data: workspace } = useWorkflowDesigner();
	const { data, isLoading, mutate } = useSWR(
		{
			namespace: "getWorkspaceFlowRuns",
			workspaceId: workspace.id,
		},
		({ workspaceId }) =>
			client.getWorkspaceFlowRuns({ workspaceId }).then((res) => res.runs),
	);

	if (isLoading) {
		return null;
	}

	return (
		<div className="pl-4 pb-4 pt-2 h-full">
			<div className="flex justify-end pb-2">
				<Button
					type="button"
					variant="outline"
					size="compact"
					onClick={() => mutate()}
					leftIcon={<RefreshCcwIcon className="size-[12px]" />}
				>
					Refresh
				</Button>
			</div>
			{data === undefined || data.length < 1 ? (
				<EmptyState title="No run" description="No runs have been executed." />
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Time</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Steps</TableHead>
							<TableHead>Trigger</TableHead>
							<TableHead>
								Duration
								<br />
								<span className="whitespace-nowrap">(Wall-Clock)</span>
							</TableHead>
							<TableHead>
								Duration
								<br />
								<span className="whitespace-nowrap">(Total tasks)</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((run) => (
							<TableRow key={run.id}>
								<TableCell className="whitespace-nowrap">
									{formatDateTime(run.createdAt)}
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{run.status === "completed" ? (
										<span className="text-[#39FF7F]">completed</span>
									) : run.status === "failed" ? (
										<span className="text-[#FF3D71]">failed</span>
									) : (
										run.status
									)}
								</TableCell>
								<TableCell className="whitespace-nowrap">
									<span className="inline-flex items-center gap-1">
										{run.steps.completed > 0 && (
											<>
												<span className="w-4 h-4 rounded-full bg-[#39FF7F] text-black text-xs flex items-center justify-center font-bold">
													✓
												</span>
												<span className="text-xs">{run.steps.completed}</span>
											</>
										)}
										{run.steps.failed > 0 && (
											<>
												<span className="w-4 h-4 rounded-full bg-[#FF3D71] text-black text-xs flex items-center justify-center font-bold">
													✕
												</span>
												<span className="text-xs">{run.steps.failed}</span>
											</>
										)}
									</span>
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{run.trigger}
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{formatDuration(run.duration.wallClock)}
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{formatDuration(run.duration.totalTask)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
