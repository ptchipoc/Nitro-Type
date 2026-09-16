import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { UpdateUserInput } from "@modules/user/presentation/inputs/update-user.input";

@Injectable()
export class UserUpdateUseCase {
  private readonly logger = new Logger(UserUpdateUseCase.name);
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string, input: UpdateUserInput) {
    this.logger.log(`Atualizar utilizador: ${userId}`);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Utilizador não encontrado");

    if (input.name || input.avatarUrl) user.updateInfo({ name: input.name, avatarUrl: input.avatarUrl });

    if (user.profile) {
      user.profile.updateProfile({
        bio: input.bio,
        country: input.country,
        socialLinks: input.socialLinks,
      });
      this.logger.log(`User profile updated: ${userId}`);
    }

    await this.userRepo.save(user);
    this.logger.log(`User updated: ${userId}`);
    return user.publicData();
  }
}
