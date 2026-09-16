import { DomainEvent } from '../../entities/domain-event.base';
export abstract class EventBusPort {
  abstract publish(events: DomainEvent[]): Promise<void>;
}
