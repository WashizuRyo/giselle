import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { GitHubAuthentication } from "../github-authentication";
import { GoogleAuthentication } from "../google-authentication";

export default function AccountAuthenticationPage() {
	return (
		<div className="flex flex-col gap-[24px]">
			<div className="flex flex-col gap-y-2">
				<h3
					className="text-primary-100 font-semibold text-[28px] leading-[28px] tracking-[-0.011em] font-hubot"
					style={{ textShadow: "0px 0px 20px hsla(207, 100%, 48%, 1)" }}
				>
					Authentication
				</h3>
				<p className="text-black-400 font-medium text-[12px] leading-[20.4px] tracking-normal font-geist">
					Connect your Giselle Account with a third-party service to use it for
					login.
				</p>
			</div>
			<div className="flex flex-col gap-y-4">
				<Suspense
					fallback={
						<Skeleton className="rounded-md border border-black-70 w-full h-16" />
					}
				>
					<GoogleAuthentication />
				</Suspense>
				<Suspense
					fallback={
						<Skeleton className="rounded-md border border-black-70 w-full h-16" />
					}
				>
					<GitHubAuthentication />
				</Suspense>
			</div>
		</div>
	);
}
