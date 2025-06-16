import type {
	Document,
	DocumentLoader,
	DocumentLoaderParams,
} from "@giselle-sdk/rag2";
import type { Octokit } from "@octokit/core";

/**
 * GitHub repository loading parameters
 */
export interface GitHubBlobLoaderParams extends DocumentLoaderParams {
	owner: string;
	repo: string;
	commitSha: string;
}

/**
 * GitHub blob metadata
 */
export type GitHubBlobMetadata = {
	owner: string;
	repo: string;
	commitSha: string;
	fileSha: string;
	path: string;
	nodeId: string;
};

/**
 * GitHub blob loader that implements rag2's DocumentLoader interface
 */
export class GitHubBlobLoader
	implements DocumentLoader<GitHubBlobMetadata, GitHubBlobLoaderParams>
{
	private readonly maxBlobSize: number;
	private readonly maxRetries: number;

	constructor(
		private octokit: Octokit,
		options?: {
			maxBlobSize?: number;
			maxRetries?: number;
		},
	) {
		this.maxBlobSize = options?.maxBlobSize ?? 1024 * 1024; // 1MB default
		this.maxRetries = options?.maxRetries ?? 3;
	}

	async *load(
		params: GitHubBlobLoaderParams,
	): AsyncIterable<Document<GitHubBlobMetadata>> {
		const githubParams = params;
		const { owner, repo } = githubParams;
		const commitSha = githubParams.commitSha;

		console.log(`Loading repository ${owner}/${repo} at commit ${commitSha}`);

		// Get tree for the commit
		const { data: commit } = await this.octokit.request(
			"GET /repos/{owner}/{repo}/git/commits/{commit_sha}",
			{ owner, repo, commit_sha: commitSha },
		);
		const { data: tree } = await this.octokit.request(
			"GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
			{ owner, repo, tree_sha: commit.tree.sha, recursive: "true" },
		);

		// Check for tree truncation
		if (tree.truncated) {
			throw new Error(
				`Tree is truncated: ${owner}/${repo}/${tree.sha}. Consider using git clone or tarball API for large repositories.`,
			);
		}

		// Process each file in the tree
		for (const item of tree.tree) {
			if (
				item.type === "blob" &&
				item.path &&
				item.sha &&
				item.size &&
				typeof item.path === "string" &&
				typeof item.sha === "string"
			) {
				// Skip large files
				if (item.size > this.maxBlobSize) {
					console.warn(
						`Blob size is too large: ${item.size} bytes, skipping: ${item.path}`,
					);
					continue;
				}

				// Load the blob content
				const blobContent = await this.loadBlob(
					owner,
					repo,
					item.path,
					item.sha,
					commitSha,
				);

				// Skip binary files
				if (blobContent === null) {
					continue;
				}

				// Yield as document
				yield {
					content: blobContent.content,
					metadata: blobContent.metadata,
				};
			}
		}
	}

	private async loadBlob(
		owner: string,
		repo: string,
		path: string,
		fileSha: string,
		commitSha: string,
		currentAttempt = 1,
	): Promise<{ content: string; metadata: GitHubBlobMetadata } | null> {
		try {
			// Fetch blob data
			const { data: blobData } = await this.octokit.request(
				"GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
				{
					owner,
					repo,
					file_sha: fileSha,
				},
			);

			// Only support base64 encoded content
			if (blobData.encoding !== "base64") {
				return null;
			}

			// Decode base64 content
			const contentInBytes = Buffer.from(blobData.content, "base64");

			// Check if the content is binary
			// We use the TextDecoder with fatal option to detect non-text content
			const textDecoder = new TextDecoder("utf-8", { fatal: true });
			try {
				const decodedContent = textDecoder.decode(contentInBytes);
				return {
					content: decodedContent,
					metadata: {
						owner,
						repo,
						commitSha,
						fileSha,
						path,
						nodeId: blobData.node_id,
					},
				};
			} catch {
				// Binary content will throw an error when trying to decode
				return null;
			}
		} catch (error: unknown) {
			if (
				error instanceof Error &&
				"status" in error &&
				typeof error.status === "number"
			) {
				// Retry on server errors
				if (error.status >= 500 && currentAttempt < this.maxRetries) {
					// Exponential backoff
					await new Promise((resolve) =>
						setTimeout(resolve, 2 ** currentAttempt * 100),
					);
					return this.loadBlob(
						owner,
						repo,
						path,
						fileSha,
						commitSha,
						currentAttempt + 1,
					);
				}
			}

			// Re-throw other errors
			throw new Error(
				`Failed to load blob ${owner}/${repo}/${path}: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}

/**
 * Get the default branch HEAD commit for a GitHub repository
 */
export async function fetchDefaultBranchHead(
	octokit: Octokit,
	owner: string,
	repo: string,
): Promise<{ sha: string }> {
	// Get repository information to find default branch
	const { data: repoData } = await octokit.request(
		"GET /repos/{owner}/{repo}",
		{
			owner,
			repo,
		},
	);

	// Get the latest commit SHA from the default branch
	const { data: branchData } = await octokit.request(
		"GET /repos/{owner}/{repo}/branches/{branch}",
		{
			owner,
			repo,
			branch: repoData.default_branch,
		},
	);

	return {
		sha: branchData.commit.sha,
	};
}
