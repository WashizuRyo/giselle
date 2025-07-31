import { Workspace } from "@giselle-sdk/data-type";
import { describe, expect, test } from "vitest";
import { backwardTraversalFixture } from "../__fixtures__/backward-traversal";
import workspace4 from "../__fixtures__/workspace4.json";
import { sliceGraphFromNode } from "./slice-graph-from-node";
import { testWorkspace1 } from "./test/test-data";

describe("slice-graph-from-node", () => {
	describe("test with testWorkspace1", () => {
		describe("start with nd-y7lLktmBplRvcSov", () => {
			test("should has three nodes", () => {
				const startNode = testWorkspace1.nodes.find(
					(node) => node.id === "nd-y7lLktmBplRvcSov",
				);
				if (startNode === undefined) {
					throw new Error("startNode is undefined");
				}
				const { nodes } = sliceGraphFromNode(startNode, testWorkspace1);
				expect(nodes).toHaveLength(3);
			});
		});
	});
	describe("test with workspace4.json", () => {
		describe("start with nd-y7lLktmBplRvcSov", () => {
			test("should has three nodes", () => {
				const workspace = Workspace.parse(workspace4);
				const startNode = workspace.nodes.find(
					(node) => node.id === "nd-EvtraAYLc3SoHIFZ",
				);
				if (startNode === undefined) {
					throw new Error("startNode is undefined");
				}
				const { nodes } = sliceGraphFromNode(startNode, workspace);

				expect(nodes).toHaveLength(3);
			});
		});
	});
	describe("test with backwardTraversalFixture", () => {
		test("should slice only A flow when starting from Manual Trigger A", () => {
			const startNode = backwardTraversalFixture.nodes.find(
				(node) => node.id === "nd-CWGF6MO4nyzPpjJM",
			);
			if (startNode === undefined) {
				throw new Error("Manual Trigger A not found");
			}

			const { nodes, connections } = sliceGraphFromNode(
				startNode,
				backwardTraversalFixture,
			);

			// Starting from Manual Trigger A should include:
			// - Manual Trigger A itself
			// - TGA2 (forward from Manual Trigger A)
			// - Variable (backward from TGA2)
			// - TGA1 (backward from TGA2)
			const nodeIds = nodes.map((n) => n.id).sort();
			expect(nodeIds).toEqual([
				"nd-CWGF6MO4nyzPpjJM", // Manual Trigger A
				"nd-IRHq5YW3n2CroK79", // TGA2
				"nd-J154bodtpS9bEtx1", // TGA1
				"nd-TuATf8CniAaZuYSk", // Variable
			]);

			// Should NOT include any B flow nodes
			expect(nodeIds).not.toContain("nd-4rgk30ypWv13sOEX"); // Manual Trigger B
			expect(nodeIds).not.toContain("nd-cKT1VnN0HwYhGHBG"); // TGB2
			expect(nodeIds).not.toContain("nd-9gSPuOSKVrDPxLFZ"); // TGB1

			// Should have 3 connections in the A flow
			expect(connections).toHaveLength(3);
			const connectionIds = connections.map((c) => c.id).sort();
			expect(connectionIds).toEqual([
				"cnnc-777MuPE1oXAAKysb", // Variable → TGA2
				"cnnc-ejmL0pjWE8o85r3m", // TGA1 → TGA2
				"cnnc-vYEfxqxb1XLZJaQd", // Manual Trigger A → TGA2
			]);
		});

		test("should slice only B flow when starting from Manual Trigger B", () => {
			const startNode = backwardTraversalFixture.nodes.find(
				(node) => node.id === "nd-4rgk30ypWv13sOEX",
			);
			if (startNode === undefined) {
				throw new Error("Manual Trigger B not found");
			}

			const { nodes, connections } = sliceGraphFromNode(
				startNode,
				backwardTraversalFixture,
			);

			// Starting from Manual Trigger B should include:
			// - Manual Trigger B itself
			// - TGB2 (forward from Manual Trigger B)
			// - Variable (backward from TGB2)
			// - TGB1 (backward from TGB2)
			const nodeIds = nodes.map((n) => n.id).sort();
			expect(nodeIds).toEqual([
				"nd-4rgk30ypWv13sOEX", // Manual Trigger B
				"nd-9gSPuOSKVrDPxLFZ", // TGB1
				"nd-TuATf8CniAaZuYSk", // Variable
				"nd-cKT1VnN0HwYhGHBG", // TGB2
			]);

			// Should NOT include any A flow nodes
			expect(nodeIds).not.toContain("nd-CWGF6MO4nyzPpjJM"); // Manual Trigger A
			expect(nodeIds).not.toContain("nd-IRHq5YW3n2CroK79"); // TGA2
			expect(nodeIds).not.toContain("nd-J154bodtpS9bEtx1"); // TGA1

			// Should have 3 connections in the B flow
			expect(connections).toHaveLength(3);
			const connectionIds = connections.map((c) => c.id).sort();
			expect(connectionIds).toEqual([
				"cnnc-JGf9hBrBsy4DXunz", // TGB1 → TGB2
				"cnnc-QFRBz9Y06xCx80oL", // Manual Trigger B → TGB2
				"cnnc-n8tdkspIpnf72UHP", // Variable → TGB2
			]);
		});
	});
});
