export enum ChannelType {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

export enum InviteStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
}

export enum MemberRole {
    MASTER_ADMIN = "MASTER_ADMIN",
    GROUP_OWNER = "GROUP_OWNER",
    GROUP_ADMIN = "GROUP_ADMIN",
    GROUP_MEMBER = "GROUP_MEMBER",
    GROUP_VIEWER = "GROUP_VIEWER",
}

export enum MessageType {
    TEXT = "TEXT",
    SYSTEM = "SYSTEM",
    NOTIFICATION = "NOTIFICATION",
}

export enum UserPresenceStatus {
    ONLINE = "ONLINE",
    IDLE = "IDLE",
    OFFLINE = "OFFLINE",
}