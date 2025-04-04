"use client";

import {
	Editor,
	Header,
	SettingsView,
	Viewer,
} from "@giselle-internal/workflow-designer-ui";
import { useWorkflowDesigner } from "giselle-sdk/react";
import { useState } from "react";
import { WorkspaceTour } from "../../components/workspace-tour";

export default function Page() {
	const { view } = useWorkflowDesigner();
	const [isTourOpen, setIsTourOpen] = useState(true); // 最初から表示

	// ツアーステップの定義
	const tourSteps = [
		{
			title: "Welcome to Giselle",
			content: "This platform helps you build and manage AI workflows easily.",
			placement: "bottom" as const,
		},
		{
			title: "Your command hub.",
			content:
				"Add Gen nodes, access your knowledge base, manipulate files, invoke other agents, and orchestrate your workflow.",
			placement: "right" as const,
			target: ".nav, .absolute.bottom-0, nav.rounded-\\[8px\\]", // 下部ナビゲーションバーを正確に指定
		},
		{
			title: "Node Settings",
			content:
				"Double-tap nodes to edit settings, craft prompts, configure references, and establish connections between nodes to create a seamless generation flow.",
			placement: "left" as const,
		},
		{
			title: "Connecting Nodes",
			content:
				"Connect nodes by hovering over node edges and dragging to your target, or specify connections directly in node settings to create powerful automation pathways.",
			placement: "right" as const,
		},
		{
			target:
				"[role='tablist'], .flex.items-center.rounded-\\[8px\\], div[role='tablist']", // モード切替タブの別セレクタ
			title: "Workflow Modes",
			content:
				"Experience the complete development lifecycle with three specialized modes: Build to design your node workflows, Preview to test and validate your creations, and Integrate to connect with GitHub and deploy your solutions seamlessly.",
			placement: "bottom" as const,
		},
		{
			title: "Resources & Support",
			content:
				'Get help when you need it. Explore our comprehensive <a href="https://docs.giselles.ai/introduction" style="text-decoration: underline; color: #0087f6;">Docs</a> for detailed guidance and best practices whenever you encounter challenges.',
			placement: "bottom" as const,
		},
	];

	return (
		<div className="flex flex-col h-screen bg-black-900">
			<Header />

			{view === "editor" && <Editor />}
			{view === "viewer" && <Viewer />}
			{view === "integrator" && <SettingsView />}

			{/* ワークスペースツアーの追加 */}
			<WorkspaceTour
				steps={tourSteps}
				isOpen={isTourOpen}
				onClose={() => setIsTourOpen(false)}
			/>
		</div>
	);
}
