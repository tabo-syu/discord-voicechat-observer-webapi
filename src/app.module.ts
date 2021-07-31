import { Intents } from 'discord.js';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controller/user.controller';
import { PrismaService } from './service/prisma.service';
import { UserService } from './service/user.service';
import { DiscordService } from './service/Discord.service';
import { GuildController } from './controller/guild.controller';
import { GuildService } from './service/guild.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [GuildController, UserController],
  providers: [
    PrismaService,
    GuildService,
    UserService,
    DiscordService,
    {
      provide: 'DISCORD_INTENTS',
      useFactory: () => ({
        ws: {
          intents: new Intents([Intents.NON_PRIVILEGED, 'GUILD_MEMBERS']),
        },
      }),
    },
  ],
})
export class AppModule {}
