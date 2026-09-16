import { Role } from "./enums/role.enum";
import { UserStatus } from "./enums/user-status.enum";
import { AuthProvider } from "./enums/auth-provider.enum";
import { UserProfileEntity } from "./user-profile.entity";
import { UserProgressEntity } from "./user-progress.entity";
import { AuthProviderAccountEntity } from "./auth-provider-account.entity";
import { BaseEntity } from "@shared/entities/base.entity";
import { DomainEvent } from "@shared/entities/domain-event.base";
import { UserBlockedEvent } from "../events/user-blocked.event";
import { UserSuspendedEvent } from "../events/user-suspended.event";
import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";

interface UserProps {
  id?: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  passwordHash?: string | null;
  avatarUrl?: string | null;
  role: Role;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date | null;
  profile?: UserProfileEntity | null;
  accounts?: AuthProviderAccountEntity[];
  progress?: UserProgressEntity | null;
}

interface CreateUserProps {
  name: string;
  email: string;
  passwordHash: string | null;
  status?: UserStatus;
  avatarUrl?: string | null;
  emailVerified?: boolean;
  role?: Role;
}

export class UserEntity extends BaseEntity {
  public props: UserProps;
  private events: DomainEvent[] = [];
  constructor(p: UserProps) {
    super(p.id, p.createdAt, p.updatedAt);
    this.props = p;
  }

  // ─── Factory ────────────────────────────────────────────────
  static create(input: CreateUserProps): UserEntity {
    if (!input.name || input.name.trim().length === 0) {
      throw new BadRequestException("O nome é obrigatório");
    }
    if (!input.email || input.email.trim().length === 0) {
      throw new BadRequestException("O email é obrigatório");
    }
    if (input.passwordHash && input.passwordHash.length < 8) {
      throw new BadRequestException("A senha deve ter pelo menos 8 caracteres");
    }
    const user = new UserEntity({
      id: randomUUID(),
      ...input,
      role: input.role ?? Role.USER,
      emailVerified: input.emailVerified ?? false,
      status: input.status ?? UserStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Adiciona o progresso inicial por default
    user.props.progress = UserProgressEntity.createDefault(user.id);

    return user;
  }

  static reconstitute(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get emailVerified() {
    return this.props.emailVerified;
  }
  get role() {
    return this.props.role;
  }
  get status() {
    return this.props.status;
  }
  get lastLoginAt() {
    return this.props.lastLoginAt;
  }

  get profile() {
    return this.props.profile;
  }
  get accounts() {
    if (!this.props.accounts) return [];
    return [...this.props.accounts];
  }
  get progress() {
    return this.props.progress;
  }
  get domainEvents() {
    return [...this.events];
  }
  get avatarUrl() {
    return this.props.avatarUrl;
  }

  // ─── Métodos de negócio (intenção clara) ─────────────────────

  isAdmin(): boolean {
    return this.props.role === Role.ADMIN;
  }

  isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }

  isPending(): boolean {
    return this.props.status === UserStatus.PENDING;
  }

  isSuspended(): boolean {
    return this.props.status === UserStatus.SUSPENDED;
  }

  isEmailVerified(): boolean {
    return this.props.emailVerified === true;
  }

  verifyEmail(): void {
    this.props.emailVerified = true;
    this.props.status = UserStatus.ACTIVE;
    this.touch();
  }

  updateInfo(data: { name?: string; avatarUrl?: string }) {
    if (data.name) this.props.name = data.name;
    if (data.avatarUrl) this.props.avatarUrl = data.avatarUrl;
    this.touch();
  }

  updateStatus(status: UserStatus) {
    if (this.props.status === status)
      throw new BadRequestException("Utilizador já está nesse status");
    this.props.status = status;
    this.touch();
  }

  upadatePassword(newPassword: string) {
    if (newPassword.length >= 8) {
      this.props.passwordHash = newPassword;
      this.touch();
    } else {
      throw new BadRequestException("A senha deve ter pelo menos 8 caracteres");
    }
  }

  recordLogin(): void {
    this.props.lastLoginAt = new Date();
    this.touch();
  }

  setProfile(profile: UserProfileEntity): void {
    this.props.profile = profile;
    this.touch();
  }

  linkProvider(account: AuthProviderAccountEntity): void {
    const exists = this.props.accounts?.find(
      (a) => a.provider === account.provider,
    );
    if (exists) {
      exists.providerId = account.providerId;
    } else {
      this.props.accounts?.push(account);
    }
    this.touch();
  }

  hasProvider(provider: AuthProvider): boolean {
    if (!this.props.accounts) return false;
    return this.props.accounts.some((a) => a.provider === provider);
  }

  suspend(reason?: string): void {
    this.props.status = UserStatus.SUSPENDED;
    this.addEvent(new UserSuspendedEvent(this.id, reason));
    this.touch();
  }

  block(reason?: string): void {
    this.props.status = UserStatus.BANNED;
    this.addEvent(new UserBlockedEvent(this.id, reason));
    this.touch();
  }

  updateProgress(xp?: number, level?: number, rank?: number): void {
    if (!this.props.progress) {
      this.props.progress = UserProgressEntity.createDefault(this.id);
    }
    this.props.progress.updateProgress({ totalXp: xp, level, rank });
    this.touch();
  }

  protected addEvent(event: DomainEvent): void {
    this.events.push(event);
  }

  clearEvents() {
    this.events = [];
  }

  // ── Output ────────────────────────────────────────────────────────────────

  publicData() {
    return {
      id: this.id,
      name: this.props.name,
      email: this.props.email,
      emailVerified: this.props.emailVerified,
      role: this.props.role,
      status: this.props.status,
      avatarUrl: this.props.avatarUrl,
      lastLoginAt: this.props.lastLoginAt,
      profile: this.profile?.publicData() ?? null,
      progress: this.progress?.publicData() ?? null,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  publicMiniData() {
    return {
      id: this.id,
      name: this.props.name,
      email: this.props.email,
      role: this.props.role,
      status: this.props.status,
      avatarUrl: this.props.avatarUrl ?? null,
    };
  }
}
