import { FriendshipEntity } from "@modules/user/domain/entities/friendship.entity";

export interface FriendshipUserInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface FriendshipWithUserData {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  sender: FriendshipUserInfo;
  receiver: FriendshipUserInfo;
}

export abstract class FriendshipRepository {
  abstract findById(id: string): Promise<FriendshipEntity | null>;
  abstract findBySenderAndReceiver(
    senderId: string,
    receiverId: string,
  ): Promise<FriendshipEntity | null>;
  abstract findFriends(userId: string): Promise<FriendshipEntity[]>;
  abstract findPendingRequests(userId: string): Promise<FriendshipEntity[]>;
  abstract findSentRequests(userId: string): Promise<FriendshipEntity[]>;

  abstract findFriendsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]>;
  abstract findPendingRequestsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]>;
  abstract findRejectedRequestsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]>;
  abstract findBlockedRequestsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]>;
  abstract findSentRequestsWithUsers(
    userId: string,
  ): Promise<FriendshipWithUserData[]>;

  abstract save(friendship: FriendshipEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
