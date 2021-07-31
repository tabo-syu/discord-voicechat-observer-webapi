import { User, Guild } from '@prisma/client';

export type UserResponse = User & {
  username: string;
  avatarUrl: string;
};

export type GuildResponse = Guild & {
  name: string;
  iconUrl: string;
};
