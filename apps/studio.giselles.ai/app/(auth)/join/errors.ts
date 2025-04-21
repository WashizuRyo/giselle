export type ErrorCode = "expired" | "wrong_email" | "already_member";

export class JoinError extends Error {
	code: ErrorCode;
	constructor(code: ErrorCode, message?: string) {
		super(message ?? code);
		this.code = code;
	}
}
