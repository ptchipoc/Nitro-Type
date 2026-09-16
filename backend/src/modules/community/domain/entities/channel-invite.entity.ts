import { ConflictException } from "@nestjs/common";
import { BaseEntity } from "@shared/entities/base.entity";
import { InviteStatus } from "./enums/invite-status";

export interface ChannelInviteProps {
  id: string;
  channelId: string;
  invitedBy: string;
  invitedUserId: string;
  code: string;
  status: InviteStatus;
  expiresAt?: Date;
  channelName?: string; // Adicionado
  createdAt: Date;
  updatedAt?: Date;
}

interface CreateChannelInviteInput {
  channelId: string;
  invitedBy: string;
  invitedUserId: string;
  expiresAt?: Date;
  channelName?: string;
}

export class ChannelInviteEntity extends BaseEntity {
  channelId: string;
  invitedBy: string;
  invitedUserId: string;
  code: string;
  status: InviteStatus;
  expiresAt?: Date;
  channelName?: string; // Adicionado

  private constructor(props: ChannelInviteProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.channelId = props.channelId;
    this.invitedBy = props.invitedBy;
    this.invitedUserId = props.invitedUserId;
    this.code = props.code;
    this.status = props.status;
    this.expiresAt = props.expiresAt;
    this.channelName = props.channelName;
  }

  static create(input: CreateChannelInviteInput): ChannelInviteEntity {
    const code = this.generateCode();
    return new ChannelInviteEntity({
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : "inv-" + Math.random().toString(36).substr(2, 9),
      code,
      status: InviteStatus.PENDING,
      createdAt: new Date(),
      ...input,
    });
  }

  static reconstitute(props: ChannelInviteProps): ChannelInviteEntity {
    return new ChannelInviteEntity(props);
  }

  private static generateCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  accept(): void {
    if (this.isExpired()) {
      throw new ConflictException("Convite expirado");
    }
    this.status = InviteStatus.ACCEPTED;
    this.touch();
  }

  reject(): void {
    this.status = InviteStatus.REJECTED;
    this.touch();
  }

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  isPending(): boolean {
    return this.status === InviteStatus.PENDING && !this.isExpired();
  }

  publicData() {
    return {
      id: this.id,
      channelId: this.channelId,
      code: this.code,
      status: this.status,
      expiresAt: this.expiresAt,
      channelName: this.channelName,
      createdAt: this.createdAt,
    };
  }
}
