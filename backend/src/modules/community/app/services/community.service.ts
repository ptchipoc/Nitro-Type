import { Injectable, Logger } from "@nestjs/common";
import { ChannelRepository } from "../../domain/repository/channel.repo";
import { CreateChannelInput } from "../../presentation/inputs/create-channel.input";
import { EditChannelInput } from "../../presentation/inputs/edit-channel.input";
import { SendMessageInput } from "../../presentation/inputs/send-message.input";
import { SendDMInput } from "../../presentation/inputs/send-dm.input";
import { AddMemberInput } from "../../presentation/inputs/add-member.input";
import { RemoveMemberInput } from "../../presentation/inputs/remove-member.input";
import { BanMemberInput } from "../../presentation/inputs/ban-member.input";
import { InviteToChannelInput } from "../../presentation/inputs/invite-to-channel.input";
import { UpdateMemberRoleInput } from "../../presentation/inputs/update-member-role.input";
import { AddReactionInput } from "../../presentation/inputs/add-reaction.input";
import { EditMessageInput } from "../../presentation/inputs/edit-message.input";
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
} from "../use-cases";
import { CreateChannelSeedUseCase } from "../use-cases/create-channel-seed.use-case";
import { AddMemberPublicChannelUseCase } from "../use-cases/add-member-public-channel.use-case copy";

/**
 * CommunityService
 *
 * Service principal que orquestra todos os use cases da comunidade.
 * Cada método é um wrapper que delega a um use case específico.
 *
 * Padrão: Clean Architecture / DDD
 */
@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);

  constructor(
    // Channels
    private readonly createChannelUseCase: CreateChannelUseCase,
    private readonly getChannelsUseCase: GetChannelsUseCase,
    private readonly getChannelByIdUseCase: GetChannelByIdUseCase,
    private readonly editChannelUseCase: EditChannelUseCase,
    private readonly removeChannelUseCase: RemoveChannelUseCase,
    private readonly addmemberChannelPublicUseCase: AddMemberPublicChannelUseCase,

    // Members
    private readonly addMemberUseCase: AddMemberUseCase,
    private readonly removeMemberUseCase: RemoveMemberUseCase,
    private readonly banMemberUseCase: BanMemberUseCase,
    private readonly updateMemberRoleUseCase: UpdateMemberRoleUseCase,

    // Messages
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly getChannelMessagesUseCase: GetChannelMessagesUseCase,
    private readonly editMessageUseCase: EditMessageUseCase,
    private readonly deleteMessageUseCase: DeleteMessageUseCase,

    // Reactions
    private readonly addReactionUseCase: AddReactionUseCase,
    private readonly removeReactionUseCase: RemoveReactionUseCase,

    // DMs
    private readonly sendDMUseCase: SendDMUseCase,
    private readonly getDMConversationsUseCase: GetDMConversationsUseCase,
    private readonly getDMMessagesUseCase: GetDMMessagesUseCase,
    private readonly openOrCreateDMUseCase: OpenOrCreateDMUseCase,

    // Invites
    private readonly inviteToChannelUseCase: InviteToChannelUseCase,
    private readonly acceptInviteUseCase: AcceptInviteUseCase,
    private readonly getMyInvitesUseCase: GetMyInvitesUseCase,

    // Presence
    private readonly updatePresenceUseCase: UpdatePresenceUseCase,
    private readonly getPresenceUseCase: GetPresenceUseCase,

    // Repositories (apenas para helpers/seed)
    private readonly channelRepo: ChannelRepository,

    private readonly createChannelSeedUseCase: CreateChannelSeedUseCase,
  ) {}

  // ─── CANAIS ─────────────────────────────────────────────────────────

  async createChannel(input: CreateChannelInput, creatorId: string) {
    return this.createChannelUseCase.execute(input, creatorId);
  }

  async getChannels(userId: string) {
    return this.getChannelsUseCase.execute(userId);
  }

  async getChannelById(channelId: string) {
    return this.getChannelByIdUseCase.execute(channelId);
  }

  async editChannel(
    channelId: string,
    input: EditChannelInput,
    executorId: string,
  ) {
    return this.editChannelUseCase.execute(channelId, input, executorId);
  }

  async removeChannel(channelId: string, executorId: string) {
    return this.removeChannelUseCase.execute(channelId, executorId);
  }

  // ─── MEMBROS ────────────────────────────────────────────────────────

  async addMemberInPulbicChannel(userId: string) {
    return this.addmemberChannelPublicUseCase.execute(userId);
  }

  async addMember(input: AddMemberInput, executorId: string) {
    return this.addMemberUseCase.execute(input, executorId);
  }

  async removeMember(input: RemoveMemberInput, executorId: string) {
    return this.removeMemberUseCase.execute(input, executorId);
  }

  async banMember(input: BanMemberInput, executorId: string) {
    return this.banMemberUseCase.execute(input, executorId);
  }

  async updateMemberRole(input: UpdateMemberRoleInput, executorId: string) {
    return this.updateMemberRoleUseCase.execute(input, executorId);
  }

  // ─── MENSAGENS ───────────────────────────────────────────────────────

  async sendMessage(
    input: SendMessageInput,
    channelId: string,
    senderId: string,
  ) {
    return this.sendMessageUseCase.execute(input, channelId, senderId);
  }

  async getChannelMessages(channelId: string, userId: string, limit = 50) {
    return this.getChannelMessagesUseCase.execute(channelId, userId, limit);
  }

  async editMessage(input: EditMessageInput, userId: string) {
    return this.editMessageUseCase.execute(input, userId);
  }

  async deleteMessage(messageId: string, userId: string) {
    return this.deleteMessageUseCase.execute(messageId, userId);
  }

  // ─── REAÇÕES ─────────────────────────────────────────────────────────

  async addReaction(input: AddReactionInput, userId: string) {
    return this.addReactionUseCase.execute(input, userId);
  }

  async removeReaction(messageId: string, emoji: string, userId: string) {
    return this.removeReactionUseCase.execute(messageId, emoji, userId);
  }

  // ─── DMs ─────────────────────────────────────────────────────────────

  async sendDM(input: SendDMInput, senderId: string) {
    return this.sendDMUseCase.execute(input, senderId);
  }

  async getDMConversations(userId: string) {
    return this.getDMConversationsUseCase.execute(userId);
  }

  async getDMMessages(dmId: string, userId: string, limit = 50) {
    return this.getDMMessagesUseCase.execute(dmId, userId, limit);
  }

  async openOrCreateDM(userId: string, participantId: string) {
    return this.openOrCreateDMUseCase.execute(userId, participantId);
  }

  // ─── CONVITES ────────────────────────────────────────────────────────

  async inviteToChannel(
    input: InviteToChannelInput,
    channelId: string,
    invitedBy: string,
  ) {
    return this.inviteToChannelUseCase.execute(input, channelId, invitedBy);
  }

  async acceptInvite(code: string, userId: string) {
    return this.acceptInviteUseCase.execute(code, userId);
  }

  async getMyInvites(userId: string) {
    return this.getMyInvitesUseCase.execute(userId);
  }

  // ─── PRESENÇA ────────────────────────────────────────────────────────

  async updatePresence(userId: string, status: string) {
    return this.updatePresenceUseCase.execute(userId, status);
  }

  async getPresence(userId: string) {
    return this.getPresenceUseCase.execute(userId);
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────

  async seedChannels() {
    await this.createChannelSeedUseCase.execute();
  }
}
