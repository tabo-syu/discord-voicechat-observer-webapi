import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserResponse } from 'src/types';
import { DiscordService } from './Discord.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private discord: DiscordService) {}

  async users(): Promise<UserResponse[]> {
    const dbUsers = await this.prisma.user.findMany();

    const discordUsersData = await Promise.all(
      dbUsers.map((dbUser) => this.discord.users.fetch(dbUser.id)),
    );
    const response: UserResponse[] = dbUsers.map((dbUser) => {
      const discordUser = discordUsersData.find(
        (discordUser) => discordUser.id === dbUser.id,
      );
      const discordData = {
        username: discordUser.username,
        avatarUrl:
          discordUser.avatarURL({
            format: 'jpg',
            dynamic: true,
            size: 256,
          }) ?? discordUser.defaultAvatarURL,
      };
      return { ...dbUser, ...discordData };
    });

    return response;
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserResponse> {
    const dbUser = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    const discordUser = await this.discord.users.fetch(dbUser.id);
    const discordData = {
      username: discordUser.username,
      avatarUrl:
        discordUser.avatarURL({
          format: 'jpg',
          dynamic: true,
          size: 256,
        }) ?? discordUser.defaultAvatarURL,
    };

    return { ...dbUser, ...discordData };
  }
}
