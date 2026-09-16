export abstract class DomainEvent {
  public readonly baseEventName: string;
  public readonly occurredAt: Date;
  constructor(baseEventName: string) {
    this.baseEventName = baseEventName;
    this.occurredAt = new Date();
  }
}
