import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import {
  UpdateUserProgressInput,
  UserProgressResponse,
} from "@modules/user/presentation/responses/user-progress.dto";
import { XpCalculator } from "@modules/user/domain/helpers/xp-calculator.helper";
import { Logger } from "@nestjs/common";

@Injectable()
export class UpdateUserProgressUseCase {
  private readonly logger = new Logger(UpdateUserProgressUseCase.name);
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string, input: UpdateUserProgressInput) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException("Utilizador não encontrado");
    }

    if (!user.progress) {
      throw new NotFoundException("Utilizador não tem progresso");
    }
    const difficulty = input.difficulty;

    const xpEarned = XpCalculator.calculateTypingXp({
      wpm: input.wpm,
      accuracy: input.accuracy,
      difficulty: difficulty as any,
      level: user.progress.level,
    });

    user.progress.addXp(xpEarned, input.activityDesc, input.resultId);
    await this.userRepo.save(user);

    this.logger.log(
      `User ${user.name} ganhou ${xpEarned} XP! (Novo Total: ${user.progress.totalXp})`,
    );

    return user.progress!.publicData();
  }
}
