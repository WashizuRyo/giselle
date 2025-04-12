import {
	AnthropicLanguageModel,
	GoogleLanguageModel,
	OpenAILanguageModel,
	PerplexityLanguageModel,
} from "@giselle-sdk/language-model";
import { z } from "zod";

export const AnthropicLanguageModelData = AnthropicLanguageModel.pick({
	provider: true,
	id: true,
	configurations: true,
});
export type AnthropicLanguageModelData = z.infer<
	typeof AnthropicLanguageModelData
>;
export const GoogleLanguageModelData = GoogleLanguageModel.pick({
	provider: true,
	id: true,
	configurations: true,
});
export type GoogleLanguageModelData = z.infer<typeof GoogleLanguageModelData>;
export const OpenAILanguageModelData = OpenAILanguageModel.pick({
	provider: true,
	id: true,
	configurations: true,
});
export type OpenAILanguageModelData = z.infer<typeof OpenAILanguageModelData>;

export const PerplexityLanguageModelData = PerplexityLanguageModel.pick({
	provider: true,
	id: true,
	configurations: true,
});
export type PerplexityLanguageModelData = z.infer<
	typeof PerplexityLanguageModelData
>;

export const TextGenerationLanguageModelProvider = z.enum([
	AnthropicLanguageModelData.shape.provider.value,
	GoogleLanguageModelData.shape.provider.value,
	OpenAILanguageModelData.shape.provider.value,
	PerplexityLanguageModelData.shape.provider.value,
]);
export type TextGenerationLanguageModelProvider = z.infer<
	typeof TextGenerationLanguageModelProvider
>;

export const TextGenerationLanguageModelData = z.discriminatedUnion(
	"provider",
	[
		AnthropicLanguageModelData,
		GoogleLanguageModelData,
		OpenAILanguageModelData,
		PerplexityLanguageModelData,
	],
);
export type TextGenerationLanguageModelData = z.infer<
	typeof TextGenerationLanguageModelData
>;
export function isTextGenerationLanguageModelData(
	data: unknown,
): data is TextGenerationLanguageModelData {
	return TextGenerationLanguageModelData.safeParse(data).success;
}

export const GitHubTool = z.object({
	type: z.literal("github"),
	repositoryNodeId: z.string(),
	tools: z.string().array(),
});
export type GitHubTool = z.infer<typeof GitHubTool>;

export const TextGenerationContent = z.object({
	type: z.literal("textGeneration"),
	llm: TextGenerationLanguageModelData,
	prompt: z.string().optional(),
	tools: z.optional(
		z.object({
			github: z.optional(GitHubTool),
		}),
	),
});
export type TextGenerationContent = z.infer<typeof TextGenerationContent>;

export const OverrideTextGenerationContent = z.object({
	type: z.literal("textGeneration"),
	prompt: z.string(),
});
export type OverrideTextGenerationContent = z.infer<
	typeof OverrideTextGenerationContent
>;

export function isOverrideTextGenerationContent(
	content: unknown,
): content is OverrideTextGenerationContent {
	return OverrideTextGenerationContent.safeParse(content).success;
}

export const TextGenerationContentReference = z.object({
	type: TextGenerationContent.shape.type,
});
export type TextGenerationContentReference = z.infer<
	typeof TextGenerationContentReference
>;
