import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { TokenPort } from "@shared/adapters/token/token.port";

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly token: TokenPort) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();

    const cookies = client.handshake.headers.cookie;

    if (!cookies) {
      console.log("Sem cookies");
      throw new UnauthorizedException("Sem cookies");
    }

    const accessToken = this.extractTokenFromCookies(cookies);

    if (!accessToken) {
      console.log("Token não encontrado");
      throw new UnauthorizedException("Token não encontrado");
    }

    try {
      const payload = this.token.verifyAccess(accessToken);
      client.user = payload;

      return true;
    } catch {
      console.log("Token inválido");
      throw new UnauthorizedException("Token inválido");
    }
  }

  private extractTokenFromCookies(cookieHeader: string): string | null {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, v] = c.trim().split("=");
        return [k, v];
      }),
    );

    return cookies["access_token"] ?? null;
  }
}
