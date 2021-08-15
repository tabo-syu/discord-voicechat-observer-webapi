import { Controller, Get, Param } from '@nestjs/common';
import { SessionResponse } from 'src/types';
import { SessionService } from '../service/session.service';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async getSessions(): Promise<SessionResponse[]> {
    return await this.sessionService.sessions();
  }

  @Get(':id')
  async findSession(@Param('id') id: string): Promise<SessionResponse> {
    return await this.sessionService.session(id);
  }
}
