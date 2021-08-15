import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';
import { DiscordService } from './discord.service';
import { VoiceChannelResponse } from 'src/types';

@Injectable()
export class VoiceChannelService {
  constructor(
    private prisma: PrismaService,
    private discord: DiscordService,
    private user: UserService,
  ) {}

  async voiceChannels(): Promise<VoiceChannelResponse[]> {
    const voiceChannels = await this.prisma.voiceChannel.findMany({
      include: {
        Participants: true,
      },
    });

    const response = await Promise.all(
      voiceChannels.map(async (voiceChannel) => {
        const guild = await this.discord.guilds.fetch(voiceChannel.guildId);
        const channel = guild.channels.cache.get(voiceChannel.id);

        const participants = await Promise.all(
          voiceChannel.Participants.map((participant) => {
            return this.user.user({ id: participant.id });
          }),
        );

        return {
          id: voiceChannel.id,
          name: channel.name,
          guildId: voiceChannel.guildId,
          updatedAt: voiceChannel.updatedAt,
          participants,
        };
      }),
    );

    return response;
  }

  async voiceChannel(id: string): Promise<VoiceChannelResponse> {
    const voiceChannel = await this.prisma.voiceChannel.findUnique({
      where: {
        id,
      },
      include: {
        Participants: true,
      },
    });

    const participants = await Promise.all(
      voiceChannel.Participants.map((participant) => {
        return this.user.user({ id: participant.id });
      }),
    );

    const guild = await this.discord.guilds.fetch(voiceChannel.guildId);
    const channel = guild.channels.cache.get(voiceChannel.id);

    const response = {
      id: voiceChannel.id,
      name: channel.name,
      guildId: voiceChannel.guildId,
      updatedAt: voiceChannel.updatedAt,
      participants,
    };

    return response;
  }
}
