import type { Tier } from "@giselle-sdk/language-model";

export interface UsageLimits {
	featureTier: Tier;
	resourceLimits: {
		agentTime: {
			limit: number; // in milliseconds
			used: number; // in milliseconds
		};
	};
}
