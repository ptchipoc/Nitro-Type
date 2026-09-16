import { Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class GetRankingGlobalUseCase {
  private readonly logger = new Logger(GetRankingGlobalUseCase.name);
  constructor(private readonly userRepo: UserRepository) {}

  async execute() {
    this.logger.log("Fetching ranking global");
    const users = await this.userRepo.findRanking();
    return users.map((entity, idx) => {
      return {
        ...entity.publicData(),
        rankGlobal: idx + 1,
      };
    });
  }
}
