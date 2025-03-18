import { FalLanguageModel } from "@giselle-sdk/language-model";
import { z } from "zod";

export const ImageGenerationLanguageModelData = FalLanguageModel.pick({
	provider: true,
	id: true,
	configurations: true,
});
export type ImageGenerationLanguageModelData =
	typeof ImageGenerationLanguageModelData;

export const ImageGenerationLanguageModelProvider = z.enum([
	ImageGenerationLanguageModelData.shape.provider.value,
]);
export type ImageGenerationLanguageModelProvider = z.infer<
	typeof ImageGenerationLanguageModelProvider
>;

export const ImageGenerationContent = z.object({
	type: z.literal("imageGeneration"),
	llm: ImageGenerationLanguageModelData,
	prompt: z.string().optional(),
});
export type ImageGenerationContent = z.infer<typeof ImageGenerationContent>;

export const OverrideImageGenerationContent = z.object({
	type: z.literal("imageGeneration"),
	prompt: z.string(),
});
export type OverrideImageGenerationContent = z.infer<
	typeof OverrideImageGenerationContent
>;
export function isOverrideImageGenerationContent(
	content: unknown,
): content is OverrideImageGenerationContent {
	return OverrideImageGenerationContent.safeParse(content).success;
}

export const ImageGenerationContentReference = z.object({
	type: ImageGenerationContent.shape.type,
});
export type ImageGenerationContentReference =
	typeof ImageGenerationContentReference;
