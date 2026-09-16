import { DomainEvent } from "@shared/entities/domain-event.base";
import { ChannelType } from "../entities/enums/channel-type";

export class ChannelCreatedEvent extends DomainEvent {
  public readonly channelId: string;
  public readonly createdBy: string;
  public readonly type: ChannelType;

  constructor(channelId: string, createdBy: string, type: ChannelType) {
    super("COMMUNITY.CHANNEL_CREATED");
    this.channelId = channelId;
    this.createdBy = createdBy;
    this.type = type;
  }
}
