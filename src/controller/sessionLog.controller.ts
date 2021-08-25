import { Controller, Get, Param } from '@nestjs/common';
import { SessionLogResponse } from 'src/types';
import { SessionLogService } from '../service/sessionLog.service';

@Controller('sessionLogs')
export class SessionLogController {
  constructor(private readonly sessionLogService: SessionLogService) {}

  @Get()
  async getSessions(): Promise<SessionLogResponse[]> {
    return await this.sessionLogService.sessionLogs({});
  }

  @Get(':id')
  async findSession(@Param('id') id: string): Promise<SessionLogResponse> {
    return await this.sessionLogService.sessionLog({ id });
  }
}
