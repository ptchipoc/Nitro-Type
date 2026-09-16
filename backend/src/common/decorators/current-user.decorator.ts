import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface AuthUser {
  sub: string;
  email: string;
  role: string;
}

/**
 * @CurrentUser() — extrai o utilizador autenticado da request.
 * Requer @UseGuards(JwtAuthGuard) ou guard global.
 *
 * Uso:
 *   @Get('me')
 *   me(@CurrentUser() user: AuthUser) { return user; }
 */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => {
    const type = ctx.getType();
    if (type === "ws") {
      // console.log("ws:", ctx.switchToWs().getClient().user);
      return ctx.switchToWs().getClient().user;
    }
    // console.log("http", ctx.switchToHttp().getRequest().user);
    return ctx.switchToHttp().getRequest().user;
  },
);
