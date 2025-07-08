import type { DatabaseConfig } from "@giselle-sdk/rag";

/**
 * Create database configuration for PostgreSQL connection
 */
export function createDatabaseConfig(): DatabaseConfig {
	const postgresUrl = process.env.POSTGRES_URL;
	if (!postgresUrl) {
		throw new Error("POSTGRES_URL environment variable is required");
	}
	return { connectionString: postgresUrl };
}
