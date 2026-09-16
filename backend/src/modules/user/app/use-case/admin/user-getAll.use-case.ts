import { Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "@modules/user/domain/repository/user.repo";

@Injectable()
export class UserGetAllUseCase {
  private readonly logger = new Logger(UserGetAllUseCase.name);
  constructor(private readonly userRepo: UserRepository) {}

  async execute() {
    this.logger.log("Fetching all users");
    const users = await this.userRepo.findAll();
    return users.map((entity) => entity.publicData());
  }
}
