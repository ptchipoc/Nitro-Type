import { CredentialsSignin } from "next-auth";

export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: "invalid_credentials",
  EMAIL_NOT_VERIFIED: "email_not_verified",
} as const;

export class InvalidCredentialsError extends CredentialsSignin {
  code = AUTH_ERROR_CODES.INVALID_CREDENTIALS;
}

export class EmailNotVerifiedError extends CredentialsSignin {
  code = AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED;
}
