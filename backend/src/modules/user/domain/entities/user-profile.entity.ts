interface Props {
  userId: string;
  bio?: string | null;
  country?: string | null;
  socialLinks?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}
export class UserProfileEntity {
  public readonly userId: string;
  public bio: string | null;
  public country: string | null;
  public socialLinks: any[];
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(p: Props) {
    this.userId = p.userId;
    this.bio = p.bio ?? null;
    this.country = p.country ?? null;
    this.socialLinks = p.socialLinks ?? [];
    this.createdAt = p.createdAt ?? new Date();
    this.updatedAt = p.updatedAt ?? new Date();
  }

  updateProfile(data: {
    bio?: string | null;
    country?: string | null;
    socialLinks?: any[];
  }) {
    if (data.bio !== undefined) this.bio = data.bio;
    if (data.country !== undefined) this.country = data.country;
    if (data.socialLinks) this.socialLinks = data.socialLinks;
    this.updatedAt = new Date();
  }

  publicData() {
    return {
      bio: this.bio,
      country: this.country,
      socialLinks: this.socialLinks,
    };
  }
}
