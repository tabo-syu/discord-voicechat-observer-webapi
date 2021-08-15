import { Controller, Get, Param } from '@nestjs/common';
import { VoiceChannelResponse } from 'src/types';
import { VoiceChannelService } from '../service/voiceChannel.service';

@Controller('voiceChannels')
export class VoiceChannelController {
  constructor(private readonly voiceChannelService: VoiceChannelService) {}

  @Get()
  async getSessions(): Promise<VoiceChannelResponse[]> {
    return await this.voiceChannelService.voiceChannels();
  }

  @Get(':id')
  async findSession(@Param('id') id: string): Promise<VoiceChannelResponse> {
    return await this.voiceChannelService.voiceChannel(id);
  }
}
