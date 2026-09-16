import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class GetUserEventXpTransactionsUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("Utilizador não encontrado");

    if (!user.progress) {
      return { transactions: [] };
    }

    // Retorna as transações, ordenadas da mais recente para a mais antiga
    const transactions = user.progress.transactions.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return {
      transactions: transactions.map(t => {
        const data = t.publicData();
        return {
          id: data.id,
          amount: data.amount,
          reason: data.reason,
          referenceId: data.referenceId,
          createdAt: data.createdAt,
        };
      })
    };
  }
}
