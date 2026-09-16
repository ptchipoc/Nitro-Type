import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { UserProgressResponse } from "@modules/user/presentation/responses/user-progress.dto";

@Injectable()
export class GetUserProgressUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException("Utilizador não encontrado");
    }

    if (!user.progress) {
      throw new NotFoundException("Progresso do utilizador não encontrado");
    }

    return user.progress.publicData();
  }
}
