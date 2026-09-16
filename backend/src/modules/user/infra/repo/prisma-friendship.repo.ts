import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import {
  FriendshipRepository,
  FriendshipWithUserData,
} from "@modules/user/domain/repository/friendship.repo";
import { FriendshipEntity } from "@modules/user/domain/entities/friendship.entity";
import { FriendshipStatus } from "@modules/user/domain/entities/enums/friendship-status.enum";

@Injectable()
export class PrismaFriendshipRepository extends FriendshipRepository {
  private readonly logger = new Logger(PrismaFriendshipRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<FriendshipEntity | null> {
    const raw = await this.prisma.friendship.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findBySenderAndReceiver(
    senderId: string,
    receiverId: string,
  ): Promise<FriendshipEntity | null> {
    const raw = await this.prisma.friendship.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async findFriends(userId: string): Promise<FriendshipEntity[]> {
    const raws = await this.prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { updatedAt: "desc" },
    });
    return raws.map((r) => this.toDomain(r));
  }

  async findPendingRequests(userId: string): Promise<FriendshipEntity[]> {
    const raws = await this.prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: FriendshipStatus.PENDING,
      },
      orderBy: { createdAt: "desc" },
    });
    return raws.map((r) => this.toDomain(r));
  }

  async findSentRequests(userId: string): Promise<FriendshipEntity[]> {
    const raws = await this.prisma.friendship.findMany({
      where: {
        senderId: userId,
        status: FriendshipStatus.PENDING,
      },
      orderBy: { createdAt: "desc" },
    });
    return raws.map((r) => this.toDomain(r));
  }

  async findFriendsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]> {
    const raws = await this.prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return raws.map(this.toWithUserData);
  }

  async findPendingRequestsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]> {
    const raws = await this.prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return raws.map(this.toWithUserData);
  }

  async findRejectedRequestsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]> {
    const raws = await this.prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: FriendshipStatus.REJECTED,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return raws.map(this.toWithUserData);
  }

  async findBlockedRequestsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]> {
    const raws = await this.prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: FriendshipStatus.BLOCKED,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return raws.map(this.toWithUserData);
  }

  async findSentRequestsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]> {
    const raws = await this.prisma.friendship.findMany({
      where: {
        senderId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return raws.map(this.toWithUserData);
  }

  async save(friendship: FriendshipEntity): Promise<void> {
    await this.prisma.friendship.upsert({
      where: { id: friendship.id },
      create: {
        id: friendship.id,
        senderId: friendship.senderId,
        receiverId: friendship.receiverId,
        status: friendship.status,
        createdAt: friendship.createdAt,
        updatedAt: friendship.updatedAt,
      },
      update: {
        status: friendship.status,
        updatedAt: friendship.updatedAt,
      },
    });
    this.logger.debug(`Friendship ${friendship.id} persistida`);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.friendship.delete({ where: { id } });
    this.logger.debug(`Friendship ${id} removida`);
  }

  private toDomain(raw: any): FriendshipEntity {
    return FriendshipEntity.reconstitute({
      id: raw.id,
      senderId: raw.senderId,
      receiverId: raw.receiverId,
      status: raw.status as FriendshipStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  private toWithUserData(raw: any): FriendshipWithUserData {
    return {
      id: raw.id,
      senderId: raw.senderId,
      receiverId: raw.receiverId,
      status: raw.status as string,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      sender: {
        id: raw.sender.id,
        name: raw.sender.name,
        email: raw.sender.email,
        avatarUrl: raw.sender.avatarUrl,
      },
      receiver: {
        id: raw.receiver.id,
        name: raw.receiver.name,
        email: raw.receiver.email,
        avatarUrl: raw.receiver.avatarUrl,
      },
    };
  }
}
