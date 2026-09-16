import { OnEvent } from "@nestjs/event-emitter";
import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PasswordResetRequestedEvent } from "@modules/auth/domain/events/password-reset-requested.event";

@Injectable()
export class PasswordResetRequestedListener {
  private readonly logger = new Logger(PasswordResetRequestedListener.name);

  constructor(@InjectQueue("auth") private readonly authQueue: Queue) {}

  @OnEvent("AUTH.PASSWORD_RESET_REQUESTED")
  async handle(event: PasswordResetRequestedEvent): Promise<void> {
    this.logger.log(`[Event] PASSWORD_RESET_REQUESTED — ${event.email}`);

    await this.authQueue.add(
      "send-password-reset",
      {
        email: event.email,
        name: event.name,
        code: event.code,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
      },
    );
    this.logger.log(`[Event] PASSWORD_RESET_REQUESTED — adiciona na fila`);
  }
}
