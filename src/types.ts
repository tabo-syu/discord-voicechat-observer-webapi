import { User, Guild, Session, SessionLog, VoiceChannel } from '@prisma/client';

export type UserResponse = User & {
  username: string;
  avatarUrl: string;
};

export type GuildResponse = Guild & {
  name: string;
  iconUrl: string;
};

export type SessionResponse = Session;

export type SessionLogResponse = SessionLog;

export type VoiceChannelResponse = VoiceChannel & {
  name: string;
  participants: UserResponse[];
};
