import { ConfigModule } from '@nestjs/config';
import { Intents } from 'discord.js';
import { Module } from '@nestjs/common';

import { GuildController } from './controller/guild.controller';
import { SessionController } from './controller/session.controller';
import { SessionLogController } from './controller/sessionLog.controller';
import { UserController } from './controller/user.controller';
import { VoiceChannelController } from './controller/voiceChannel.controller';

import { DiscordService } from './service/Discord.service';
import { GuildService } from './service/guild.service';
import { PrismaService } from './service/prisma.service';
import { SessionService } from './service/session.service';
import { SessionLogService } from './service/sessionLog.service';
import { UserService } from './service/user.service';
import { VoiceChannelService } from './service/voiceChannel.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    GuildController,
    UserController,
    SessionController,
    SessionLogController,
    VoiceChannelController,
  ],
  providers: [
    DiscordService,
    GuildService,
    PrismaService,
    SessionService,
    SessionLogService,
    UserService,
    VoiceChannelService,
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
