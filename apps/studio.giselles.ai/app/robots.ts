import type { MetadataRoute } from "next";

const disallowedPaths: string[] = [
	"/join/",
	"/auth/callback/",
	"/auth/connect/",
	"/password_reset/confirm",
	"/webhooks/",
	"/api/giselle/",
	"/api/vector-stores/",
];

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				disallow: disallowedPaths,
			},
		],
	};
}
