import type { ActionNode, Node } from "@giselle-sdk/data-type";
import {
	useNodeGenerations,
	useWorkflowDesigner,
} from "@giselle-sdk/giselle-engine/react";
import { useCallback } from "react";
import { NodeIcon } from "../../../icons/node";
import { Button } from "../../../ui/button";
import {
	PropertiesPanelContent,
	PropertiesPanelHeader,
	PropertiesPanelRoot,
} from "../ui";
import { GitHubActionPropertiesPanel } from "./github-action-properties-panel";
import { useConnectedInputs } from "./lib";

export function ActionNodePropertiesPanel({ node }: { node: ActionNode }) {
	const { data, updateNodeData, setUiNodeState } = useWorkflowDesigner();
	const { isValid, connectedInputs } = useConnectedInputs(node.id, node.inputs);
	const { createAndStartGenerationRunner } = useNodeGenerations({
		nodeId: node.id,
		origin: { type: "studio", workspaceId: data.id },
	});
	const handleClick = useCallback(() => {
		if (!isValid) {
			setUiNodeState(node.id, {
				showError: true,
			});
			return;
		}

		setUiNodeState(node.id, {
			showError: false,
		});
		createAndStartGenerationRunner({
			origin: {
				type: "studio",
				workspaceId: data.id,
			},
			operationNode: node,
			sourceNodes: connectedInputs
				.map((input) => input.connectedOutput?.node as Node)
				.filter((node) => node !== null),
			connections: data.connections.filter(
				(connection) => connection.inputNode.id === node.id,
			),
		});
	}, [
		isValid,
		setUiNodeState,
		node,
		data.id,
		data.connections,
		createAndStartGenerationRunner,
		connectedInputs,
	]);
	return (
		<PropertiesPanelRoot>
			<PropertiesPanelHeader
				icon={<NodeIcon node={node} className="size-[20px] text-black-900" />}
				node={node}
				onChangeName={(name) => {
					updateNodeData(node, { name });
				}}
				action={
					node.content.command.state.status === "unconfigured" ? null : (
						<Button type="button" onClick={handleClick}>
							Run Action
						</Button>
					)
				}
			/>
			<PropertiesPanelContent>
				<PropertiesPanel node={node} />
			</PropertiesPanelContent>
		</PropertiesPanelRoot>
	);
}

function PropertiesPanel({ node }: { node: ActionNode }) {
	switch (node.content.command.provider) {
		case "github":
			return <GitHubActionPropertiesPanel node={node} />;
		case "web-search":
			// TODO: Implement WebSearchActionPropertiesPanel
			return <div>Web Search Action (Coming Soon)</div>;
		default: {
			// TODO: Uncomment after implementing WebSearchActionPropertiesPanel
			// const _exhaustiveCheck: never = node.content.command.provider;
			// throw new Error(`Unhandled action provider: ${_exhaustiveCheck}`);
			const unknownProvider = (node.content.command as { provider: string })
				.provider;
			throw new Error(`Unhandled action provider: ${unknownProvider}`);
		}
	}
}
