import { BaseEntity } from "@shared/entities/base.entity";
import { FriendshipStatus } from "./enums/friendship-status.enum";
import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";

interface FriendshipProps {
  id?: string;
  senderId: string;
  receiverId: string;
  status?: FriendshipStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FriendshipEntity extends BaseEntity {
  private props: FriendshipProps;

  constructor(p: FriendshipProps) {
    super(p.id, p.createdAt, p.updatedAt);
    this.props = p;
  }

  // ─── Factory ────────────────────────────────────────────────
  static create(senderId: string, receiverId: string): FriendshipEntity {
    if (senderId === receiverId) {
      throw new BadRequestException(
        "Não podes enviar pedido de amizade a ti próprio",
      );
    }
    return new FriendshipEntity({
      id: randomUUID(),
      senderId,
      receiverId,
      status: FriendshipStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: FriendshipProps): FriendshipEntity {
    return new FriendshipEntity(props);
  }

  // ── Getters ───────────────────────────────────────────────────
  get senderId() {
    return this.props.senderId;
  }
  get receiverId() {
    return this.props.receiverId;
  }
  get status() {
    return this.props.status;
  }

  // ── Business Logic ────────────────────────────────────────────
  isPending(): boolean {
    return this.props.status === FriendshipStatus.PENDING;
  }

  isAccepted(): boolean {
    return this.props.status === FriendshipStatus.ACCEPTED;
  }

  isRejected(): boolean {
    return this.props.status === FriendshipStatus.REJECTED;
  }

  isBlocked(): boolean {
    return this.props.status === FriendshipStatus.BLOCKED;
  }

  accept(): void {
    if (this.props.status == FriendshipStatus.BLOCKED) {
      throw new BadRequestException("Não podes aceitar um pedido bloqueado");
    }
    this.props.status = FriendshipStatus.ACCEPTED;
    this.touch();
  }

  reject(): void {
    if (this.props.status !== FriendshipStatus.PENDING) {
      throw new BadRequestException("Só podes rejeitar pedidos pendentes");
    }
    this.props.status = FriendshipStatus.REJECTED;
    this.touch();
  }

  cancel(): void {
    if (this.props.status !== FriendshipStatus.PENDING) {
      throw new BadRequestException("Só podes cancelar pedidos pendentes");
    }
  }

  block(): void {
    this.props.status = FriendshipStatus.BLOCKED;
    this.touch();
  }

  // ── Output ────────────────────────────────────────────────────
  publicData() {
    return {
      id: this.id,
      senderId: this.props.senderId,
      receiverId: this.props.receiverId,
      status: this.props.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
