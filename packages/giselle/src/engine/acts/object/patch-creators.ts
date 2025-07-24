import type { Act } from "../../../concepts/act";
import type { Patch } from "./patch-object";

// Type-safe patch creators for Act fields

// Status patches
export const status = {
	set: (value: Act["status"]): Patch => ({
		path: "status",
		set: value,
	}),
} as const;

// Steps patches
export const steps = {
	queued: {
		set: (value: Act["steps"]["queued"]): Patch => ({
			path: "steps.queued",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "steps.queued",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "steps.queued",
			decrement: value,
		}),
	},
	inProgress: {
		set: (value: Act["steps"]["inProgress"]): Patch => ({
			path: "steps.inProgress",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "steps.inProgress",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "steps.inProgress",
			decrement: value,
		}),
	},
	completed: {
		set: (value: Act["steps"]["completed"]): Patch => ({
			path: "steps.completed",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "steps.completed",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "steps.completed",
			decrement: value,
		}),
	},
	warning: {
		set: (value: Act["steps"]["warning"]): Patch => ({
			path: "steps.warning",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "steps.warning",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "steps.warning",
			decrement: value,
		}),
	},
	cancelled: {
		set: (value: Act["steps"]["cancelled"]): Patch => ({
			path: "steps.cancelled",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "steps.cancelled",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "steps.cancelled",
			decrement: value,
		}),
	},
	failed: {
		set: (value: Act["steps"]["failed"]): Patch => ({
			path: "steps.failed",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "steps.failed",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "steps.failed",
			decrement: value,
		}),
	},
} as const;

// Duration patches
export const duration = {
	wallClock: {
		set: (value: Act["duration"]["wallClock"]): Patch => ({
			path: "duration.wallClock",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "duration.wallClock",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "duration.wallClock",
			decrement: value,
		}),
	},
	totalTask: {
		set: (value: Act["duration"]["totalTask"]): Patch => ({
			path: "duration.totalTask",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "duration.totalTask",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "duration.totalTask",
			decrement: value,
		}),
	},
} as const;

// Usage patches
export const usage = {
	promptTokens: {
		set: (value: Act["usage"]["promptTokens"]): Patch => ({
			path: "usage.promptTokens",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "usage.promptTokens",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "usage.promptTokens",
			decrement: value,
		}),
	},
	completionTokens: {
		set: (value: Act["usage"]["completionTokens"]): Patch => ({
			path: "usage.completionTokens",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "usage.completionTokens",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "usage.completionTokens",
			decrement: value,
		}),
	},
	totalTokens: {
		set: (value: Act["usage"]["totalTokens"]): Patch => ({
			path: "usage.totalTokens",
			set: value,
		}),
		increment: (value: number): Patch => ({
			path: "usage.totalTokens",
			increment: value,
		}),
		decrement: (value: number): Patch => ({
			path: "usage.totalTokens",
			decrement: value,
		}),
	},
} as const;

// Annotations patches
export const annotations = {
	push: (items: Act["annotations"]): Patch => ({
		path: "annotations",
		push: items,
	}),
	set: (items: Act["annotations"]): Patch => ({
		path: "annotations",
		set: items,
	}),
} as const;

// Sequences patches with dynamic indices
export const sequences = (index: number) => ({
	status: {
		set: (value: Act["sequences"][number]["status"]): Patch => ({
			path: `sequences.${index}.status`,
			set: value,
		}),
	},
	steps: (stepIndex: number) => ({
		status: {
			set: (
				value: Act["sequences"][number]["steps"][number]["status"],
			): Patch => ({
				path: `sequences.${index}.steps.${stepIndex}.status`,
				set: value,
			}),
		},
		name: {
			set: (
				value: Act["sequences"][number]["steps"][number]["name"],
			): Patch => ({
				path: `sequences.${index}.steps.${stepIndex}.name`,
				set: value,
			}),
		},
	}),
});

// Other simple fields
export const trigger = {
	set: (value: Act["trigger"]): Patch => ({ path: "trigger", set: value }),
} as const;

export const updatedAt = {
	set: (value: Act["updatedAt"]): Patch => ({ path: "updatedAt", set: value }),
} as const;

// Convenience re-export of all patch creators
export const patches = {
	status,
	steps,
	duration,
	usage,
	annotations,
	sequences,
	trigger,
	updatedAt,
} as const;
