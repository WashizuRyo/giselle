import { Button } from "@giselle-internal/ui/button";
import { PopoverContent } from "@giselle-internal/ui/popover";
import { useWorkflowDesigner } from "@giselle-sdk/giselle-engine/react";
import { useCallback } from "react";
import { useToasts } from "../../ui/toast";
import { useDuplicateNode } from "../node";
import type { ContextMenuProps } from "./types";

export function ContextMenu({
	id,
	top,
	left,
	right,
	bottom,
	onClose,
}: ContextMenuProps) {
	const duplicateNode = useDuplicateNode();
	const { deleteNode } = useWorkflowDesigner();
	const toast = useToasts();

	const handleDuplicate = useCallback(() => {
		duplicateNode(id, () => toast.error("Failed to duplicate node"));
		onClose();
	}, [id, duplicateNode, toast, onClose]);

	const handleDelete = useCallback(() => {
		deleteNode(id);
		onClose();
	}, [id, deleteNode, onClose]);

	return (
		<div
			style={{ top, left, right, bottom }}
			className="fixed z-[1000]"
			role="menu"
			aria-label="Node actions"
		>
			<PopoverContent>
				<Button
					variant="subtle"
					size="default"
					onClick={handleDuplicate}
					className="w-full justify-start [&>div]:text-[12px]"
				>
					Duplicate Node
				</Button>
				<Button
					variant="subtle"
					size="default"
					onClick={handleDelete}
					className="w-full justify-start text-red-400 hover:text-red-300 [&>div]:text-[12px]"
				>
					Delete Node
				</Button>
			</PopoverContent>
		</div>
	);
}
