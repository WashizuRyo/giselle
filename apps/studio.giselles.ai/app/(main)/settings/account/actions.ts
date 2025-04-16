"use server";

import {
	type TeamRole,
	type UserId,
	db,
	supabaseUserMappings,
	users,
} from "@/drizzle";
import { updateGiselleSession } from "@/lib/giselle-session";
import { logger } from "@/lib/logger";
import { getUser } from "@/lib/supabase";
import {
	connectIdentity,
	disconnectIdentity,
	reconnectIdentity,
} from "@/services/accounts";
import { isTeamId } from "@/services/teams";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteTeamMember } from "../team/actions";

export async function connectGoogleIdentity() {
	return connectIdentity("google", "/settings/account/authentication");
}

export async function connectGitHubIdentity() {
	return connectIdentity("github", "/settings/account/authentication");
}

export async function reconnectGoogleIdentity() {
	return reconnectIdentity("google", "/settings/account/authentication");
}

export async function reconnectGitHubIdentity() {
	return reconnectIdentity("github", "/settings/account/authentication");
}

export async function disconnectGoogleIdentity() {
	return disconnectIdentity("google", "/settings/account/authentication");
}

export async function disconnectGitHubIdentity() {
	return disconnectIdentity("github", "/settings/account/authentication");
}

export async function getAccountInfo() {
	try {
		const supabaseUser = await getUser();

		const _users = await db
			.select({ displayName: users.displayName, email: users.email })
			.from(users)
			.innerJoin(
				supabaseUserMappings,
				eq(users.dbId, supabaseUserMappings.userDbId),
			)
			.where(eq(supabaseUserMappings.supabaseUserId, supabaseUser.id));

		return _users[0];
	} catch (error) {
		logger.error("Failed to get account info:", error);
		throw error;
	}
}

export async function updateDisplayName(formData: FormData) {
	try {
		const supabaseUser = await getUser();

		if (!supabaseUser) {
			throw new Error("User not found");
		}

		const displayName = formData.get("displayName") as string;

		const userDbIdSubquery = db
			.select({ userDbId: supabaseUserMappings.userDbId })
			.from(supabaseUserMappings)
			.where(eq(supabaseUserMappings.supabaseUserId, supabaseUser.id));

		await db
			.update(users)
			.set({ displayName })
			.where(eq(users.dbId, userDbIdSubquery));

		revalidatePath("/settings/account/authentication");

		return { success: true };
	} catch (error) {
		logger.error("Failed to update display name:", error);
		return { success: false, error };
	}
}

export async function navigateWithChangeTeam(rawTeamId: string, path: string) {
	const teamId = isTeamId(rawTeamId) ? rawTeamId : null;
	if (!teamId) {
		throw new Error("Invalid team ID");
	}
	await updateGiselleSession({ teamId });
	redirect(path);
}

export async function leaveTeam(
	rawTeamId: string,
	rawUserId: string,
	rawRole: string,
) {
	const teamId = isTeamId(rawTeamId) ? rawTeamId : null;
	if (!teamId) {
		throw new Error("Invalid team ID");
	}
	const isUserId = (value: string): value is UserId => {
		return value.length > 0 && value.startsWith("usr_");
	};
	const userId = isUserId(rawUserId) ? rawUserId : null;
	if (!userId) {
		throw new Error("Invalid user ID");
	}

	const isRole = (value: string): value is TeamRole => {
		return value === "admin" || value === "member";
	};
	const role = isRole(rawRole.toLowerCase()) ? rawRole.toLowerCase() : null;
	if (!role) {
		console.error("Invalid role", rawRole);
		throw new Error("Invalid role");
	}

	await updateGiselleSession({ teamId });
	const formData = new FormData();
	formData.set("userId", userId);
	formData.set("role", role);
	// FIXME: Current implementation requires current user to be an admin of the team. It's better to allow any user to leave the team.
	const result = await deleteTeamMember(formData);

	if (result.success) {
		revalidatePath("/settings/account");
	}
	return result;
}
