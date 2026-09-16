import { BaseEntity } from "@shared/entities/base.entity";
import { MemberRole } from "./enums/member-role";
import { ForbiddenException } from "@nestjs/common";

export interface MemberPermissions {
  canSendMessages: boolean;
  canAddMembers: boolean;
  canRemoveMembers: boolean;
  canBanMembers: boolean;
  canManageChannel: boolean;
  canManageRoles: boolean;
}

export const DEFAULT_PERMISSIONS: Record<MemberRole, MemberPermissions> = {
  [MemberRole.MASTER_ADMIN]: {
    canSendMessages: true,
    canAddMembers: true,
    canRemoveMembers: true,
    canBanMembers: true,
    canManageChannel: true,
    canManageRoles: true,
  },
  [MemberRole.GROUP_OWNER]: {
    canSendMessages: true,
    canAddMembers: true,
    canRemoveMembers: true,
    canBanMembers: true,
    canManageChannel: true,
    canManageRoles: true,
  },
  [MemberRole.GROUP_ADMIN]: {
    canSendMessages: true,
    canAddMembers: true,
    canRemoveMembers: true,
    canBanMembers: true,
    canManageChannel: false,
    canManageRoles: false,
  },
  [MemberRole.GROUP_MEMBER]: {
    canSendMessages: true,
    canAddMembers: false,
    canRemoveMembers: false,
    canBanMembers: false,
    canManageChannel: false,
    canManageRoles: false,
  },
  [MemberRole.GROUP_VIEWER]: {
    canSendMessages: false,
    canAddMembers: false,
    canRemoveMembers: false,
    canBanMembers: false,
    canManageChannel: false,
    canManageRoles: false,
  },
};

export interface ChannelMemberProps {
  id: string;
  channelId: string;
  userId: string;
  role: MemberRole;
  permissions: MemberPermissions;
  isBanned: boolean;
  bannedAt?: Date;
  joinedAt: Date;
  createdAt: Date;
  updatedAt?: Date;
}

interface CreateChannelMemberInput {
  channelId: string;
  userId: string;
  role: MemberRole;
}

export class ChannelMemberEntity extends BaseEntity {
  channelId: string;
  userId: string;
  role: MemberRole;
  permissions: MemberPermissions;
  isBanned: boolean;
  bannedAt?: Date;
  joinedAt: Date;

  constructor(props: ChannelMemberProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.channelId = props.channelId;
    this.userId = props.userId;
    this.role = props.role;
    this.permissions = props.permissions;
    this.isBanned = props.isBanned;
    this.bannedAt = props.bannedAt;
    this.joinedAt = props.joinedAt;
  }

  static create(input: CreateChannelMemberInput): ChannelMemberEntity {
    return new ChannelMemberEntity({
      id: crypto.randomUUID ? crypto.randomUUID() : "mem-" + Math.random().toString(36).substr(2, 9),
      joinedAt: new Date(),
      createdAt: new Date(),
      isBanned: false,
      permissions: DEFAULT_PERMISSIONS[input.role],
      ...input,
    });
  }

  static reconstitute(props: ChannelMemberProps): ChannelMemberEntity {
    return new ChannelMemberEntity(props);
  }

  ban(): void {
    this.isBanned = true;
    this.bannedAt = new Date();
    this.touch();
  }

  unban(): void {
    this.isBanned = false;
    this.bannedAt = undefined;
    this.touch();
  }

  changeRole(newRole: MemberRole): void {
    this.role = newRole;
    this.permissions = DEFAULT_PERMISSIONS[newRole];
    this.touch();
  }

  updateRole(newRole: MemberRole): void {
    this.changeRole(newRole);
  }

  updatePermissions(newPermissions: Partial<MemberPermissions>): void {
    this.permissions = { ...this.permissions, ...newPermissions };
    this.touch();
  }

  assertPermission(permission: keyof MemberPermissions): void {
    if (!this.permissions[permission]) {
      throw new ForbiddenException(`Sem permissão: ${permission}`);
    }
  }

  isOwner(): boolean {
    return this.role === MemberRole.GROUP_OWNER;
  }

  isAdmin(): boolean {
    return this.role === MemberRole.GROUP_ADMIN || this.isOwner();
  }

  canModerate(): boolean {
    return this.isAdmin() || this.permissions.canBanMembers;
  }

  publicData() {
    return {
      id: this.id,
      channelId: this.channelId,
      userId: this.userId,
      role: this.role,
      permissions: this.permissions,
      isBanned: this.isBanned,
      joinedAt: this.joinedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
