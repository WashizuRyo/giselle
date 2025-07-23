import { Connection, Node, NodeLike, OperationNode } from "@giselle-sdk/data-type";
import { createIdGenerator } from "@giselle-sdk/utils";
import { z } from "zod/v4";

export const SequenceId = createIdGenerator("sq");
export type SequenceId = z.infer<typeof SequenceId.schema>;
export const WorkflowId = createIdGenerator("wf");
export type WorkflowId = z.infer<typeof WorkflowId.schema>;

export const Step = z.object({
	node: OperationNode,
	sourceNodes: z.array(Node),
	connections: z.array(Connection),
});
export type Step = z.infer<typeof Step>;

export const Sequence = z.object({
	id: SequenceId.schema,
	workflowId: WorkflowId.schema,
	steps: z.array(Step),
});
export type Sequence = z.infer<typeof Sequence>;

export const Workflow = z.object({
	id: WorkflowId.schema,
	sequences: z.array(Sequence),
	nodes: z.array(NodeLike),
});
export type Workflow = z.infer<typeof Workflow>;
