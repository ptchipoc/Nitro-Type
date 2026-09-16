import { Injectable, ConflictException, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import { HashPort } from "@shared/adapters/hash/hash.port";
import { UserEntity } from "@modules/user/domain/entities/user.entity";
import { UserProfileEntity } from "@modules/user/domain/entities/user-profile.entity";
import { UserRegisteredEvent } from "@modules/auth/domain/events/user-registered.event";
import { EmailSignUpInput } from "@modules/auth/presentation/inputs/email-sign-up.input";
import { UserStatus } from "@modules/user/domain/entities/enums/user-status.enum";
import { Role } from "@modules/user/domain/entities/enums/role.enum";
import { generateSlug } from "@shared/helpers/slug.helper";

@Injectable()
export class UserEmailRegisterUseCase {
  private readonly logger = new Logger(UserEmailRegisterUseCase.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly hash: HashPort,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: EmailSignUpInput): Promise<{ message: string }> {
    this.logger.log(`User email register: ${input.email}`);

    const exists = await this.userRepo.findByEmail(input.email);
    if (exists) throw new ConflictException("Email já registado");

    const passwordHash = await this.hash.hash(input.password);

    const user = UserEntity.create({
      name: input.name,
      email: input.email,
      passwordHash,
      status: UserStatus.PENDING,
      emailVerified: false,
      role: Role.USER,
    });

    user.setProfile(new UserProfileEntity({ userId: user.id }));

    await this.userRepo.save(user);

    await this.eventBus.publish([
      new UserRegisteredEvent(user.id, user.email, user.name),
    ]);

    this.logger.log(`Utilizador registado: ${user.id} — OTP enfileirado`);
    return {
      message: "Conta criada. Verifica o teu email para activar a conta.",
    };
  }
}
