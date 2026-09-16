import { AuthProvider } from "@modules/user/domain/entities/enums/auth-provider.enum";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { Injectable, Logger } from "@nestjs/common";
import { TokenPort } from "@shared/adapters/token/token.port";
import { ProviderSignInInput } from "@modules/auth/presentation/inputs/provider-sign-in.input";
import { AuthProviderAccountEntity } from "@modules/user/domain/entities/auth-provider-account.entity";
import { UserEntity } from "@modules/user/domain/entities/user.entity";
import { UserProfileEntity } from "@modules/user/domain/entities/user-profile.entity";
import { generateSlug } from "@shared/helpers/slug.helper";
import { EventBusPort } from "@shared/adapters/event-bus/event-bus.port";
import {
  StateEventAction,
  UserRegisteredEvent,
} from "@modules/auth/domain/events/user-registered.event";

const PROVIDER_MAP: Record<string, AuthProvider> = {
  google: AuthProvider.GOOGLE,
  github: AuthProvider.GITHUB,
  intra42: AuthProvider.INTRA42,
};

@Injectable()
export class ProviderSignInService {
  private readonly logger = new Logger(ProviderSignInService.name);

  constructor(
    private readonly userRepo: UserRepository,
    private readonly token: TokenPort,
    private readonly eventBus: EventBusPort,
  ) {}

  async execute(input: ProviderSignInInput) {
    const providerEnum = PROVIDER_MAP[input.provider];
    if (!providerEnum)
      throw new Error(`Provider desconhecido: ${input.provider}`);

    let user = await this.userRepo.findByEmail(input.email);

    if (user) {
      if (!user.hasProvider(providerEnum)) {
        this.logger.log(
          `Ligando provider ${input.provider} ao user ${user.id}`,
        );
        user.linkProvider(
          new AuthProviderAccountEntity({
            userId: user.id,
            provider: providerEnum,
            providerId: input.providerId,
          }),
        );
      }

      if (input.emailVerified && !user.emailVerified) {
        user.verifyEmail();
      }
    } else {
      this.logger.log(`Novo utilizador via ${input.provider}: ${input.email}`);
      user = UserEntity.create({
        name: input.name,
        email: input.email,
        passwordHash: null,
        avatarUrl: input.avatarUrl,
        emailVerified: input.emailVerified,
      });

      if (input.emailVerified) user.verifyEmail();

      user.setProfile(
        new UserProfileEntity({
          userId: user.id,
        }),
      );

      user.linkProvider(
        new AuthProviderAccountEntity({
          userId: user.id,
          provider: providerEnum,
          providerId: input.providerId,
        }),
      );
    }

    user.recordLogin();
    await this.userRepo.save(user);

    await this.eventBus.publish([
      new UserRegisteredEvent(
        user.id,
        user.email,
        user.name,
        StateEventAction.ONLY_REGISTER,
      ),
    ]);
    const pair = this.token.generatePair({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { user: user.publicData(), ...pair };
  }
}
