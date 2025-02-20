import {
	type Input,
	InputId,
	OutputId,
	type TextGenerationNode,
	type VariableNode,
	isFileNode,
	isTextGenerationNode,
	isTextNode,
} from "@giselle-sdk/data-type";
import { isJsonContent, jsonContentToText } from "@giselle-sdk/text-editor";
import clsx from "clsx/lite";
import { useWorkflowDesigner } from "giselle-sdk/react";
import { CheckIcon, TrashIcon } from "lucide-react";
import pluralize from "pluralize";
import { Popover, ToggleGroup } from "radix-ui";
import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useMemo,
	useState,
} from "react";
import { GeneratedContentIcon, PdfFileIcon, PromptIcon } from "../../../icons";
import { EmptyState } from "../../../ui/empty-state";
import { type ConnectedSource, type Source, filterSources } from "./sources";

function SourceSelect({
	sources,
	onValueChange,
	contentProps,
}: {
	sources: Source[];
	onValueChange?: (value: OutputId[]) => void;
	contentProps?: Omit<
		ComponentProps<typeof Popover.PopoverContent>,
		"className"
	>;
}) {
	const [selectedOutputIds, setSelectedOutputIds] = useState<OutputId[]>(
		sources
			.filter((source) => source.connection !== undefined)
			.map((source) => source.output.id),
	);
	const generatedSources = useMemo(
		() => filterSources(sources, isTextGenerationNode),
		[sources],
	);
	const textSources = useMemo(
		() => filterSources(sources, isTextNode),
		[sources],
	);
	const fileSources = useMemo(
		() => filterSources(sources, isFileNode),
		[sources],
	);
	return (
		<Popover.Root>
			<Popover.Trigger
				className={clsx(
					"flex items-center cursor-pointer p-[10px] rounded-[8px]",
					"border border-transparent hover:border-white-20",
					"text-[12px] font-[700] text-white-20",
					"transition-colors",
				)}
			>
				Select Sources
			</Popover.Trigger>
			<Popover.Anchor />
			<Popover.Portal>
				<Popover.Content
					className={clsx(
						"relative w-[300px] rounded py-[8px]",
						"rounded-[8px] border-[1px] bg-black backdrop-blur-[8px]",
						"shadow-[-2px_-1px_0px_0px_rgba(0,0,0,0.1),1px_1px_8px_0px_rgba(0,0,0,0.25)]",
					)}
					{...contentProps}
				>
					<div
						className={clsx(
							"absolute z-0 rounded-[8px] inset-0 border-[1px] mask-fill bg-gradient-to-br bg-origin-border bg-clip-boarder border-transparent",
							"from-[hsl(232,_36%,_72%)]/40 to-[hsl(218,_58%,_21%)]/90",
						)}
					/>
					<ToggleGroup.Root
						type="multiple"
						className="relative  flex flex-col gap-[8px]"
						value={selectedOutputIds}
						onValueChange={(unsafeValue) => {
							const safeValue = unsafeValue
								.map((value) => {
									const parse = OutputId.safeParse(value);
									if (parse.success) {
										return parse.data;
									}
									return null;
								})
								.filter((id) => id !== null);
							setSelectedOutputIds(safeValue);
						}}
					>
						<div className="flex px-[16px] text-white">Select Sources From</div>
						<div className="flex flex-col py-[4px]">
							<div className="border-t border-black-30/20" />
						</div>
						<div className="flex flex-col pb-[8px] gap-[8px]">
							<div className="flex flex-col px-[8px]">
								<p className="py-[4px] px-[8px] text-black-40 text-[10px] font-[700]">
									Generated Content
								</p>
								{generatedSources.map((generatedSource) => (
									<ToggleGroup.Item
										key={generatedSource.output.id}
										className="group flex p-[8px] justify-between rounded-[8px] text-white hover:bg-blue/50 transition-colors cursor-pointer"
										value={generatedSource.output.id}
									>
										<p className="text-[12px] truncate">
											{generatedSource.node.name ??
												generatedSource.node.content.llm.model}{" "}
											/ {generatedSource.output.label}
										</p>
										<CheckIcon className="w-[16px] h-[16px] hidden group-data-[state=on]:block" />
									</ToggleGroup.Item>
								))}
							</div>
							<div className="flex flex-col px-[8px]">
								<p className="py-[4px] px-[8px] text-black-40 text-[10px] font-[700]">
									Text
								</p>
								{textSources.map((textSource) => (
									<ToggleGroup.Item
										key={textSource.output.id}
										value={textSource.output.id}
										className="group flex p-[8px] justify-between rounded-[8px] text-white hover:bg-blue/50 transition-colors cursor-pointer"
									>
										<p className="text-[12px] truncate">
											{textSource.node.name ?? "Text"} /{" "}
											{textSource.output.label}
										</p>
										<CheckIcon className="w-[16px] h-[16px] hidden group-data-[state=on]:block" />
									</ToggleGroup.Item>
								))}
							</div>

							<div className="flex flex-col px-[8px]">
								<p className="py-[4px] px-[8px] text-black-40 text-[10px] font-[700]">
									File
								</p>
								{fileSources.map((fileSource) => (
									<ToggleGroup.Item
										key={fileSource.output.id}
										value={fileSource.output.id}
										className="group flex p-[8px] justify-between rounded-[8px] text-white hover:bg-blue/50 transition-colors cursor-pointer"
									>
										<p className="text-[12px] truncate">
											{fileSource.node.name ?? "File"} /{" "}
											{fileSource.output.label}
										</p>
										<CheckIcon className="w-[16px] h-[16px] hidden group-data-[state=on]:block" />
									</ToggleGroup.Item>
								))}
							</div>
							<div className="flex flex-col py-[4px]">
								<div className="border-t border-black-30/20" />
							</div>
							<div className="flex px-[16px] pt-[4px] gap-[8px]">
								<Popover.Close
									onClick={() => {
										onValueChange?.(selectedOutputIds);
									}}
									className="h-[32px] w-full flex justify-center items-center bg-white text-black rounded-[8px] cursor-pointer text-[12px]"
								>
									Update
								</Popover.Close>
							</div>
						</div>
					</ToggleGroup.Root>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}

function SourceListRoot({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-[8px]">
			<p className="text-[14px]">{title}</p>
			{children}
		</div>
	);
}
function SourceListItem({
	icon,
	title,
	subtitle,
	onRemove,
}: {
	icon: ReactNode;
	title: string;
	subtitle: string;
	onRemove: () => void;
}) {
	return (
		<div
			className={clsx(
				"group flex items-center",
				"border border-white/20 rounded-[8px] h-[60px]",
			)}
		>
			<div className="w-[60px] flex items-center justify-center">{icon}</div>
			<div className="w-[1px] h-full border-l border-white/20" />
			<div className="px-[16px] flex-1 flex items-center justify-between">
				<div className="flex flex-col gap-[4px]">
					<p className="text=[16px]">{title}</p>
					<div className="text-[10px] text-black-40">
						<p className="line-clamp-1">{subtitle}</p>
					</div>
				</div>
				<button
					type="button"
					className={clsx(
						"hidden group-hover:block",
						"p-[4px] rounded-[4px]",
						"bg-transparent hover:bg-black-30/50 transition-colors",
					)}
					onClick={onRemove}
				>
					<TrashIcon className="w-[18px] h-[18px] text-white" />
				</button>
			</div>
		</div>
	);
}

export function SourcesPanel({
	node,
}: {
	node: TextGenerationNode;
}) {
	const { data, addConnection, deleteConnection, updateNodeData } =
		useWorkflowDesigner();
	const sources = useMemo<Source[]>(() => {
		const tmpSources: Source[] = [];
		const connections = data.connections.filter(
			(connection) => connection.inputNodeId === node.id,
		);
		for (const node of data.nodes) {
			for (const output of node.outputs) {
				const connection = connections.find(
					(connection) => connection.outputId === output.id,
				);
				tmpSources.push({
					output,
					node,
					connection,
				});
			}
		}
		return tmpSources;
	}, [data.nodes, data.connections, node.id]);
	const connectedSources = useMemo(() => {
		const connectionsToThisNode = data.connections.filter(
			(connection) => connection.inputNodeId === node.id,
		);
		const connectedGeneratedSources: ConnectedSource<TextGenerationNode>[] = [];
		const connectedVariableSources: ConnectedSource<VariableNode>[] = [];
		for (const connection of connectionsToThisNode) {
			const node = data.nodes.find(
				(node) => node.id === connection.outputNodeId,
			);
			if (node === undefined) {
				continue;
			}
			const output = node.outputs.find(
				(output) => output.id === connection.outputId,
			);
			if (output === undefined) {
				continue;
			}

			switch (node.type) {
				case "action":
					switch (node.content.type) {
						case "textGeneration":
							node;
							connectedGeneratedSources.push({
								output,
								node,
								connection,
							});
							break;
					}
					break;
				case "variable":
					connectedVariableSources.push({
						output,
						node,
						connection,
					});
					break;
				default: {
					const _exhaustiveCheck: never = node;
					throw new Error(`Unhandled node type: ${_exhaustiveCheck}`);
				}
			}
		}
		return {
			generation: connectedGeneratedSources,
			variable: connectedVariableSources,
		};
	}, [node.id, data.connections, data.nodes]);

	const handleConnectionChange = useCallback(
		(connectOutputIds: OutputId[]) => {
			const currentConnectedOutputIds = data.connections
				.filter((connection) => connection.inputNodeId === node.id)
				.map((connection) => connection.outputId);
			const newConnectOutputIdSet = new Set(connectOutputIds);
			const currentConnectedOutputIdSet = new Set(currentConnectedOutputIds);
			const addedOutputIdSet = newConnectOutputIdSet.difference(
				currentConnectedOutputIdSet,
			);

			for (const outputId of addedOutputIdSet) {
				const outputNode = data.nodes.find((node) =>
					node.outputs.some((output) => output.id === outputId),
				);
				if (outputNode === undefined) {
					continue;
				}
				const newInput: Input = {
					id: InputId.generate(),
					label: "Source",
				};

				updateNodeData(node, {
					inputs: [...node.inputs, newInput],
				});
				addConnection({
					inputNodeId: node.id,
					inputId: newInput.id,
					inputNodeType: node.type,
					outputId,
					outputNodeId: outputNode.id,
					outputNodeType: outputNode.type,
				});
			}

			const removedOutputIdSet = currentConnectedOutputIdSet.difference(
				newConnectOutputIdSet,
			);

			for (const outputId of removedOutputIdSet) {
				const connection = data.connections.find(
					(connection) =>
						connection.inputNodeId === node.id &&
						connection.outputId === outputId,
				);
				if (connection === undefined) {
					continue;
				}
				deleteConnection(connection.id);
				updateNodeData(node, {
					inputs: node.inputs.filter(
						(input) => input.id !== connection.inputId,
					),
				});
			}
		},
		[
			node,
			data.nodes,
			data.connections,
			addConnection,
			deleteConnection,
			updateNodeData,
		],
	);

	if (node.inputs.length === 0) {
		return (
			<div className="mt-[60px]">
				<EmptyState
					title="No data referenced yet."
					description="Select the data you want to refer to from the output and the information and knowledge you have."
				>
					<SourceSelect
						sources={sources}
						onValueChange={handleConnectionChange}
					/>
				</EmptyState>
			</div>
		);
	}
	return (
		<div>
			<div className="flex justify-end">
				<SourceSelect
					sources={sources}
					onValueChange={handleConnectionChange}
					contentProps={{
						align: "end",
					}}
				/>
			</div>
			<div className="flex flex-col gap-[32px]">
				{connectedSources.generation.length > 0 && (
					<SourceListRoot title="Generated Sources">
						{connectedSources.generation.map((source) => (
							<SourceListItem
								icon={
									<GeneratedContentIcon className="size-[24px] text-white" />
								}
								key={source.connection.id}
								title={source.output.label}
								subtitle={`${source.node.name ?? source.node.content.llm.model} - ${source.node.content.llm.provider}`}
								onRemove={() => {}}
							/>
						))}
					</SourceListRoot>
				)}
				{connectedSources.variable.length > 0 && (
					<SourceListRoot title="Static Contents">
						{connectedSources.variable.map((source) => {
							switch (source.node.content.type) {
								case "text": {
									const jsonContentLikeString = JSON.parse(
										source.node.content.text,
									);
									const text = isJsonContent(jsonContentLikeString)
										? jsonContentToText(jsonContentLikeString)
										: source.node.content.text;

									return (
										<SourceListItem
											icon={<PromptIcon className="size-[24px] text-white" />}
											key={source.connection.id}
											title={source.node.name ?? "Text"}
											subtitle={text}
											onRemove={() => {}}
										/>
									);
								}
								case "file":
									return (
										<SourceListItem
											icon={<PdfFileIcon className="size-[24px] text-white" />}
											key={source.connection.id}
											title={source.node.name ?? "PDF Files"}
											subtitle={`${source.node.content.files.length} ${pluralize("file", source.node.content.files.length)}`}
											onRemove={() => {}}
										/>
									);
								default: {
									const _exhaustiveCheck: never = source.node.content;
									throw new Error(`Unhandled source type: ${_exhaustiveCheck}`);
								}
							}
						})}
					</SourceListRoot>
				)}
			</div>
		</div>
	);
}
