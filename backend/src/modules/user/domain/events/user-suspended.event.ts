import { DomainEvent } from "@shared/entities/domain-event.base";

export class UserSuspendedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly reason?: string,
  ) {
    super("user.suspended");
  }
}
