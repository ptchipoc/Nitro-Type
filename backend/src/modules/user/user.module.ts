import { Global, Module } from "@nestjs/common";
import { UserController } from "@modules/user/presentation/controllers/user.controller";
import { FriendshipController } from "@modules/user/presentation/controllers/friendship.controller";
import { SeedService } from "@modules/user/app/services/seed.service";
import { HashPort } from "@shared/adapters/hash/hash.port";
import { HashAdapter } from "@shared/adapters/hash/hash.adapter";
import { UserRepository } from "./domain/repository/user.repo";
import { FriendshipRepository } from "./domain/repository/friendship.repo";
import { PrismaUserRepository } from "./infra/repo/prisma-user.repo";
import { PrismaFriendshipRepository } from "./infra/repo/prisma-friendship.repo";
import { UserClientService } from "./app/services/user-client.service";
import { FriendshipService } from "./app/services/friendship.service";
import { UserEmailRegisterUseCase } from "./app/use-case/user-email-register.use-case";
import { UserSearchUseCase } from "./app/use-case/user-search.use-case";
import { UserUpdateUseCase } from "./app/use-case/user-update.use-case";
import { UserGetAllUseCase } from "./app/use-case/admin/user-getAll.use-case";
import { GetUserUseCase } from "./app/use-case/get-user.use-case";
import { GetUserProgressUseCase } from "./app/use-case/get-user-progress.use-case";
import { UpdateUserProgressUseCase } from "./app/use-case/update-user-progress.use-case";
import { DeleteUserUseCase } from "./app/use-case/delete-user.use-case";
import { BlockUserUseCase } from "./app/use-case/block-user.use-case";
import { SuspendUserUseCase } from "./app/use-case/suspend-user.use-case";
import { UserSecurityListener } from "./infra/listeners/user-security.listener";
import { FriendshipListener } from "./infra/listeners/friendship.listener";
import { UserNotificationGateway } from "./presentation/gateways/user-notification.gateway";
import { GetRecentXpUseCase } from "./app/use-case/get-recent-xp.use-case";
import { GetRankingGlobalUseCase } from "./app/use-case/get-rankingGlobal.use-case";
import { SendFriendRequestUseCase } from "./app/use-case/friendship/send-friend-request.use-case";
import { CancelFriendRequestUseCase } from "./app/use-case/friendship/cancel-friend-request.use-case";
import { AcceptFriendRequestUseCase } from "./app/use-case/friendship/accept-friend-request.use-case";
import { RejectFriendRequestUseCase } from "./app/use-case/friendship/reject-friend-request.use-case";
import { RemoveFriendUseCase } from "./app/use-case/friendship/remove-friend.use-case";
import { ListFriendsUseCase } from "./app/use-case/friendship/list-friends.use-case";
import { ListFriendRequestsUseCase } from "./app/use-case/friendship/list-friend-requests.use-case";

const USE_CASES = [
  UserEmailRegisterUseCase,
  UserSearchUseCase,
  UserUpdateUseCase,
  UserGetAllUseCase,
  GetUserUseCase,
  GetUserProgressUseCase,
  UpdateUserProgressUseCase,
  DeleteUserUseCase,
  BlockUserUseCase,
  SuspendUserUseCase,
  GetRecentXpUseCase,
  GetRankingGlobalUseCase,
  // ── Friendship ──
  SendFriendRequestUseCase,
  CancelFriendRequestUseCase,
  AcceptFriendRequestUseCase,
  RejectFriendRequestUseCase,
  RemoveFriendUseCase,
  ListFriendsUseCase,
  ListFriendRequestsUseCase,
];

@Global()
@Module({
  controllers: [UserController, FriendshipController],
  providers: [
    SeedService,
    UserClientService,
    FriendshipService,
    ...USE_CASES,
    UserSecurityListener,
    FriendshipListener,
    UserNotificationGateway,
    { provide: HashPort, useClass: HashAdapter },
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: FriendshipRepository, useClass: PrismaFriendshipRepository },
  ],
  exports: [
    UserRepository,
    SeedService,
    UserClientService,
    FriendshipService,
    UpdateUserProgressUseCase, // exporta o que os outros módulos precisam
  ],
})
export class UserModule {}
