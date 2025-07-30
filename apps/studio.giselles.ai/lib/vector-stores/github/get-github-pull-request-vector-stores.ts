import { and, eq } from "drizzle-orm";
import {
	db,
	githubRepositoryContentStatus,
	githubRepositoryIndex,
} from "@/drizzle";

export async function getGitHubPullRequestVectorStores(teamDbId: number) {
	const vectorStores = await db
		.select({
			id: githubRepositoryIndex.id,
			owner: githubRepositoryIndex.owner,
			repo: githubRepositoryIndex.repo,
		})
		.from(githubRepositoryIndex)
		.innerJoin(
			githubRepositoryContentStatus,
			and(
				eq(
					githubRepositoryContentStatus.repositoryIndexDbId,
					githubRepositoryIndex.dbId,
				),
				eq(githubRepositoryContentStatus.contentType, "pull_request"),
			),
		)
		.where(
			and(
				eq(githubRepositoryIndex.teamDbId, teamDbId),
				eq(githubRepositoryContentStatus.status, "completed"),
				eq(githubRepositoryContentStatus.enabled, true),
			),
		);
	return vectorStores.map((vectorStore) => ({
		id: vectorStore.id,
		name: `${vectorStore.owner}/${vectorStore.repo}`,
		reference: {
			provider: "githubPullRequest" as const,
			owner: vectorStore.owner,
			repo: vectorStore.repo,
		},
	}));
}
