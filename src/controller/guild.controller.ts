import { Controller, Get, Param } from '@nestjs/common';
import { GuildResponse, VoiceChannelResponse, UserResponse } from 'src/types';
import { GuildService } from '../service/guild.service';
import { VoiceChannelService } from '../service/voiceChannel.service';
import { UserService } from '../service/user.service';

@Controller('guilds')
export class GuildController {
  constructor(
    private readonly guildService: GuildService,
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

  @Get(':id/participants')
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
}
