import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { DiscordService } from './Discord.service';
import { GuildResponse } from 'src/types';

type FindManyArgs = {
  skip?: number;
  take?: number;
  cursor?: Prisma.GuildWhereUniqueInput;
  where?: Prisma.GuildWhereInput;
  orderBy?: Prisma.GuildOrderByInput;
};

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService, private discord: DiscordService) {}

  async guilds(params: FindManyArgs): Promise<GuildResponse[]> {
    const dbGuilds = await this.prisma.guild.findMany(params);

    const discordGuildsData = await Promise.all(
      dbGuilds.map((dbGuild) => this.discord.guilds.fetch(dbGuild.id)),
    );
    const response: GuildResponse[] = dbGuilds.map((dbGuild) => {
      const discordGuild = discordGuildsData.find(
        (discordGuild) => discordGuild.id === dbGuild.id,
      );
      const discordData = {
        name: discordGuild.name,
        iconUrl: discordGuild.iconURL({
          format: 'jpg',
          dynamic: true,
          size: 256,
        }),
      };

      return { ...dbGuild, ...discordData };
    });

    return response;
  }

  async guild(input: Prisma.UserWhereUniqueInput): Promise<GuildResponse> {
    const dbGuild = await this.prisma.guild.findUnique({
      where: input,
    });

    const discordGuild = await this.discord.guilds.fetch(dbGuild.id);

    const discordData = {
      name: discordGuild.name,
      iconUrl: discordGuild.iconURL({
        format: 'jpg',
        dynamic: true,
        size: 256,
      }),
    };

    return { ...dbGuild, ...discordData };
  }
}
