import { BaseEntity } from "@shared/entities/base.entity";
import { ChannelType } from "./enums/channel-type";

export interface ChannelProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: ChannelType;
  memberCount: number;
  isPlatformManaged: boolean;
  createdBy: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

interface CreateChannelInput {
  name: string;
  slug: string;
  description?: string;
  type: ChannelType;
  isPlatformManaged: boolean;
  createdBy: string;
}

export class ChannelEntity extends BaseEntity {
  private props: ChannelProps;

  private constructor(props: ChannelProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.props = props;
  }

  static create(input: CreateChannelInput): ChannelEntity {
    return new ChannelEntity({
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : "ch-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      isArchived: false,
      ...input,
      memberCount: 0,
    });
  }

  static reconstitute(props: ChannelProps): ChannelEntity {
    return new ChannelEntity(props);
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }

  get description() {
    return this.props.description;
  }

  get type() {
    return this.props.type;
  }

  get isPlatformManaged() {
    return this.props.isPlatformManaged;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get isArchived() {
    return this.props.isArchived;
  }

  get memberCount() {
    return this.props.memberCount;
  }

  archive(): void {
    this.props.isArchived = true;
    this.touch();
  }

  updateInfo(data: {
    name?: string;
    description?: string;
    slug?: string;
  }): void {
    if (data.name) this.props.name = data.name;
    if (data.description !== undefined)
      this.props.description = data.description;
    if (data.slug) this.props.slug = data.slug;
    this.touch();
  }

  isPublic(): boolean {
    return this.type === ChannelType.PUBLIC;
  }

  isPrivate(): boolean {
    return this.type === ChannelType.PRIVATE;
  }

  publicData() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      type: this.type,
      isPlatformManaged: this.isPlatformManaged,
      createdBy: this.createdBy,
      isArchived: this.isArchived,
      memberCount: this.memberCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
