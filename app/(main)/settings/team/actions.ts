"use server";

import {
	type TeamRole,
	db,
	subscriptions,
	supabaseUserMappings,
	teamMemberships,
	teams,
	users,
} from "@/drizzle";
import { getUser } from "@/lib/supabase";
import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function isTeamRole(role: string): role is TeamRole {
	return role === "admin" || role === "member";
}

export async function getTeamName() {
	const user = await getUser();

	// TODO: In the future, this query will be changed to retrieve from the selected team ID
	const _teams = await db
		.select({ dbId: teams.dbId, name: teams.name })
		.from(teams)
		.innerJoin(teamMemberships, eq(teams.dbId, teamMemberships.teamDbId))
		.innerJoin(
			supabaseUserMappings,
			eq(teamMemberships.userDbId, supabaseUserMappings.userDbId),
		)
		.where(eq(supabaseUserMappings.supabaseUserId, user.id));

	return _teams[0].name;
}

export async function updateTeamName(teamDbId: number, formData: FormData) {
	const newName = formData.get("name") as string;
	const user = await getUser();

	try {
		await db.transaction(async (tx) => {
			const team = await tx
				.select({ dbId: teams.dbId })
				.from(teams)
				.for("update")
				.innerJoin(teamMemberships, eq(teams.dbId, teamMemberships.teamDbId))
				.innerJoin(
					supabaseUserMappings,
					eq(teamMemberships.userDbId, supabaseUserMappings.userDbId),
				)
				.where(
					and(
						eq(supabaseUserMappings.supabaseUserId, user.id),
						eq(teams.dbId, teamDbId),
					),
				);

			if (team.length === 0) {
				throw new Error("Team not found");
			}

			await tx
				.update(teams)
				.set({ name: newName })
				.where(eq(teams.dbId, team[0].dbId));
		});
		revalidatePath("/settings/team");

		return { success: true };
	} catch (error) {
		console.error("Failed to update team name:", error);
		return { success: false, error };
	}
}

export async function getTeamMembers() {
	try {
		const supabaseUser = await getUser();

		// Subquery: Get current user's team
		// TODO: In the future, this query will be changed to retrieve from the selected team ID
		const currentUserTeam = db
			.select({
				teamDbId: teams.dbId,
			})
			.from(teams)
			.innerJoin(teamMemberships, eq(teams.dbId, teamMemberships.teamDbId))
			.innerJoin(
				supabaseUserMappings,
				eq(teamMemberships.userDbId, supabaseUserMappings.userDbId),
			)
			.where(eq(supabaseUserMappings.supabaseUserId, supabaseUser.id))
			.limit(1);

		// Main query: Get team members list
		const teamMembers = await db
			.select({
				userId: users.id,
				email: users.email,
				displayName: users.displayName,
				role: teamMemberships.role,
			})
			.from(users)
			.innerJoin(
				teamMemberships,
				and(
					eq(users.dbId, teamMemberships.userDbId),
					eq(teamMemberships.teamDbId, currentUserTeam),
				),
			)
			.orderBy(asc(teamMemberships.id));

		return {
			success: true,
			data: teamMembers,
		};
	} catch (error) {
		console.error("Failed to get team members:", error);

		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to get team members",
		};
	}
}

export async function addTeamMember(formData: FormData) {
	try {
		const email = formData.get("email") as string;
		const role = formData.get("role") as string;

		if (!isTeamRole(role)) {
			throw new Error("Invalid role");
		}

		// 1. Get current user's team
		const supabaseUser = await getUser();

		const team = await db
			.select({ dbId: teams.dbId })
			.from(teams)
			.innerJoin(teamMemberships, eq(teams.dbId, teamMemberships.teamDbId))
			.innerJoin(
				supabaseUserMappings,
				eq(teamMemberships.userDbId, supabaseUserMappings.userDbId),
			)
			.where(eq(supabaseUserMappings.supabaseUserId, supabaseUser.id));

		if (team.length === 0) {
			throw new Error("Team not found");
		}

		const currentTeam = team[0]; // TODO: This will need to be adjusted after implementing team switching

		// 2. Find user by email
		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (user.length === 0) {
			throw new Error("User not found");
		}

		// 3. Check if user is already a team member
		const existingMembership = await db
			.select()
			.from(teamMemberships)
			.where(
				and(
					eq(teamMemberships.teamDbId, currentTeam.dbId),
					eq(teamMemberships.userDbId, user[0].dbId),
				),
			);

		if (existingMembership.length > 0) {
			throw new Error("User is already a team member");
		}

		// 4. Create team membership
		await db.insert(teamMemberships).values({
			teamDbId: team[0].dbId,
			userDbId: user[0].dbId,
			role,
		});

		revalidatePath("/settings/team");

		return { success: true };
	} catch (error) {
		console.error("Failed to add team member:", error);

		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to add team member",
		};
	}
}

export async function getCurrentUserRole() {
	try {
		const supabaseUser = await getUser();

		// Subquery: Get current user's team
		const currentUserTeam = db
			.select({
				teamDbId: teams.dbId,
			})
			.from(teams)
			.innerJoin(teamMemberships, eq(teams.dbId, teamMemberships.teamDbId))
			.innerJoin(
				supabaseUserMappings,
				eq(teamMemberships.userDbId, supabaseUserMappings.userDbId),
			)
			.where(eq(supabaseUserMappings.supabaseUserId, supabaseUser.id))
			.limit(1);

		// Get current user's role in the team
		const result = await db
			.select({
				role: teamMemberships.role,
			})
			.from(teamMemberships)
			.innerJoin(
				supabaseUserMappings,
				eq(teamMemberships.userDbId, supabaseUserMappings.userDbId),
			)
			.where(
				and(
					eq(supabaseUserMappings.supabaseUserId, supabaseUser.id),
					eq(teamMemberships.teamDbId, currentUserTeam),
				),
			)
			.limit(1);

		if (result.length === 0) {
			throw new Error("User role not found");
		}

		return {
			success: true,
			data: result[0].role,
		};
	} catch (error) {
		console.error("Failed to get current user role:", error);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to get current user role",
		};
	}
}
