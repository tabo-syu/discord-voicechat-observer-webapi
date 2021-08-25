import { DiscordService } from './discord.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { VoiceChannelResponse } from 'src/types';

type FindManyArgs = {
  skip?: number;
  take?: number;
  cursor?: Prisma.VoiceChannelWhereUniqueInput;
  where?: Prisma.VoiceChannelWhereInput;
  orderBy?: Prisma.VoiceChannelOrderByInput;
};

@Injectable()
export class VoiceChannelService {
  constructor(private prisma: PrismaService, private discord: DiscordService) {}

  async voiceChannels(params: FindManyArgs): Promise<VoiceChannelResponse[]> {
    const voiceChannels = await this.prisma.voiceChannel.findMany(params);

    const response = await Promise.all(
      voiceChannels.map(async (voiceChannel) => {
        const guild = await this.discord.guilds.fetch(voiceChannel.guildId);
        const channel = guild.channels.cache.get(voiceChannel.id);

        return {
          ...voiceChannel,
          name: channel.name,
        };
      }),
    );

    return response;
  }

  async voiceChannel(
    input: Prisma.UserWhereUniqueInput,
  ): Promise<VoiceChannelResponse> {
    const voiceChannel = await this.prisma.voiceChannel.findUnique({
      where: input,
    });

    const guild = await this.discord.guilds.fetch(voiceChannel.guildId);
    const channel = guild.channels.cache.get(voiceChannel.id);

    const response = {
      ...voiceChannel,
      name: channel.name,
    };

    return response;
  }
}
