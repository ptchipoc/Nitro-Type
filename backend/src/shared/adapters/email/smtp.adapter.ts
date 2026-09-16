import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailPort, SendEmailOptions } from './email.port';

/**
 * SmtpAdapter — implementação via SMTP (nodemailer).
 * Activa em .env: EMAIL_PROVIDER=smtp
 */
@Injectable()
export class SmtpAdapter extends EmailPort {
  private readonly logger      = new Logger(SmtpAdapter.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from:        string;

  constructor(private readonly config: ConfigService) {
    super();
    this.from        = config.get<string>('email.from') ?? 'noreply@transcender.app';
    this.transporter = nodemailer.createTransport({
      host: config.get<string>('email.smtp.host'),
      port: config.get<number>('email.smtp.port') ?? 587,
      auth: {
        user: config.get<string>('email.smtp.user'),
        pass: config.get<string>('email.smtp.pass'),
      },
    });
  }

  async send(opts: SendEmailOptions): Promise<void> {
    this.logger.debug(`[Email/SMTP] Enviando para ${opts.to}`);
    await this.transporter.sendMail({ from: this.from, to: opts.to, subject: opts.subject, html: opts.html });
    this.logger.debug(`[Email/SMTP] Enviado para ${opts.to}`);
  }
}
