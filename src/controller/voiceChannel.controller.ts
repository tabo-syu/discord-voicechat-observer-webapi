import { Controller, Get, Param } from '@nestjs/common';
import {
  SessionResponse,
  SessionLogResponse,
  VoiceChannelResponse,
} from 'src/types';
import { VoiceChannelService } from '../service/voiceChannel.service';
import { SessionLogService } from '../service/sessionLog.service';
import { SessionService } from '../service/session.service';

@Controller('voiceChannels')
export class VoiceChannelController {
  constructor(
    private readonly voiceChannelService: VoiceChannelService,
    private readonly sessionService: SessionService,
    private readonly sessionLogService: SessionLogService,
  ) {}

  @Get()
  async findVoiceChannels(): Promise<VoiceChannelResponse[]> {
    return await this.voiceChannelService.voiceChannels({});
  }

  @Get(':id')
  async findVoiceChannel(
    @Param('id') id: string,
  ): Promise<VoiceChannelResponse> {
    return await this.voiceChannelService.voiceChannel({ id });
  }

  @Get(':id/sessions')
  async findSessions(@Param('id') id: string): Promise<SessionResponse[]> {
    const sessions = await this.sessionService.sessions({
      where: {
        VoiceChannel: {
          id: id,
        },
      },
    });

    return sessions;
  }

  @Get(':id/sessionLogs')
  async findSessionLogs(
    @Param('id') id: string,
  ): Promise<SessionLogResponse[]> {
    const sessions = await this.sessionLogService.sessionLogs({
      where: {
        Session: {
          VoiceChannel: {
            id: id,
          },
        },
      },
    });

    return sessions;
  }
}
