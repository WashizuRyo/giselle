"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TriangleAlertIcon } from "lucide-react";
import { useState } from "react";

interface LoginFormProps {
	email: string;
}

export const LoginForm = (props: LoginFormProps) => {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [joining, setJoining] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setJoining(true);
		setError(null);

		// In actual implementation, call the team join API here
		setTimeout(() => {
			alert("Join team functionality would be implemented here");
			setJoining(false);
		}, 500);
	};

	return (
		<form onSubmit={handleSubmit} className="font-hubot">
			<div className="grid gap-6">
				{error && (
					<Alert variant="destructive">
						<TriangleAlertIcon className="w-4 h-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<div className="grid gap-[16px]">
					<div className="grid gap-[4px]">
						<div className="grid gap-[4px] relative">
							<Label
								htmlFor="email"
								className="text-[14px] font-hubot text-black-70"
							>
								Email
							</Label>
							<Input
								id="email"
								type="email"
								value={props.email}
								required
								readOnly
								className="text-white-400 bg-transparent py-[12px] px-0 read-only:border-none read-only:focus:outline-none read-only:focus:ring-0"
							/>
						</div>
					</div>

					<div className="grid gap-[4px]">
						<div className="grid gap-[4px] relative">
							<Label
								htmlFor="password"
								className="text-[14px] font-hubot text-black-70"
							>
								Password
							</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</div>

					<Button
						className="w-full font-medium"
						type="submit"
						disabled={joining}
						data-loading={joining}
					>
						{joining ? "Joining..." : "Join to team"}
					</Button>
				</div>
			</div>
		</form>
	);
};
