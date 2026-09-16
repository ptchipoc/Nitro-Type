import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { IS_OPTIONAL_KEY } from "@common/decorators/optional.decorator";
import { TokenPort } from "../../shared/adapters/token/token.port";
import { ConfigService } from "@nestjs/config";
import { setAuthCookies } from "@modules/auth/app/helpers/cookie.helper";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly token: TokenPort,
    private readonly config: ConfigService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    // Ignora contextos não-HTTP (ex: WebSocket) — usar WsJwtGuard para WS
    if (ctx.getType() !== "http") return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const isOptional = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    const req = ctx.switchToHttp().getRequest<Request>();
    const res = ctx.switchToHttp().getResponse<Response>();
    const accessToken = this.extractAccessToken(req);

    if (accessToken) {
      try {
        const payload = this.token.verifyAccess(accessToken);
        // @ts-ignore
        req["user"] = payload;
        return true;
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          this.logger.debug(
            `[Auth] Access token expirado — tenta refresh | ${req.method} ${req.url}`,
          );
        } else {
          this.logger.warn(
            `[Auth] Token inválido (${err instanceof JsonWebTokenError ? err.message : "erro desconhecido"}) — ${req.method} ${req.url}`,
          );
          throw new UnauthorizedException("Token inválido.");
        }
      }
    }

    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      if (isOptional) return true;
      this.logger.warn(`[Auth] Sem tokens — ${req.method} ${req.url}`);
      throw new UnauthorizedException("Sessão expirada. Faz login novamente.");
    }

    try {
      const refreshPayload = this.token.verifyRefresh(refreshToken);

      // TODO: [WHITELIST] Verificar se o refresh token ainda está ativo:
      // const stored = await this.redis.get(`wl:rt:${refreshPayload.sub}`)
      // if (stored !== refreshToken) throw new UnauthorizedException("Sessão inválida.")

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        this.token.generatePair({
          sub: refreshPayload.sub,
          email: refreshPayload.email,
          role: refreshPayload.role,
        });

      // TODO: [WHITELIST] Atualizar o refresh token ativo no Redis:
      // await this.redis.set(`wl:rt:${refreshPayload.sub}`, newRefreshToken, "EX", 7 * 24 * 3600)

      setAuthCookies(res, this.config, newAccessToken, newRefreshToken);

      // Sinaliza ao client que os tokens foram renovados
      res.setHeader("X-Token-Refreshed", "true");
      // @ts-ignore
      req["user"] = refreshPayload;

      this.logger.log(
        `[Auth] Tokens renovados para user ${refreshPayload.sub} — ${req.method} ${req.url}`,
      );
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;

      this.logger.warn(
        `[Auth] Refresh token inválido/expirado — ${req.method} ${req.url}`,
      );
      throw new UnauthorizedException("Sessão expirada. Faz login novamente.");
    }
  }

  private extractAccessToken(req: Request): string | null {
    const token = req.cookies?.access_token;
    if (token) return token;
    const auth = req.headers.authorization ?? "";
    return auth.startsWith("Bearer ") ? auth.slice(7) : null;
  }
}
