import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { EmailPort } from "@shared/adapters/email/email.port";
import { Job } from "bullmq";

export interface SendOtpJobData {
  email: string;
  name: string;
  code: string;
}

/**
 * SendOtpProcessor — processa jobs da fila 'auth'.
 * Envia o email com o código OTP de forma assíncrona.
 * BullMQ faz retry automático em caso de falha.
 */
@Processor("auth")
export class SendOtpProcessor extends WorkerHost {
  private readonly logger = new Logger(SendOtpProcessor.name);

  constructor(private readonly email: EmailPort) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case "send-otp":
        await this.handleSendOtp(job.data as SendOtpJobData);
        break;
      case "send-password-reset":
        await this.handleSendOtpResetPassword(job.data as SendOtpJobData);
        break;
      default:
        this.logger.warn(`[Auth/BullMQ] Job desconhecido: ${job.name}`);
    }
  }

  private async handleSendOtp(data: SendOtpJobData): Promise<void> {
    this.logger.log(`[Auth/BullMQ] Enviando OTP para ${data.email}`);

    await this.email.send({
      to: data.email,
      subject: "Transcender — Código de verificação",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Olá, ${data.name}!</h2>
          <p>O teu código de verificação é:</p>
          <div style="font-size: 48px; font-weight: bold; letter-spacing: 12px;
                      text-align: center; padding: 24px; background: #f4f4f4;
                      border-radius: 8px; margin: 24px 0;">
            ${data.code}
          </div>
          <p style="color: #666;">Este código expira em 5 minutos e só pode ser usado uma vez.</p>
          <p style="color: #999; font-size: 12px;">
            Se não criaste conta na Transcender, ignora este email.
          </p>
        </div>
      `,
    });

    this.logger.log(`[Auth/BullMQ] OTP enviado para ${data.email}`);
  }

  private async handleSendOtpResetPassword(
    data: SendOtpJobData,
  ): Promise<void> {
    this.logger.log(`[Auth/BullMQ] Enviando OTP para ${data.email}`);

    await this.email.send({
      to: data.email,
      subject: "NT — Código de recuperação de conta",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Olá, ${data.name}!</h2>
          <p>O teu código de recuperação é:</p>
          <div style="font-size: 48px; font-weight: bold; letter-spacing: 12px;
                      text-align: center; padding: 24px; background: #00ff15ff;
                      border-radius: 8px; margin: 24px 0;">
            ${data.code}
          </div>
          <p style="color: #666;">Este código expira em 5 minutos e só pode ser usado uma vez.</p>
          <p style="color: #999; font-size: 12px;">
            Se não criaste conta na NT, ignora este email.
          </p>
        </div>
      `,
    });

    this.logger.log(`[Auth/BullMQ] OTP enviado para ${data.email}`);
  }
}
