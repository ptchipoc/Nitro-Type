import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FriendshipStatus } from "@modules/user/domain/entities/enums/friendship-status.enum";

export class FriendshipUserInfoResponse {
  @ApiProperty({ title: "User ID" })
  id: string;

  @ApiProperty({ title: "Name" })
  name: string;

  @ApiProperty({ title: "Email" })
  email: string;

  @ApiPropertyOptional({ title: "Avatar URL" })
  avatarUrl?: string | null;
}

export class FriendshipResponse {
  @ApiProperty({ title: "ID", description: "ID da amizade" })
  id: string;

  @ApiProperty({ title: "Sender ID", description: "ID de quem enviou o pedido" })
  senderId: string;

  @ApiProperty({ title: "Receiver ID", description: "ID de quem recebeu o pedido" })
  receiverId: string;

  @ApiProperty({
    title: "Status",
    description: "Status da amizade",
    enum: FriendshipStatus,
  })
  status: FriendshipStatus;

  @ApiProperty({ title: "Created At", description: "Data de criação" })
  createdAt: Date;

  @ApiProperty({ title: "Updated At", description: "Data de atualização" })
  updatedAt: Date;

  @ApiProperty({ title: "Sender", type: () => FriendshipUserInfoResponse })
  sender: FriendshipUserInfoResponse;

  @ApiProperty({ title: "Receiver", type: () => FriendshipUserInfoResponse })
  receiver: FriendshipUserInfoResponse;
}

export class FriendResponse extends FriendshipUserInfoResponse {
  @ApiProperty({ title: "Friendship ID" })
  friendshipId: string;

  @ApiProperty({ title: "Friendship Created At" })
  friendshipCreatedAt: Date;
}

export class FriendListResponse {
  @ApiProperty({
    title: "Friends",
    description: "Lista de amizades aceites",
    type: () => [FriendResponse],
  })
  friends: FriendResponse[];
}

export class FriendRequestListResponse {
  @ApiProperty({
    title: "Received",
    description: "Pedidos recebidos (pendentes)",
    type: () => [FriendshipResponse],
  })
  received: FriendshipResponse[];

  @ApiProperty({
    title: "Sent",
    description: "Pedidos enviados (pendentes)",
    type: () => [FriendshipResponse],
  })
  sent: FriendshipResponse[];
}
