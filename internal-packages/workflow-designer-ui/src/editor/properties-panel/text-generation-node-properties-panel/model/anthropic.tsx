import {
	AnthropicLanguageModelData,
	type ToolSet,
} from "@giselle-sdk/data-type";
import { useUsageLimits } from "@giselle-sdk/giselle/react";
import {
	anthropicLanguageModels,
	Capability,
	hasCapability,
} from "@giselle-sdk/language-model";
import { useCallback, useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../../ui/select";
import { Slider } from "../../../../ui/slider";
import { Switch } from "../../../../ui/switch";
import { languageModelAvailable } from "./utils";

export function AnthropicModelPanel({
	anthropicLanguageModel,
	onModelChange,
	tools,
	onToolChange,
	onWebSearchChange,
}: {
	anthropicLanguageModel: AnthropicLanguageModelData;
	onModelChange: (changedValue: AnthropicLanguageModelData) => void;
	tools?: ToolSet;
	onToolChange: (changedValue: ToolSet) => void;
	onWebSearchChange: (enabled: boolean) => void;
}) {
	const limits = useUsageLimits();

	const hasReasoningCapability = useMemo(() => {
		const languageModel = anthropicLanguageModels.find(
			(lm) => lm.id === anthropicLanguageModel.id,
		);
		return languageModel && hasCapability(languageModel, Capability.Reasoning);
	}, [anthropicLanguageModel.id]);

	const handleModelChange = useCallback(
		(value: string) => {
			const newLanguageModel = anthropicLanguageModels.find(
				(model) => model.id === value,
			);
			if (newLanguageModel === undefined) {
				return;
			}
			onModelChange(
				AnthropicLanguageModelData.parse({
					...anthropicLanguageModel,
					id: value,
					configurations: {
						...anthropicLanguageModel.configurations,
						reasoningText:
							anthropicLanguageModel.configurations.reasoningText &&
							hasCapability(newLanguageModel, Capability.Reasoning),
					},
				}),
			);
		},
		[anthropicLanguageModel, onModelChange],
	);

	return (
		<div className="flex flex-col gap-[34px]">
			<Select
				value={anthropicLanguageModel.id}
				onValueChange={handleModelChange}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select a LLM" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{anthropicLanguageModels.map((anthropicLanguageModel) => (
							<SelectItem
								key={anthropicLanguageModel.id}
								value={anthropicLanguageModel.id}
								disabled={
									!languageModelAvailable(anthropicLanguageModel, limits)
								}
							>
								{anthropicLanguageModel.id}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<div>
				<div className="grid grid-cols-2 gap-[24px]">
					<Slider
						label="Temperature"
						value={anthropicLanguageModel.configurations.temperature}
						max={2.0}
						min={0.0}
						step={0.01}
						onChange={(value) => {
							onModelChange(
								AnthropicLanguageModelData.parse({
									...anthropicLanguageModel,
									configurations: {
										...anthropicLanguageModel.configurations,
										temperature: value,
									},
								}),
							);
						}}
					/>
					<Slider
						label="Top P"
						value={anthropicLanguageModel.configurations.topP}
						max={1.0}
						min={0.0}
						step={0.01}
						onChange={(value) => {
							onModelChange(
								AnthropicLanguageModelData.parse({
									...anthropicLanguageModel,
									configurations: {
										...anthropicLanguageModel.configurations,
										topP: value,
									},
								}),
							);
						}}
					/>

					{hasReasoningCapability ? (
						<Switch
							label="Reasoning"
							name="reasoning"
							checked={anthropicLanguageModel.configurations.reasoningText}
							onCheckedChange={(checked) => {
								onModelChange(
									AnthropicLanguageModelData.parse({
										...anthropicLanguageModel,
										configurations: {
											...anthropicLanguageModel.configurations,
											reasoningText: checked,
										},
									}),
								);
							}}
						/>
					) : (
						<>
							{/* Refactor this because it duplicates the Switch component */}
							<div className="flex flex-col">
								<div className="flex flex-row items-center justify-between">
									<p className="text-[14px]">Reasoning</p>
									<div className="flex-grow mx-[12px] h-[1px] bg-black-200/30" />
									<p className="text-[12px]">Unsuported</p>
								</div>
							</div>
						</>
					)}

					<Switch
						label="Web Search"
						name="webSearch"
						checked={!!tools?.anthropicWebSearch}
						onCheckedChange={(checked) => {
							let changedTools: ToolSet = {};
							for (const toolName of Object.keys(tools ?? {})) {
								const tool = tools?.[toolName as keyof ToolSet];

								if (
									tool === undefined ||
									(!checked && toolName === "anthropicWebSearch")
								) {
									continue;
								}
								changedTools = {
									...changedTools,
									[toolName]: tool,
								};
							}
							if (checked) {
								changedTools = {
									...tools,
									anthropicWebSearch: {
										maxUses: 3,
									},
								};
							}
							onToolChange(changedTools);
							onWebSearchChange(checked);
						}}
					/>
				</div>
			</div>
		</div>
	);
}
