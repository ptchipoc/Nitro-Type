import { DomainEvent } from "@shared/entities/domain-event.base";

export class OtpRequestedEvent extends DomainEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
    public readonly name: string,
    // public readonly type: VerificationType,
  ) {
    super("AUTH.OTP_REQUESTED");
  }
}
