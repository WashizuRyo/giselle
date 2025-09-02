"use client";

import { Input } from "@giselle-internal/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@giselle-internal/ui/table";
import { isTextGenerationNode, type NodeId } from "@giselle-sdk/data-type";
import { memo, useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useEditorStore, useEditorStoreWithEqualityFn } from "../store/context";

export function DebugViewer() {
	// Subscribe only to the list of IDs so the viewer component doesn't rerender
	// when node contents change (only when membership/order changes).
	const nodeIds = useEditorStoreWithEqualityFn(
		(s) => Object.keys(s.nodesById).sort() as NodeId[],
		shallow,
	);
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Node Name</TableHead>
					<TableHead>Node type</TableHead>
					<TableHead>Prompt</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{nodeIds.map((id) => (
					<ViewerRow key={id} id={id} />
				))}
			</TableBody>
		</Table>
	);
}

const ViewerRow = memo(function ViewerRow({ id }: { id: NodeId }) {
	const node = useEditorStoreWithEqualityFn((s) => s.nodesById[id], shallow);
	return (
		<TableRow>
			<TableCell>{node.name}</TableCell>
			<TableCell>{node.type}</TableCell>
			{isTextGenerationNode(node) && (
				<TableCell>{node.content.prompt}</TableCell>
			)}
		</TableRow>
	);
});
export function DebugForm() {
	// Subscribe only to the list of IDs; individual rows subscribe to their node.
	const nodeIds = useEditorStoreWithEqualityFn(
		(s) => Object.keys(s.nodesById).sort() as NodeId[],
		shallow,
	);

	return (
		<form>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Node Name</TableHead>
						<TableHead>Node type</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{nodeIds.map((id) => (
						<FormRow key={id} id={id} />
					))}
				</TableBody>
			</Table>
		</form>
	);
}

const FormRow = memo(function FormRow({ id }: { id: NodeId }) {
	const node = useEditorStoreWithEqualityFn((s) => s.nodesById[id], shallow);
	const updateNode = useEditorStore((s) => s.updateNode);

	const handleChangeName = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			updateNode(id, { name: e.target.value });
		},
		[updateNode, id],
	);

	return (
		<TableRow>
			<TableCell>
				<Input value={node.name} onChange={handleChangeName} />
			</TableCell>
			<TableCell>{node.type}</TableCell>
		</TableRow>
	);
});
