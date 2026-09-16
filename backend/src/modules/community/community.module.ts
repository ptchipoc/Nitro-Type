import { Module } from "@nestjs/common";
import { ChannelRepository } from "./domain/repository/channel.repo";
import { ChannelMemberRepository } from "./domain/repository/channel-member.repo";
import { MessageRepository } from "./domain/repository/message.repo";
import { DMConversationRepository } from "./domain/repository/dm-conversation.repo";
import { ChannelInviteRepository } from "./domain/repository/channel-invite.repo";
import { UserPresenceRepository } from "./domain/repository/user-presence.repo";
import { PrismaChannelRepository } from "./infra/repo/prisma-channel.repo";
import { PrismaChannelMemberRepository } from "./infra/repo/prisma-channel-member.repo";
import { PrismaMessageRepository } from "./infra/repo/prisma-message.repo";
import { PrismaDMConversationRepository } from "./infra/repo/prisma-dm-conversation.repo";
import { PrismaChannelInviteRepository } from "./infra/repo/prisma-channel-invite.repo";
import { PrismaUserPresenceRepository } from "./infra/repo/prisma-user-presence.repo";
import { CommunityService } from "./app/services/community.service";
import { ChannelsController } from "./presentation/controllers/channels.controller";
import { MessagesController } from "./presentation/controllers/messages.controller";
import { MembersController } from "./presentation/controllers/members.controller";
import { DMsController } from "./presentation/controllers/dms.controller";
import { InvitesController } from "./presentation/controllers/invites.controller";
import { OnCommunityListener } from "./infra/listeners/on-community.listener";
import { CommunityGateway } from "./presentation/gateways/community.gateway";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { EventBusAdapter } from "@shared/adapters/event-bus/event-bus.adapter";
import { UserModule } from "@modules/user/user.module";
import {
  CreateChannelUseCase,
  GetChannelsUseCase,
  GetChannelByIdUseCase,
  EditChannelUseCase,
  RemoveChannelUseCase,
  AddMemberUseCase,
  RemoveMemberUseCase,
  BanMemberUseCase,
  UpdateMemberRoleUseCase,
  SendMessageUseCase,
  GetChannelMessagesUseCase,
  EditMessageUseCase,
  DeleteMessageUseCase,
  AddReactionUseCase,
  RemoveReactionUseCase,
  SendDMUseCase,
  GetDMConversationsUseCase,
  GetDMMessagesUseCase,
  OpenOrCreateDMUseCase,
  InviteToChannelUseCase,
  AcceptInviteUseCase,
  GetMyInvitesUseCase,
  UpdatePresenceUseCase,
  GetPresenceUseCase,
} from "./app/use-cases";
import { CreateChannelSeedUseCase } from "./app/use-cases/create-channel-seed.use-case";
import { AddMemberPublicChannelUseCase } from "./app/use-cases/add-member-public-channel.use-case copy";

@Module({
  controllers: [
    ChannelsController,
    MessagesController,
    MembersController,
    DMsController,
    InvitesController,
  ],
  providers: [
    // Repositories
    { provide: ChannelRepository, useClass: PrismaChannelRepository },
    {
      provide: ChannelMemberRepository,
      useClass: PrismaChannelMemberRepository,
    },
    { provide: MessageRepository, useClass: PrismaMessageRepository },
    {
      provide: DMConversationRepository,
      useClass: PrismaDMConversationRepository,
    },
    {
      provide: ChannelInviteRepository,
      useClass: PrismaChannelInviteRepository,
    },
    { provide: UserPresenceRepository, useClass: PrismaUserPresenceRepository },

    // Use Cases - Channels
    CreateChannelUseCase,
    GetChannelsUseCase,
    GetChannelByIdUseCase,
    EditChannelUseCase,
    RemoveChannelUseCase,
    CreateChannelSeedUseCase,
    AddMemberPublicChannelUseCase,

    // Use Cases - Members
    AddMemberUseCase,
    RemoveMemberUseCase,
    BanMemberUseCase,
    UpdateMemberRoleUseCase,

    // Use Cases - Messages
    SendMessageUseCase,
    GetChannelMessagesUseCase,
    EditMessageUseCase,
    DeleteMessageUseCase,

    // Use Cases - Reactions
    AddReactionUseCase,
    RemoveReactionUseCase,

    // Use Cases - DMs
    SendDMUseCase,
    GetDMConversationsUseCase,
    GetDMMessagesUseCase,
    OpenOrCreateDMUseCase,

    // Use Cases - Invites
    InviteToChannelUseCase,
    AcceptInviteUseCase,
    GetMyInvitesUseCase,

    // Use Cases - Presence
    UpdatePresenceUseCase,
    GetPresenceUseCase,

    // Service
    CommunityService,

    // Gateways
    CommunityGateway,

    // Listeners
    OnCommunityListener,
  ],
  exports: [CommunityService],
})
export class CommunityModule {}
