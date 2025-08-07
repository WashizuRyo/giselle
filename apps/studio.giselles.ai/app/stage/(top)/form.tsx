"use client";

import { Button } from "@giselle-internal/ui/button";
import { Select } from "@giselle-internal/ui/select";
import type { FlowTrigger, FlowTriggerId } from "@giselle-sdk/data-type";
import type { ParameterItem } from "@giselle-sdk/giselle";
import { SpinnerIcon } from "@giselles-ai/icons/spinner";
import clsx from "clsx/lite";
import type { InferSelectModel } from "drizzle-orm";
import { useActionState, useCallback, useMemo, useState } from "react";
import type { teams } from "@/drizzle";
import {
  createInputsFromTrigger,
  parseFormInputs,
  toParameterItems,
} from "./helpers";
import { TeamCard } from "./team-card";

type TeamId = InferSelectModel<typeof teams>["id"];
interface TeamOption {
  value: TeamId;
  label: string;
}

export interface FlowTriggerUIItem {
  id: FlowTriggerId;
  teamId: TeamId;
  workspaceName: string;
  label: string;
  sdkData: FlowTrigger;
}

interface PerformStagePayloads {
  teamId: TeamId;
  flowTrigger: FlowTrigger;
  parameterItems: ParameterItem[];
}

type PerformStageAction = (payloads: PerformStagePayloads) => Promise<void>;

