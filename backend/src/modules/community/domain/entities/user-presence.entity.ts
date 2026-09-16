import { BaseEntity } from "@shared/entities/base.entity";
import { UserPresenceStatus } from "./enums/user-presence";
import { randomUUID } from "crypto";

export interface UserPresenceProps {
  id: string;
  userId: string;
  status: UserPresenceStatus;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class UserPresenceEntity extends BaseEntity {
  userId: string;
  status: UserPresenceStatus;
  lastSeenAt: Date;

  constructor(props: UserPresenceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.userId = props.userId;
    this.status = props.status;
    this.lastSeenAt = props.lastSeenAt;
  }

  static create(userId: string, status: UserPresenceStatus = UserPresenceStatus.ONLINE): UserPresenceEntity {
    const id = randomUUID();
    const now = new Date();
    
    return new UserPresenceEntity({
      id,
      userId,
      status,
      lastSeenAt: now,
      createdAt: now,
    });
  }

  static reconstitute(props: UserPresenceProps): UserPresenceEntity {
    return new UserPresenceEntity(props);
  }

  setStatus(newStatus: UserPresenceStatus): void {
    this.status = newStatus;
    this.lastSeenAt = new Date();
    this.touch();
  }

  setOnline(): void {
    this.setStatus(UserPresenceStatus.ONLINE);
  }

  setOffline(): void {
    this.setStatus(UserPresenceStatus.OFFLINE);
  }

  setIdle(): void {
    this.setStatus(UserPresenceStatus.IDLE);
  }

  publicData() {
    return {
      id: this.id,
      userId: this.userId,
      status: this.status,
      lastSeenAt: this.lastSeenAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
