import { Controller, Get, Param } from '@nestjs/common';
import { SessionResponse, SessionLogResponse, UserResponse } from 'src/types';
import { SessionService } from '../service/session.service';
import { SessionLogService } from '../service/sessionLog.service';
import { UserService } from '../service/user.service';

@Controller('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionLogService: SessionLogService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getSessions(): Promise<SessionResponse[]> {
    return await this.sessionService.sessions({});
  }

  @Get(':id')
  async findSession(@Param('id') id: string): Promise<SessionResponse> {
    return await this.sessionService.session({ id });
  }

  @Get(':id/sessionLogs')
  async findSessionLogs(
    @Param('id') id: string,
  ): Promise<SessionLogResponse[]> {
    return await this.sessionLogService.sessionLogs({
      where: {
        sessionId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  @Get(':id/users')
  async findUsers(@Param('id') id: string): Promise<UserResponse[]> {
    const users = await this.userService.users({
      where: {
        SessionLogs: {
          some: {
            Session: {
              id: id,
            },
          },
        },
      },
    });

    return users;
  }
}
