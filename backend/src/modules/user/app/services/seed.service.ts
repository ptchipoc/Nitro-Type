import { Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { UserEntity } from "@modules/user/domain/entities/user.entity";
import { UserProfileEntity } from "@modules/user/domain/entities/user-profile.entity";
import { UserStatus } from "@modules/user/domain/entities/enums/user-status.enum";
import { Role } from "@modules/user/domain/entities/enums/role.enum";
import { HashPort } from "@shared/adapters/hash/hash.port";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "@config/app.config";
import { Injectable } from "@nestjs/common";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { UserRegisteredEvent } from "@modules/auth/domain/events/user-registered.event";

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly hash: HashPort,
    private readonly config: ConfigService<AppConfig>,
    private readonly eventBus: EventBusPort,
  ) {}

  async admin(): Promise<void> {
    this.logger.log(`Seeding admin`);
    const seed = this.config.get("app", { infer: true })?.seed;
    if (!seed) {
      this.logger.log(`Seed não configurado`);
      return;
    }
    const exists = await this.userRepo.findByEmail(seed.adminEmail);
    if (exists) {
      this.logger.log(`Admin já existe: ${exists.id}`);
      return;
    }

    const passwordHash = await this.hash.hash(seed.adminPassword);

    const user = UserEntity.create({
      name: seed.adminName,
      email: seed.adminEmail,
      passwordHash,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      role: Role.ADMIN,
    });

    user.setProfile(new UserProfileEntity({ userId: user.id }));

    await this.userRepo.save(user);
    this.logger.log(`Admin registado: ${user.id}`);
    const isDev = this.config.get("app", { infer: true })?.isDev;
    if (isDev) {
      this.logger.log(`Email: ${user.email}`);
      this.logger.log(`Password: ${seed.adminPassword}`);
    }
    await this.eventBus.publish([
      new UserRegisteredEvent(user.id, user.email, user.name),
    ]);
  }
}
