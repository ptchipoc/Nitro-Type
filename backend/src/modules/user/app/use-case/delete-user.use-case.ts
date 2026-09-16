import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException("Utilizador não encontrado");
    }

    await this.userRepo.delete(userId);
  }
}
