import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DiscordService } from './Discord.service';
import { GuildResponse } from 'src/types';

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService, private discord: DiscordService) {}

  async guilds(): Promise<GuildResponse[]> {
    const dbGuilds = await this.prisma.guild.findMany();

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
}
