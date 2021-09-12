import { Controller, Get, Param } from '@nestjs/common';
import {
  GuildResponse,
  VoiceChannelResponse,
  UserResponse,
  SessionResponse,
  SessionLogResponse,
} from 'src/types';
import { GuildService } from '../service/guild.service';
import { SessionService } from '../service/session.service';
import { SessionLogService } from '../service/sessionLog.service';
import { VoiceChannelService } from '../service/voiceChannel.service';
import { UserService } from '../service/user.service';

@Controller('guilds')
export class GuildController {
  constructor(
    private readonly guildService: GuildService,
    private readonly sessionService: SessionService,
    private readonly sessionLogService: SessionLogService,
    private readonly voiceChannelService: VoiceChannelService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getGuilds(): Promise<GuildResponse[]> {
    return await this.guildService.guilds({});
  }

  @Get(':id')
  async findGuild(@Param('id') id: string): Promise<GuildResponse> {
    return await this.guildService.guild({ id });
  }

  @Get(':id/voiceChannels')
  async findVoiceChannels(
    @Param('id') guildId: string,
  ): Promise<VoiceChannelResponse[]> {
    return await this.voiceChannelService.voiceChannels({
      where: { guildId: guildId },
    });
  }

  @Get(':id/users')
  async findParticipants(@Param('id') id: string): Promise<UserResponse[]> {
    const users = await this.userService.users({
      where: {
        Guilds: {
          every: {
            id: id,
          },
        },
      },
    });

    return users;
  }

  @Get(':guildId/users/:userId/sessions')
  async findGuildParticipantSessions(
    @Param('guildId') guildId: string,
    @Param('userId') userId: string,
  ): Promise<SessionResponse[]> {
    const sessions = await this.sessionService.sessions({
      where: {
        AND: {
          VoiceChannel: {
            guildId,
          },
          SessionLogs: {
            some: {
              User: {
                id: userId,
              },
            },
          },
        },
      },
    });

    return sessions;
  }

  @Get(':id/sessions')
  async findSessions(@Param('id') id: string): Promise<SessionResponse[]> {
    const sessions = await this.sessionService.sessions({
      where: {
        VoiceChannel: {
          Guild: {
            id: id,
          },
        },
      },
    });

    return sessions;
  }

  @Get(':id/sessionLogs')
  async findSessionLogs(
    @Param('id') id: string,
  ): Promise<SessionLogResponse[]> {
    const sessionLogs = await this.sessionLogService.sessionLogs({
      where: {
        Session: {
          VoiceChannel: {
            Guild: {
              id: id,
            },
          },
        },
      },
    });

    return sessionLogs;
  }
}
