import { BaseEntity } from "@shared/entities/base.entity";
import { MessageType } from "./enums/message-type";
import { authorInfo } from "./auth-info.entity";

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface MessageProps {
  id: string;
  channelId?: string;
  dmId?: string;
  authorId: string;
  author: authorInfo | null;
  content: string;
  type: MessageType;
  reactions: MessageReaction[];
  mentions: string[];
  attachmentIds: string[];
  replyToId?: string;
  edited: boolean;
  editedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

interface CreateMessageInput {
  channelId?: string;
  dmId?: string;
  authorId: string;
  content: string;
  type?: MessageType;
  mentions?: string[];
  attachmentIds?: string[];
  replyToId?: string;
}

export class MessageEntity extends BaseEntity {
  channelId?: string;
  dmId?: string;
  authorId: string;
  content: string;
  type: MessageType;
  reactions: MessageReaction[];
  mentions: string[];
  attachmentIds: string[];
  replyToId?: string;
  edited: boolean;
  editedAt?: Date;
  deletedAt?: Date;
  author: authorInfo | null;

  constructor(props: MessageProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.channelId = props.channelId;
    this.dmId = props.dmId;
    this.authorId = props.authorId;
    this.content = props.content;
    this.type = props.type;
    this.reactions = props.reactions;
    this.mentions = props.mentions;
    this.attachmentIds = props.attachmentIds;
    this.replyToId = props.replyToId;
    this.edited = props.edited;
    this.editedAt = props.editedAt;
    this.deletedAt = props.deletedAt;
    this.author = props.author;
  }

  static create(input: CreateMessageInput): MessageEntity {
    const id = crypto.randomUUID?.() ?? "msg-" + Math.random().toString(36).substr(2, 9);
    const now = new Date();
    
    return new MessageEntity({
      id,
      channelId: input.channelId,
      dmId: input.dmId,
      authorId: input.authorId,
      content: input.content,
      type: input.type ?? MessageType.TEXT,
      reactions: [],
      mentions: input.mentions ?? [],
      attachmentIds: input.attachmentIds ?? [],
      replyToId: input.replyToId,
      edited: false,
      author: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static createSystem(channelId: string, content: string): MessageEntity {
    const id = crypto.randomUUID?.() ?? "msg-" + Math.random().toString(36).substr(2, 9);
    const now = new Date();
    
    return new MessageEntity({
      id,
      channelId,
      authorId: "system",
      content,
      type: MessageType.SYSTEM,
      reactions: [],
      mentions: [],
      attachmentIds: [],
      edited: false,
      createdAt: now,
      updatedAt: now,
      author: null,
    });
  }

  static reconstitute(props: MessageProps): MessageEntity {
    return new MessageEntity(props);
  }

  edit(newContent: string, mentions: string[] = []): void {
    this.content = newContent;
    this.mentions = mentions;
    this.edited = true;
    this.editedAt = new Date();
    this.touch();
  }

  delete(): void {
    this.deletedAt = new Date();
    this.touch();
  }

  addReaction(emoji: string, userId: string): void {
    const reaction = this.reactions.find(r => r.emoji === emoji);
    if (reaction) {
      if (!reaction.userIds.includes(userId)) {
        reaction.userIds.push(userId);
        reaction.count++;
      }
    } else {
      this.reactions.push({
        emoji,
        count: 1,
        userIds: [userId],
      });
    }
    this.touch();
  }

  removeReaction(emoji: string, userId: string): void {
    const reaction = this.reactions.find(r => r.emoji === emoji);
    if (reaction) {
      reaction.userIds = reaction.userIds.filter(id => id !== userId);
      reaction.count--;
      if (reaction.count === 0) {
        this.reactions = this.reactions.filter(r => r.emoji !== emoji);
      }
    }
    this.touch();
  }

  toggleReaction(emoji: string, userId: string): void {
    const reaction = this.reactions.find(r => r.emoji === emoji);
    if (reaction?.userIds.includes(userId)) {
      this.removeReaction(emoji, userId);
    } else {
      this.addReaction(emoji, userId);
    }
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  publicData(userIdForReaction?: string) {
    return {
      id: this.id,
      channelId: this.channelId,
      dmId: this.dmId,
      authorId: this.authorId,
      content: this.content,
      type: this.type,
      reactions: this.reactions.map(r => ({
        emoji: r.emoji,
        count: r.count,
        reacted: userIdForReaction ? r.userIds.includes(userIdForReaction) : false,
      })),
      mentions: this.mentions,
      author: this.author,
      attachmentIds: this.attachmentIds,
      replyToId: this.replyToId,
      edited: this.edited,
      editedAt: this.editedAt,
      deletedAt: this.deletedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
