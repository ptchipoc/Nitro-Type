import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailPort, SendEmailOptions } from './email.port';

/**
 * ResendAdapter — implementação via Resend API.
 * Activa em .env: EMAIL_PROVIDER=resend
 */
@Injectable()
export class ResendAdapter extends EmailPort {
  private readonly logger = new Logger(ResendAdapter.name);
  private readonly client: Resend;
  private readonly from:   string;

  constructor(private readonly config: ConfigService) {
    super();
    this.client = new Resend(config.get<string>('email.resendApiKey'));
    this.from   = config.get<string>('email.from') ?? 'noreply@transcender.app';
  }

  async send(opts: SendEmailOptions): Promise<void> {
    this.logger.debug(`[Email/Resend] Enviando para ${opts.to} — ${opts.subject}`);
    await this.client.emails.send({ from: this.from, to: opts.to, subject: opts.subject, html: opts.html });
    this.logger.debug(`[Email/Resend] Enviado para ${opts.to}`);
  }
}
