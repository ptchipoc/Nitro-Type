import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EventBusPort } from "./event-bus.port";
import { DomainEvent } from "../../entities/domain-event.base";

@Injectable()
export class EventBusAdapter extends EventBusPort {
  private readonly logger = new Logger(EventBusAdapter.name);
  constructor(private readonly emitter: EventEmitter2) {
    super();
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const e of events) {
      this.logger.debug(`[EventBus] → ${e.baseEventName}`);
      this.emitter.emit(e.baseEventName, e);
    }
  }
}
