import { Response } from "express";
import { ConfigService } from "@nestjs/config";

export function getCookieOptions(config: ConfigService) {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  } as const;
}

/**
 * :warning: IMPORTANTE:
 * - SameSite=None REQUIRE Secure=true
 * - ngrok = cross-site → sameSite:none + secure:true
 * - produção same-domain → sameSite:lax ou strict
 */
export function setAuthCookies(
  res: Response,
  config: ConfigService,
  accessToken: string,
  refreshToken: string,
) {
  const baseOptions = getCookieOptions(config);

  res.cookie("access_token", accessToken, {
    ...baseOptions,
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refresh_token", refreshToken, {
    ...baseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });
}

export function clearAuthCookies(res: Response, config: ConfigService) {
  const baseOptions = getCookieOptions(config);

  res.clearCookie("access_token", baseOptions);
  res.clearCookie("refresh_token", baseOptions);
}
