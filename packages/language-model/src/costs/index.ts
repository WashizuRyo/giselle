export * from "./pricing";
export { openAiTokenPricing, getValidPricing, type ModelPriceTable } from "./model-prices";
export type { TokenUsage } from "./usage";
export { calculateTokenCost } from "./calculator";
export type { CostCalculator, CostResult } from "./calculator";

import type { CostCalculator } from "./calculator";
import { DefaultCostCalculator } from "./calculator";
import { OpenAICostCalculator } from "../openai";

export function createCostCalculator(provider: string): CostCalculator {
	switch (provider) {
		case "openai":
			return new OpenAICostCalculator();
		default:
			console.log(`Unimplemented provider: ${provider}`);
			return new DefaultCostCalculator(provider);
	}
}

export async function calculateCost(
	provider: string,
	modelId: string,
	usage: { promptTokens: number; completionTokens: number },
) {
	const calculator = createCostCalculator(provider);
	const result = await calculator.calculate(modelId, {
		...usage,
		totalTokens: usage.promptTokens + usage.completionTokens,
	});
	return {
		inputCost: result.input,
		outputCost: result.output,
		totalCost: result.total,
	};
}
