import { DomainEvent } from "@shared/entities/domain-event.base";

export enum StateEventAction {
  ONLY_REGISTER = "ONLY_REGISTER",
  OTP = "OTP",
}

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly state: StateEventAction = StateEventAction.OTP,
  ) {
    super("AUTH.USER_REGISTERED");
  }
}
