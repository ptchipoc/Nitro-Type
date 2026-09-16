import { Injectable, Logger } from "@nestjs/common";
import { UserSearchUseCase } from "../use-case/user-search.use-case";
import { GetUserUseCase } from "../use-case/get-user.use-case";
import { UserUpdateUseCase } from "../use-case/user-update.use-case";
import { UpdateUserInput } from "@modules/user/presentation/inputs/update-user.input";
import { UserEmailRegisterUseCase } from "../use-case/user-email-register.use-case";
import { EmailSignUpInput } from "@modules/auth/presentation/inputs/email-sign-up.input";
import { GetUserProgressUseCase } from "../use-case/get-user-progress.use-case";
import { UpdateUserProgressUseCase } from "../use-case/update-user-progress.use-case";
import { DeleteUserUseCase } from "../use-case/delete-user.use-case";
import { BlockUserUseCase } from "../use-case/block-user.use-case";
import { SuspendUserUseCase } from "../use-case/suspend-user.use-case";
import { UpdateUserProgressInput } from "@modules/user/presentation/responses/user-progress.dto";
import { GetRecentXpUseCase } from "../use-case/get-recent-xp.use-case";

import { UserGetAllUseCase } from "../use-case/admin/user-getAll.use-case";
import { GetRankingGlobalUseCase } from "../use-case/get-rankingGlobal.use-case";

@Injectable()
export class UserClientService {
  private readonly logger = new Logger(UserClientService.name);
  constructor(
    private readonly getUserAll: UserGetAllUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly searchUser: UserSearchUseCase,
    private readonly updateUser: UserUpdateUseCase,
    private readonly registerEmail: UserEmailRegisterUseCase,
    private readonly getProgress: GetUserProgressUseCase,
    private readonly updateProgressUseCase: UpdateUserProgressUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly blockUser: BlockUserUseCase,
    private readonly suspendUser: SuspendUserUseCase,
    private readonly getRankingGlobalUseCase: GetRankingGlobalUseCase,
    private readonly getRecentXpUseCase: GetRecentXpUseCase,
  ) {}

  async getUserById(userId: string) {
    return this.getUser.execute(userId);
  }

  async getAll() {
    return this.getUserAll.execute();
  }

  async searchUsers(query: string) {
    return this.searchUser.execute(query);
  }

  async update(userId: string, input: UpdateUserInput) {
    return this.updateUser.execute(userId, input);
  }

  async registerByEmail(input: EmailSignUpInput) {
    return this.registerEmail.execute(input);
  }

  async getUserProgress(userId: string) {
    return this.getProgress.execute(userId);
  }

  async getRankingGlobal() {
    return this.getRankingGlobalUseCase.execute();
  }

  async updateUserProgress(userId: string, input: UpdateUserProgressInput) {
    return this.updateProgressUseCase.execute(userId, input);
  }

  async getRecentXp(userId: string, limit?: number) {
    return this.getRecentXpUseCase.execute(userId, limit);
  }

  async delete(userId: string) {
    return this.deleteUser.execute(userId);
  }

  async block(userId: string, reason?: string) {
    return this.blockUser.execute(userId, reason);
  }

  async suspend(userId: string, reason?: string) {
    return this.suspendUser.execute(userId, reason);
  }
}
