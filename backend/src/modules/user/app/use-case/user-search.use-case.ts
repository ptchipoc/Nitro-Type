import { Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class UserSearchUseCase {
  private readonly logger = new Logger(UserSearchUseCase.name);

  constructor(private readonly userRepo: UserRepository) {}

  async execute(query: string) {
    this.logger.log(`Pesquisando utilizadores por: ${query}`);
    const users = await this.userRepo.search(query);
    return users.map((u) => u.publicData());
  }
}
