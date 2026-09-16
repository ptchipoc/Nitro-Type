import { Global, Module } from "@nestjs/common";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { EventBusAdapter } from "@shared/adapters/event-bus/event-bus.adapter";

@Global()
@Module({
  providers: [{ provide: EventBusPort, useClass: EventBusAdapter }],
  exports: [EventBusPort],
})
export class EventBusModule {}
