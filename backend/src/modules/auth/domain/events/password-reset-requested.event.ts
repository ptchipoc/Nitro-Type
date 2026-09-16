import { DomainEvent } from "@shared/entities/domain-event.base";

export class PasswordResetRequestedEvent extends DomainEvent {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly code: string,
  ) {
    super("AUTH.PASSWORD_RESET_REQUESTED");
  }
}
