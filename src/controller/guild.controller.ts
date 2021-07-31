import { Controller, Get } from '@nestjs/common';
import { GuildResponse } from 'src/types';
import { GuildService } from '../service/guild.service';

@Controller('guilds')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Get()
  async getGuilds(): Promise<GuildResponse[]> {
    return await this.guildService.guilds();
  }
}
