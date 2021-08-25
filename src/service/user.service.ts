import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { UserResponse } from 'src/types';
import { DiscordService } from './Discord.service';

type FindManyArgs = {
  skip?: number;
  take?: number;
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByInput;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private discord: DiscordService) {}

  async users(params: FindManyArgs): Promise<UserResponse[]> {
    const dbUsers = await this.prisma.user.findMany(params);

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

  async user(input: Prisma.UserWhereUniqueInput): Promise<UserResponse> {
    const dbUser = await this.prisma.user.findUnique({
      where: input,
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
