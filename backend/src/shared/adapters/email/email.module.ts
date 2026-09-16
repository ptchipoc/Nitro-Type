import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailPort }    from './email.port';
import { ResendAdapter } from './resend.adapter';
import { SmtpAdapter }   from './smtp.adapter';

/**
 * EmailModule — selecciona o adapter via EMAIL_PROVIDER no .env.
 * "resend" → ResendAdapter | "smtp" → SmtpAdapter
 */
@Module({
  providers: [
    {
      provide:    EmailPort,
      inject:     [ConfigService],
      useFactory: (config: ConfigService) => {
        const provider = config.get<string>('email.provider') ?? 'resend';
        return provider === 'smtp' ? new SmtpAdapter(config) : new ResendAdapter(config);
      },
    },
  ],
  exports: [EmailPort],
})
export class EmailModule {}
