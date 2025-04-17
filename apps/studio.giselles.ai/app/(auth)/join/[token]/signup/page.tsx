import { teamInvitationViaEmailFlag } from "@/flags";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalConsent } from "../../../components/legal-consent";
import { fetchInvitationToken } from "../../utils/invitation-token";
import { redirectToErrorPage } from "../../utils/redirect-to-error-page";
import { SignupForm } from "./form";

export default async function Page({ params }: { params: { token: string } }) {
	const isTeamInvitationViaEmail = await teamInvitationViaEmailFlag();
	if (!isTeamInvitationViaEmail) {
		return notFound();
	}

	const token = await fetchInvitationToken(params.token);
	if (!token) {
		return notFound();
	}
	if (token.expiredAt < new Date()) {
		redirectToErrorPage("expired");
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4 gap-16">
			<div className="flex items-center justify-center py-12">
				<div className="mx-auto grid w-[350px] gap-[24px]">
					<div className="text-center">
						<p className="text-white-400 mb-2">You have been invited to join</p>
						<h2
							className="text-[28px] font-[500] text-primary-100 font-hubot"
							style={{ textShadow: "0px 0px 20px #0087F6" }}
						>
							{token.teamName}
						</h2>
					</div>
					<div className="grid gap-[16px]">
						<SignupForm email={token.invitedEmail} />

						<div className="text-center text-sm text-slate-400">
							Already have a Giselle account?{" "}
							<Link
								href={`/join/${params.token}/login`}
								className="text-blue-300 hover:underline"
							>
								Log in
							</Link>
						</div>

						<LegalConsent />
						<div className="flex justify-center mt-4">
							<Link
								href="#"
								className="text-white hover:text-white/80 underline"
							>
								Decline
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
