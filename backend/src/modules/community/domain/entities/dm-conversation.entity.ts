import { BaseEntity } from "@shared/entities/base.entity";

export interface DMConversationProps {
  id: string;
  participantAId: string;
  participantBId: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class DMConversationEntity extends BaseEntity {
  participantAId: string;
  participantBId: string;
  lastMessageAt?: Date;

  constructor(props: DMConversationProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.participantAId = props.participantAId;
    this.participantBId = props.participantBId;
    this.lastMessageAt = props.lastMessageAt;
  }

  static create(data: Omit<DMConversationProps, "id" | "createdAt" | "updatedAt">): DMConversationEntity {
    const id = crypto.randomUUID?.() ?? "dm-" + Math.random().toString(36).substr(2, 9);
    const now = new Date();
    
    return new DMConversationEntity({
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: DMConversationProps): DMConversationEntity {
    return new DMConversationEntity(props);
  }

  updateLastMessageAt(): void {
    this.lastMessageAt = new Date();
    this.touch();
  }

  hasParticipant(userId: string): boolean {
    return this.participantAId === userId || this.participantBId === userId;
  }

  getOtherParticipant(userId: string): string | null {
    if (this.participantAId === userId) return this.participantBId;
    if (this.participantBId === userId) return this.participantAId;
    return null;
  }

  publicData() {
    return {
      id: this.id,
      participantAId: this.participantAId,
      participantBId: this.participantBId,
      lastMessageAt: this.lastMessageAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
