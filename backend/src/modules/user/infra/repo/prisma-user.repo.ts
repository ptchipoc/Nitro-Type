import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@shared/database/prisma.service";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { UserEntity } from "@modules/user/domain/entities/user.entity";
import { UserProfileEntity } from "@modules/user/domain/entities/user-profile.entity";
import { UserProgressEntity } from "@modules/user/domain/entities/user-progress.entity";
import { XpTransactionEntity } from "@modules/user/domain/entities/xp-transaction.entity";
import { AuthProviderAccountEntity } from "@modules/user/domain/entities/auth-provider-account.entity";
import { Role } from "@modules/user/domain/entities/enums/role.enum";
import { UserStatus } from "@modules/user/domain/entities/enums/user-status.enum";
import { AuthProvider } from "@modules/user/domain/entities/enums/auth-provider.enum";

@Injectable()
export class PrismaUserRepository extends UserRepository {
  private readonly logger = new Logger(PrismaUserRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        accounts: true,
        userProgress: {
          include: { xpTransactions: true },
        },
      },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const raws = await this.prisma.user.findMany({
      where: {
        role: Role.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      include: {
        profile: true,
        accounts: true,
        userProgress: {
          include: { xpTransactions: true },
        },
      },
    });
    return raws.map((raw) => this.toDomain(raw));
  }

  async findRanking(): Promise<UserEntity[]> {
    const raws = await this.prisma.user.findMany({
      where: {
        role: Role.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        userProgress: { totalXp: { gt: 0 } },
      },
      include: {
        profile: true,
        accounts: true,
        userProgress: {
          include: { xpTransactions: true },
        },
      },
      orderBy: [
        {
          userProgress: {
            totalXp: "desc",
          },
        },
      ],
    });
    return raws.map((raw) => this.toDomain(raw));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        accounts: true,
        userProgress: {
          include: { xpTransactions: true },
        },
      },
    });
    return raw ? this.toDomain(raw) : null;
  }

  async search(query: string): Promise<UserEntity[]> {
    const raws = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        role: Role.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
      include: {
        profile: true,
        accounts: true,
        userProgress: {
          include: { xpTransactions: true },
        },
      },
    });
    return raws.map((raw) => this.toDomain(raw));
  }

  async save(user: UserEntity): Promise<void> {
    await this.prisma.$transaction(async (tx: any) => {
      // 1. User
      await tx.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          passwordHash: user.passwordHash,
          avatarUrl: user.avatarUrl,
          role: user.role,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        update: {
          name: user.name,
          emailVerified: user.emailVerified,
          passwordHash: user.passwordHash,
          avatarUrl: user.avatarUrl,
          role: user.role,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
          updatedAt: user.updatedAt,
        },
      });

      // 2. Profile
      if (user.profile) {
        await tx.userProfile.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            bio: user.profile.bio,
            country: user.profile.country,
            socialLinks: user.profile.socialLinks,
          },
          update: {
            bio: user.profile.bio,
            country: user.profile.country,
            socialLinks: user.profile.socialLinks,
            updatedAt: new Date(),
          },
        });
      }

      // 3. Accounts
      for (const acc of user.accounts) {
        await tx.authProviderAccount.upsert({
          where: { id: acc.id },
          create: {
            id: acc.id,
            userId: user.id,
            provider: acc.provider,
            providerId: acc.providerId,
          },
          update: {
            providerId: acc.providerId,
            updatedAt: new Date(),
          },
        });
      }

      // 4. User Progress & XP Transactions
      if (user.progress) {
        await tx.userProgress.upsert({
          where: { userId: user.id },
          create: {
            id: user.progress.id,
            userId: user.id,
            totalXp: user.progress.totalXp,
            totalEvents: user.progress.totalEvents,
            level: user.progress.level,
            rank: user.progress.rank,
            rankTitle: user.progress.rankTitle,
            eventsWon: user.progress.eventsWon,
            lastActivityAt: user.progress.lastActivityAt,
            createdAt: user.progress.createdAt,
            updatedAt: user.progress.updatedAt,
          },
          update: {
            totalXp: user.progress.totalXp,
            totalEvents: user.progress.totalEvents,
            level: user.progress.level,
            rank: user.progress.rank,
            rankTitle: user.progress.rankTitle,
            eventsWon: user.progress.eventsWon,
            lastActivityAt: user.progress.lastActivityAt,
            updatedAt: user.progress.updatedAt,
          },
        });

        // Persistir transações que ainda não existem no banco
        // (Simplificado: as transações são imutáveis e só inserimos)
        for (const trans of user.progress.transactions) {
          await tx.xpTransaction.upsert({
            where: { id: trans.id },
            create: {
              id: trans.id,
              userId: user.id,
              userModuleProgressId: user.progress.id,
              amount: trans.amount,
              reason: trans.reason,
              referenceId: trans.referenceId,
              createdAt: trans.createdAt,
            },
            update: {}, // Não atualizamos transações
          });
        }
      }
    });
    this.logger.debug(`User ${user.id} persistido com progresso`);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toDomain(raw: any): UserEntity {
    const profile = raw.profile
      ? new UserProfileEntity({
          userId: raw.profile.userId,
          bio: raw.profile.bio,
          country: raw.profile.country,
          socialLinks: raw.profile.socialLinks as any[],
          createdAt: raw.profile.createdAt,
          updatedAt: raw.profile.updatedAt,
        })
      : null;

    const accounts = (raw.accounts ?? []).map(
      (a: any) =>
        new AuthProviderAccountEntity({
          id: a.id,
          userId: a.userId,
          provider: a.provider as AuthProvider,
          providerId: a.providerId,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        }),
    );

    const progress = raw.userProgress
      ? new UserProgressEntity({
          id: raw.userProgress.id,
          userId: raw.userProgress.userId,
          totalXp: raw.userProgress.totalXp,
          totalEvents: raw.userProgress.totalEvents,
          level: raw.userProgress.level,
          rank: raw.userProgress.rank,
          rankTitle: raw.userProgress.rankTitle,
          eventsWon: raw.userProgress.eventsWon,
          lastActivityAt: raw.userProgress.lastActivityAt,
          createdAt: raw.userProgress.createdAt,
          updatedAt: raw.userProgress.updatedAt,
          transactions: (raw.userProgress.xpTransactions ?? []).map(
            (t: any) =>
              new XpTransactionEntity({
                id: t.id,
                userId: t.userId,
                userModuleProgressId: t.userModuleProgressId,
                amount: t.amount,
                reason: t.reason,
                referenceId: t.referenceId,
                createdAt: t.createdAt,
              }),
          ),
        })
      : null;

    return new UserEntity({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      emailVerified: raw.emailVerified,
      passwordHash: raw.passwordHash,
      avatarUrl: raw.avatarUrl,
      role: raw.role as Role,
      status: raw.status as UserStatus,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      profile,
      accounts,
      progress,
    });
  }
}
