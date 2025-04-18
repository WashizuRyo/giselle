"use client";

import type { TeamRole } from "@/drizzle";
import type { TeamId } from "@/services/teams/types";
import { useCallback, useEffect, useState } from "react";
import { getInvitedMembers } from "./invite-member-dialog";
import { TeamMemberListItem } from "./team-members-list-item";

type TeamMembersListProps = {
	teamId: TeamId;
	members: {
		userId: string;
		displayName: string | null;
		email: string | null;
		role: TeamRole;
		isInvited?: boolean;
	}[];
	currentUserRole: TeamRole;
	isProPlan: boolean;
	teamInvitationViaEmailEnabled: boolean;
};

export function TeamMembersList({
	teamId,
	members,
	currentUserRole,
	isProPlan,
	teamInvitationViaEmailEnabled,
}: TeamMembersListProps) {
	// Get invited members on client side
	const [invitedMembers, setInvitedMembers] = useState<
		{ email: string; role: TeamRole }[]
	>([]);

	// Function to refresh invited members list wrapped in useCallback
	const refreshInvitedMembers = useCallback(() => {
		if (!teamInvitationViaEmailEnabled) {
			return;
		}

		try {
			const invited = getInvitedMembers();
			console.log("Refreshed invited members:", invited);
			setInvitedMembers(invited || []);
		} catch (error) {
			console.error("Error refreshing invited members:", error);
		}
	}, [teamInvitationViaEmailEnabled]);

	// Get invited members once on mount and when custom event is fired
	useEffect(() => {
		// Initial load
		refreshInvitedMembers();

		// Set up custom event listener
		const handleInvitedMembersUpdated = () => {
			refreshInvitedMembers();
		};

		// Add event listener
		window.addEventListener(
			"invited-members-updated",
			handleInvitedMembersUpdated,
		);

		// Cleanup function
		return () => {
			window.removeEventListener(
				"invited-members-updated",
				handleInvitedMembersUpdated,
			);
		};
	}, [refreshInvitedMembers]);

	return (
		<>
			{members.map((member) => (
				<TeamMemberListItem
					key={`${teamId}-${member.userId}`}
					userId={member.userId}
					displayName={member.displayName}
					email={member.email}
					role={member.role}
					currentUserRole={currentUserRole}
					isProPlan={isProPlan}
					isInvited={member.isInvited}
				/>
			))}

			{invitedMembers.length > 0 &&
				invitedMembers.map((invitedMember, index) => (
					<TeamMemberListItem
						key={`invited-${index}-${invitedMember.email}`}
						userId={`temp-id-${index}`}
						displayName={null}
						email={invitedMember.email}
						role={invitedMember.role}
						currentUserRole={currentUserRole}
						isProPlan={isProPlan}
						isInvited={true}
					/>
				))}
		</>
	);
}
