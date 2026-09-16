import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";
import { XpTransactionResponse } from "@modules/user/presentation/responses/xp-transaction.dto";

@Injectable()
export class GetRecentXpUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    userId: string,
    limit: number = 10,
  ): Promise<XpTransactionResponse[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException("Utilizador não encontrado");
    }

    if (!user.progress) {
      return [];
    }

    const transactions = user.progress.transactions.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    const recent = transactions.slice(0, limit);

    return recent.map((t) => {
      const data = t.publicData();
      return {
        id: data.id,
        amount: data.amount,
        reason: data.reason,
        referenceId: data.referenceId,
        createdAt: data.createdAt,
      };
    });
  }
}
