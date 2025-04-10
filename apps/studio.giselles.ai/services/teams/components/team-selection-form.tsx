"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ProTag } from "@/components/pro-tag";
import { FreeTag } from "@/components/free-tag";
import { useRef } from "react";
import { selectTeam } from "../actions/select-team";
import type { Team } from "../types";

type TeamSelectionFormProps = {
	allTeams: Team[];
	currentTeam: Team;
};

export function TeamSelectionForm({
	allTeams,
	currentTeam,
}: TeamSelectionFormProps) {
	const formRef = useRef<HTMLFormElement>(null);

	return (
		<form action={selectTeam} ref={formRef}>
			<Select
				name="teamId"
				defaultValue={currentTeam.id}
				onValueChange={() => {
					formRef.current?.requestSubmit();
				}}
			>
				<SelectTrigger className="w-auto min-w-[120px] max-w-[360px] [&>svg]:w-5 [&>svg]:h-5 [&>svg]:shrink-0 [&>svg]:opacity-50 border-0 hover:[&>svg]:bg-accent hover:[&>svg]:opacity-100 hover:[&>svg]:rounded-md hover:[&>svg]:p-0.5 flex justify-between items-center data-[state=open]:border-0 data-[state=open]:ring-0 focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 text-base font-hubot outline-none focus-visible:outline-none px-1 py-1 [&>span]:text-primary-100">
					<SelectValue placeholder="Select Team" />
				</SelectTrigger>
				<SelectContent className="w-[240px] p-1">
					{allTeams.map((team) => (
						<SelectItem key={team.id} value={team.id} className="p-1 pl-8">
							<div className="flex items-center gap-1 pr-4">
								<span className="truncate mr-1 max-w-[150px] text-base font-hubot text-white-400" title={team.name}>
									{team.name}
								</span>
								{team.isPro ? <ProTag /> : <FreeTag />}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</form>
	);
}
