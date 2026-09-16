import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class GetUserUseCase {
  private readonly logger = new Logger(GetUserUseCase.name);
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string) {
    this.logger.log(`Procurar utilizador: ${userId}`);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Utilizador não encontrado");
    const users = await this.userRepo.findRanking();
    const rank =
      users.findIndex((u) => u.publicData().id === userId.toString()) + 1;
    return {
      ...user.publicData(),
      rankGlobal: rank,
    };
  }
}
