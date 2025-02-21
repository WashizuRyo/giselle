"use client";

import { WorkflowId } from "@giselle-sdk/data-type";
import {
	useRun,
	useRunController,
	useWorkflowDesigner,
} from "giselle-sdk/react";
import { Tabs } from "radix-ui";
import { useMemo, useState } from "react";
import { WilliIcon } from "../icons";
import bg from "../images/bg.png";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty-state";
import { GenerationView } from "../ui/generation-view";
import { NodeGlance } from "../ui/node-glance";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export function Viewer() {
	const { generations, run } = useRun();
	const [flowId, setFlowId] = useState<WorkflowId | undefined>();
	const { perform } = useRunController();
	const { data } = useWorkflowDesigner();
	const flow = useMemo(() => {
		if (!flowId) return undefined;
		return data.editingWorkflows.find((flow) => flow.id === flowId);
	}, [flowId, data.editingWorkflows]);
	return (
		<div className="w-full flex-1 px-[16px]">
			<div className="rounded-[8px] overflow-hidden h-full">
				<div
					className="bg-black-800 flex flex-col h-full text-white px-[16px] py-[16px] gap-[16px]"
					style={{
						backgroundImage: `url(${bg.src})`,
						backgroundPositionX: "center",
						backgroundPositionY: "center",
						backgroundSize: "cover",
					}}
				>
					<Tabs.Root orientation="horizontal" className="flex h-full">
						<Tabs.List className="w-[180px] flex flex-col gap-[16px]">
							<div className="flex flex-col gap-[8px]">
								<Select
									onValueChange={(value) => {
										setFlowId(WorkflowId.parse(value));
									}}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select flow" />
									</SelectTrigger>
									<SelectContent>
										{data.editingWorkflows.map((workflow, index) => (
											<SelectItem key={workflow.id} value={workflow.id}>
												flow {index + 1}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								{flowId && (
									<Button
										type="button"
										onClick={() => {
											perform(flowId);
										}}
									>
										Run
									</Button>
								)}
							</div>
							<div className="flex flex-col gap-[24px]">
								{flow?.jobs.map((job, index) => (
									<div key={job.id} className="flex flex-col gap-[8px]">
										<p className="text-black-400 text-[12px] font-[700]">
											Step {index + 1}
										</p>
										{job.actions.map((action) => (
											<Tabs.Trigger
												value={action.node.id}
												className="[w-180px] flex p-[16px] justify-between items-center border border-black-200/20 rounded-[8px]"
												key={action.node.id}
											>
												<NodeGlance
													node={action.node}
													iconClassName="rounded-[8px] bg-white-950 text-black-950 flex items-center justify-center p-[8px] **:data-content-type-icon:size-[16px]"
													nameClassName="text-white text-[12px] font-[700]"
													descriptionClassName="text-black-400 text-[10px]"
												/>
											</Tabs.Trigger>
										))}
									</div>
								))}
							</div>
						</Tabs.List>
						<div className="overflow-y-auto flex-1 pb-[20px]">
							{(!run || run.status === "created") && (
								<div className="h-full flex items-center justify-center">
									<EmptyState
										icon={
											<WilliIcon className="fill-current w-[32px] h-[32px] text-black-300" />
										}
										title="This has not yet been executed"
										description="You have not yet
													executed the node. Let's execute entire thing and create the final
													output."
									/>
								</div>
							)}
							{run &&
								run.status !== "created" &&
								run?.workflow?.jobs.flatMap((job) =>
									job.actions.map(({ node }) => (
										<Tabs.Content
											key={node.id}
											value={node.id}
											className="px-[32px] py-[16px] flex flex-col gap-[24px]"
										>
											<NodeGlance
												node={node}
												iconClassName="rounded-[8px] bg-true-white text-black-950 flex items-center justify-center p-[8px] **:data-content-type-icon:size-[26px]"
												nameClassName="text-white text-[20px] font-[700]"
												descriptionClassName="text-black-400 text-[12px]"
											/>
											{generations
												.filter(
													(g) =>
														g.status !== "created" &&
														g.context.actionNode.id === node.id,
												)
												.sort((a, b) => a.createdAt - b.createdAt)
												.map((generation) => (
													<div key={generation.id}>
														<GenerationView generation={generation} />
													</div>
												))}
										</Tabs.Content>
									)),
								)}
						</div>
					</Tabs.Root>
				</div>
			</div>
		</div>
	);
}
