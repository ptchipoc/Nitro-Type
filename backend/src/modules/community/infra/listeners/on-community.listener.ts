import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ChannelCreatedEvent } from "../../domain/events/channel-created.event";
import { MemberAddedEvent } from "../../domain/events/member-added.event";
import { MemberRemovedEvent } from "../../domain/events/member-removed.event";
import { MemberBannedEvent } from "../../domain/events/member-banned.event";
import { MessageSentEvent } from "../../domain/events/message-sent.event";
import { InviteCreatedEvent } from "../../domain/events/invite-created.event";
import { ReactionAddedEvent } from "../../domain/events/reaction-added.event";
import { MessageRepository } from "@modules/community/domain/repository/message.repo";
import { MessageEntity } from "@modules/community/domain/entities/message.entity";
import { ChannelRepository } from "@modules/community/domain/repository/channel.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { CommunityNotificationEvent } from "@modules/notification/domain/events/community-notification.event";
import { MessageEditedEvent } from "../../domain/events/message-edited.event";
import { CommunityGateway } from "../../presentation/gateways/community.gateway";
import { DMConversationRepository } from "../../domain/repository/dm-conversation.repo";

@Injectable()
export class OnCommunityListener {
  private readonly logger = new Logger(OnCommunityListener.name);

  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly channelRepo: ChannelRepository,
    private readonly eventBus: EventBusPort,
    private readonly communityGateway: CommunityGateway,
    private readonly dmRepo: DMConversationRepository,
  ) {}

  @OnEvent("COMMUNITY.CHANNEL_CREATED")
  async handleChannelCreated(event: ChannelCreatedEvent): Promise<void> {
    this.logger.log(
      `[Event] CHANNEL_CREATED — channel: ${event.channelId} | creator: ${event.createdBy}`,
    );
    // Futuramente: notificações, audit logs, etc
  }

  @OnEvent("COMMUNITY.MEMBER_ADDED")
  async handleMemberAdded(event: MemberAddedEvent): Promise<void> {
    this.logger.log(
      `[Event] MEMBER_ADDED — channel: ${event.channelId} | user: ${event.userId}`,
    );

    // Criar mensagem SYSTEM no canal
    const msg = MessageEntity.createSystem(
      event.channelId,
      `${event.userId} entrou no canal`,
    );
    await this.messageRepo.save(msg);
  }

  @OnEvent("COMMUNITY.MEMBER_REMOVED")
  async handleMemberRemoved(event: MemberRemovedEvent): Promise<void> {
    this.logger.log(
      `[Event] MEMBER_REMOVED — channel: ${event.channelId} | user: ${event.userId}`,
    );

    if (event.notifyChannel) {
      const msg = MessageEntity.createSystem(
        event.channelId,
        `${event.userId} foi removido do canal`,
      );
      await this.messageRepo.save(msg);
    }
  }

  @OnEvent("COMMUNITY.MEMBER_BANNED")
  async handleMemberBanned(event: MemberBannedEvent): Promise<void> {
    this.logger.log(
      `[Event] MEMBER_BANNED — channel: ${event.channelId} | user: ${event.userId}`,
    );

    if (event.notifyChannel) {
      const msg = MessageEntity.createSystem(
        event.channelId,
        `${event.userId} foi banido do canal`,
      );
      await this.messageRepo.save(msg);
    }
  }

  @OnEvent("COMMUNITY.MESSAGE_SENT")
  async handleMessageSent(event: MessageSentEvent): Promise<void> {
    this.logger.log(
      `[Event] MESSAGE_SENT — message: ${event.messageId} | sender: ${event.senderId}`,
    );
    // Futuramente: notificações push, analytics, etc
  }

  @OnEvent("COMMUNITY.INVITE_CREATED")
  async handleInviteCreated(event: InviteCreatedEvent): Promise<void> {
    this.logger.log(
      `[Event] INVITE_CREATED — channel: ${event.channelId} | invited: ${event.invitedUserId}`,
    );

    const channel = await this.channelRepo.findById(event.channelId);
    if (!channel) return;

    await this.eventBus.publish([
      new CommunityNotificationEvent(
        event.invitedUserId,
        "CHANNEL_INVITE",
        event.channelId,
        channel.name,
        { code: event.code },
      ),
    ]);
  }

  @OnEvent("COMMUNITY.MESSAGE_EDITED")
  async handleMessageEdited(event: MessageEditedEvent): Promise<void> {
    this.logger.log(
      `[Event] MESSAGE_EDITED — message: ${event.messageId} | author: ${event.authorId}`,
    );

    if (event.channelId) {
      this.communityGateway.broadcastToChannel(event.channelId, "message:edited", {
        messageId: event.messageId,
        content: event.content,
        channelId: event.channelId,
      });
    } else if (event.dmId) {
      const dm = await this.dmRepo.findById(event.dmId);
      if (dm) {
        this.communityGateway.broadcastToDM(
          dm.participantAId,
          dm.participantBId,
          "message:edited",
          {
            messageId: event.messageId,
            content: event.content,
            dmId: event.dmId,
          },
        );
      }
    }
  }

  @OnEvent("COMMUNITY.REACTION_ADDED")
  async handleReactionAdded(event: ReactionAddedEvent): Promise<void> {
    this.logger.log(
      `[Event] REACTION_ADDED — message: ${event.messageId} | user: ${event.userId} | emoji: ${event.emoji}`,
    );
    // Futuramente: notificações ao autor da mensagem
  }
}
