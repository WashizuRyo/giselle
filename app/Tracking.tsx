"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export function Tracking(): null {
	if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "true") {
		return null;
	}
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const posthog = usePostHog();
	useEffect(() => {
		if (pathname && posthog) {
			let url = window.origin + pathname;
			if (searchParams.toString()) {
				url = `${url}?${searchParams.toString()}`;
			}
			posthog.capture("$pageview", {
				$current_url: url,
			});
		}
	}, [pathname, searchParams, posthog]);

	return null;
}