export function Form({
  teamOptions,
  flowTriggers,
  performStageAction,
}: {
  teamOptions: TeamOption[];
  flowTriggers: FlowTriggerUIItem[];
  performStageAction: PerformStageAction;
}) {
  const defaultTeamId = useMemo(() => teamOptions[0].value, [teamOptions]);
  const [selectedTeamId, setSelectedTeamId] = useState<TeamId>(defaultTeamId);
  const defaultSelectedFlowTriggerId = useMemo(
    () =>
      flowTriggers.find((flowTrigger) => flowTrigger.teamId === defaultTeamId)
        ?.id,
    [flowTriggers, defaultTeamId],
  );
  const [selectedFlowTriggerId, setSelectedFlowTriggerId] = useState<
    FlowTriggerId | undefined
  >(defaultSelectedFlowTriggerId);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const filteredFlowTriggers = useMemo(
    () =>
      flowTriggers.filter(
        (flowTrigger) => flowTrigger.teamId === selectedTeamId,
      ),
    [flowTriggers, selectedTeamId],
  );

  const inputs = useMemo(
    () =>
      createInputsFromTrigger(
        filteredFlowTriggers.find(
          (flowTrigger) => flowTrigger.id === selectedFlowTriggerId,
        )?.sdkData,
      ),
    [selectedFlowTriggerId, filteredFlowTriggers],
  );

  const formAction = useCallback(
    async (_prevState: unknown, formData: FormData) => {
      if (selectedFlowTriggerId === undefined) {
        return null;
      }
      const { errors, values } = parseFormInputs(inputs, formData);

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return null;
      }

      setValidationErrors({});

      const flowTrigger = filteredFlowTriggers.find(
        (flowTrigger) => flowTrigger.id === selectedFlowTriggerId,
      );
      if (flowTrigger === undefined) {
        throw new Error(
          `Flow trigger with ID ${selectedFlowTriggerId} not found`,
        );
      }

      await performStageAction({
        teamId: selectedTeamId,
        flowTrigger: flowTrigger.sdkData,
        parameterItems: toParameterItems(inputs, values),
      });
      return null;
    },
    [
      inputs,
      performStageAction,
      selectedFlowTriggerId,
      selectedTeamId,
      filteredFlowTriggers,
    ],
  );

  const [, action, isPending] = useActionState(formAction, null);

  const selectedTeam = teamOptions.find(
    (team) => team.value === selectedTeamId,
  );

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <TeamCard
        team={
          selectedTeam
            ? {
                id: selectedTeam.value,
                name: selectedTeam.label,
                profileImageUrl: undefined, // TODO: Add profileImageUrl to teamOptions when available
              }
            : undefined
        }
      />
      <form
        action={action}
        className="bg-[var(--color-stage-form-background)] rounded-xl border border-white/10 p-4 text-[14px] text-text resize-none outline-none"
        style={{
          boxShadow: `
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 -1px 4px -2px rgba(35, 133, 255, 0.1),
            inset 0 -4px 20px -6px rgba(255, 255, 255, 0.08),
            inset 0 -8px 30px -8px rgba(102, 148, 255, 0.15),
            inset 0 -15px 50px -20px rgba(20, 76, 205, 1)
          `,
        }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-[2px] rounded-b-xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent)",
            filter: "blur(1px)",
          }}
        />
        <div className="flex flex-col gap-[8px] mb-[8px]">
          {inputs.map((input) => {
            return (
              <fieldset key={input.name} className={clsx("grid gap-2")}>
                <label
                  className="text-[14px] font-medium text-white-900"
                  htmlFor={input.name}
                >
                  {input.label}
                  {input.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {input.type === "text" && (
                  <input
                    type="text"
                    name={input.name}
                    id={input.name}
                    className={clsx(
                      "w-full flex justify-between items-center rounded-[8px] py-[8px] px-[12px] outline-none focus:outline-none border",
                      validationErrors[input.name]
                        ? "border-error"
                        : "border-border",
                      "text-[14px]",
                    )}
                    disabled={isPending}
                  />
                )}
                {input.type === "multiline-text" && (
                  <textarea
                    name={input.name}
                    id={input.name}
                    className={clsx(
                      "w-full flex justify-between items-center rounded-[8px] py-[8px] px-[12px] outline-none focus:outline-none",
                      "border-[1px]",
                      validationErrors[input.name]
                        ? "border-error"
                        : "border-border",
                      "text-[14px]",
                    )}
                    rows={4}
                    disabled={isPending}
                  />
                )}
                {input.type === "number" && (
                  <input
                    type="number"
                    name={input.name}
                    id={input.name}
                    className={clsx(
                      "w-full flex justify-between items-center rounded-[8px] py-[8px] px-[12px] outline-none focus:outline-none",
                      "border-[1px]",
                      validationErrors[input.name]
                        ? "border-error"
                        : "border-border",
                      "text-[14px]",
                    )}
                    disabled={isPending}
                  />
                )}
                {validationErrors[input.name] && (
                  <span className="text-error text-[12px] font-medium">
                    {validationErrors[input.name]}
                  </span>
                )}
              </fieldset>
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 justify-center">
            <Select
              id="team"
              placeholder="Select team"
              options={teamOptions}
              renderOption={(o) => o.label}
              value={selectedTeamId}
              onValueChange={(value) => setSelectedTeamId(value as TeamId)}
            />
            <Select
              id="flow"
              placeholder="Select flow"
              options={
                filteredFlowTriggers.length === 0
                  ? [
                      {
                        value: "no-flow",
                        label: "No flows available",
                      },
                    ]
                  : filteredFlowTriggers.map((trigger) => ({
                      value: trigger.id,
                      label: `${trigger.workspaceName} / ${trigger.label}`,
                    }))
              }
              renderOption={(o) => o.label}
              value={selectedFlowTriggerId}
              onValueChange={(value) => {
                const selectedFlowTrigger = filteredFlowTriggers.find(
                  (flowTrigger) => flowTrigger.id === (value as FlowTriggerId),
                );
                if (selectedFlowTrigger === undefined) {
                  return;
                }
                setSelectedFlowTriggerId(selectedFlowTrigger.id);
              }}
            />
          </div>
          <Button
            variant="solid"
            size="large"
            type="submit"
            disabled={isPending}
            leftIcon={
              isPending && (
                <SpinnerIcon className="animate-follow-through-overlap-spin size-[18px]" />
              )
            }
          >
            {isPending ? "Setting the stage…" : "Start"}
          </Button>
        </div>
      </form>
    </div>
  );
}
