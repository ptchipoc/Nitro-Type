export interface SendEmailOptions {
  to:      string;
  subject: string;
  html:    string;
}

/** EmailPort — contrato genérico. Troca de Resend para SMTP sem tocar no domínio. */
export abstract class EmailPort {
  abstract send(options: SendEmailOptions): Promise<void>;
}
