import { Client, Intents } from 'discord.js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordService extends Client implements OnModuleInit {
  constructor(
    @Inject('DISCORD_INTENTS')
    private intents: Intents,
    private configService: ConfigService,
  ) {
    super();
  }

  async onModuleInit() {
    const token = await this.login(this.configService.get<string>('TOKEN'));
    console.log('discord initialized:', token);
  }
}
