import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * WebhookSignatureGuard — valida assinatura HMAC do webhook.
 * Header esperado: x-signature: sha256=<hmac_hex>
 * Usa timingSafeEqual para prevenir timing attacks.
 */
@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  private readonly logger = new Logger(WebhookSignatureGuard.name);
  constructor(private readonly config: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req       = ctx.switchToHttp().getRequest<Request>();
    const signature = req.headers['x-signature'] as string;
    const rawBody   = (req as any).rawBody as Buffer;

    if (!signature) throw new UnauthorizedException('Assinatura em falta');
    if (!rawBody)   throw new UnauthorizedException('rawBody não disponível');

    const secret   = this.config.get<string>('webhook.secret') ?? '';
    const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex');

    try {
      const a = Buffer.from(signature, 'utf8');
      const b = Buffer.from(expected,  'utf8');
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        this.logger.warn('[Webhook] Assinatura inválida');
        throw new UnauthorizedException('Assinatura inválida');
      }
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Erro ao validar assinatura');
    }
    return true;
  }
}
