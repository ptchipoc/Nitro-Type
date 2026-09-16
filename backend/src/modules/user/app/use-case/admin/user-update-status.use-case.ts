import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { UpdateStatusUserInput } from "@modules/user/presentation/inputs/update-status-user.input";

@Injectable()
export class UserUpdateStatusUseCase {
  private readonly logger = new Logger(UserUpdateStatusUseCase.name);
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string, input: UpdateStatusUserInput) {
    this.logger.log(`Atualizar utilizador: ${userId}`);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Utilizador não encontrado");
    user.updateStatus(input.status);
    await this.userRepo.save(user);
    return user.publicData();
  }
}
