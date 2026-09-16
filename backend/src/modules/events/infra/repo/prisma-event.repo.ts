import { Injectable } from "@nestjs/common";
import { EventEntity } from "../../domain/entities/event.entity";
import { EventParticipantEntity } from "../../domain/entities/event-participant.entity";
import { EventRepository } from "@modules/events/domain/repository/event.repo";
import { PrismaService } from "@shared/database/prisma.service";
import { EventType } from "@modules/events/domain/entities/enums/event-type";
import { EventStatus } from "@modules/events/domain/entities/enums/event-status";
import { UserEntity } from "@modules/user/domain/entities/user.entity";

@Injectable()
export class EventRepositoryImpl implements EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Save (upsert completo) ──────────────────────────────────
  async save(event: EventEntity): Promise<void> {
    const data = event.publicData();

    await this.prisma.$transaction(async (tx) => {
      // Upsert do evento principal
      await tx.event.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          creatorId: data.creatorId,
          name: data.name,
          description: data.description,
          type: data.type,
          status: data.status,
          scheduledAt: data.scheduledAt,
          roundsCount: data.roundsCount,
          currentRound: data.currentRound,
          baseXp: data.baseXp,
          category: data.category,
          difficulty: data.difficulty,
          betweenRoundsDelay: data.betweenRoundsDelay,
          maxParticipants: (data as any).maxParticipants ?? null,
          startedAt: data.startedAt,
          finishedAt: data.finishedAt,
          createdAt: data.createdAt,
        },
        update: {
          name: data.name,
          description: data.description,
          status: data.status,
          scheduledAt: data.scheduledAt,
          roundsCount: data.roundsCount,
          currentRound: data.currentRound,
          baseXp: data.baseXp,
          category: data.category,
          difficulty: data.difficulty,
          betweenRoundsDelay: data.betweenRoundsDelay,
          maxParticipants: (data as any).maxParticipants ?? null,
          startedAt: data.startedAt,
          finishedAt: data.finishedAt,
        },
      });

      // Upsert dos participantes
      for (const participant of data.participants) {
        await tx.eventParticipant.upsert({
          where: {
            eventId_userId: {
              eventId: participant.eventId,
              userId: participant.userId,
            },
          },
          create: {
            id: participant.id,
            eventId: participant.eventId,
            userId: participant.userId,
            status: participant.status,
            totalScore: participant.totalScore,
            joinedAt: participant.joinedAt,
            createdAt: participant.createdAt,
          },
          update: {
            status: participant.status,
            totalScore: participant.totalScore,
          },
        });
      }
    });
  }

  // ─── Find by ID (com todos os agregados) ────────────────────
  async findById(id: string): Promise<EventEntity | null> {
    const raw = await this.prisma.event.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!raw) return null;
    return this.reconstitute(raw);
  }

  // ─── Find all PUBLIC ─────────────────────────────────────────

  async findAllPublic(): Promise<EventEntity[]> {
    const rows = await this.prisma.event.findMany({
      where: {
        type: EventType.PUBLIC,
        AND: {
          status: {
            not: EventStatus.FINISHED,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });

    return rows.map((r) => this.reconstitute(r));
  }

  // ─── Find by creator ─────────────────────────────────────────
  async findByCreatorId(creatorId: string): Promise<EventEntity[]> {
    const rows = await this.prisma.event.findMany({
      where: {
        creatorId,
        AND: {
          status: {
            not: EventStatus.FINISHED,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((r) => this.reconstitute(r));
  }

  // ─── Find scheduled before date (para o scheduler) ──────────
  async findScheduledBefore(date: Date): Promise<EventEntity[]> {
    const rows = await this.prisma.event.findMany({
      where: {
        status: EventStatus.SCHEDULED,
        scheduledAt: { lte: date },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return rows.map((r) => this.reconstitute(r));
  }

  // ─── Find by user id ─────────────────────────────────────────
  // A ideia é trazer os eventos que o usuário criou ou os eventos PUBLICOS
  async findAllByUserId(
    userId: string,
    status?: EventStatus,
    type?: EventType,
  ): Promise<EventEntity[]> {
    const rows = await this.prisma.event.findMany({
      where: {
        type: type,
        OR: [
          { type: EventType.PUBLIC },
          { creatorId: userId },
          {
            participants: {
              some: { userId },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((r) => this.reconstitute(r));
  }

  // ─── Delete ──────────────────────────────────────────────────
  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({ where: { id } });
  }

  // ─── Reconstitute ────────────────────────────────────────────
  private reconstitute(raw: any): EventEntity {
    const participants = raw.participants.map((p: any) => {
      const user = UserEntity.reconstitute({
        id: p.user.id,
        name: p.user.name,
        email: p.user.email,
        emailVerified: p.user.emailVerified,
        role: p.user.role,
        status: p.user.status,
        createdAt: p.user.createdAt,
        updatedAt: p.user.updatedAt ?? undefined,
        lastLoginAt: p.user.lastLoginAt ?? undefined,
        avatarUrl: p.user.avatarUrl,
      });
      return EventParticipantEntity.reconstitute({
        id: p.id,
        eventId: p.eventId,
        userId: p.userId,
        status: p.status,
        totalScore: p.totalScore,
        joinedAt: p.joinedAt,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt ?? undefined,
        user,
      });
    });

    return EventEntity.reconstitute({
      id: raw.id,
      creatorId: raw.creatorId,
      name: raw.name,
      description: raw.description ?? undefined,
      type: raw.type,
      status: raw.status,
      baseXp: raw.baseXp,
      scheduledAt: raw.scheduledAt ?? undefined,
      betweenRoundsDelay: raw.betweenRoundsDelay,
      maxParticipants: raw.maxParticipants ?? undefined,
      startedAt: raw.startedAt ?? undefined,
      finishedAt: raw.finishedAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
      roundsCount: raw.roundsCount,
      currentRound: raw.currentRound,
      category: raw.category,
      difficulty: raw.difficulty,
      participants,
    });
  }
}
