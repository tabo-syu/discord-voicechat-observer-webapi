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

  @Get(':id/sessionLogs')
  async findSessionLogs(@Param('id') id: string): Promise<
    (SessionLogResponse & {
      leftAt: Date;
      username: string;
      avatarUrl: string;
    })[][]
  > {
    const sessionLogs = await this.sessionLogService.sessionLogs({
      where: {
        sessionId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const sessionUsers = await this.userService.users({
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

    const sessionUserLogs = sessionLogs.map((sessionLog) => {
      const user = sessionUsers.find((user) => user.id === sessionLog.userId);

      return {
        ...sessionLog,
        username: user?.username,
        avatarUrl: user?.avatarUrl,
      };
    });

    const uniqueUserIds = Array.from(
      new Set(sessionUserLogs.map((session) => session.userId)),
    );

    const logs = uniqueUserIds.map((userId) => {
      const sessionLogs = sessionUserLogs.filter(
        (session) => session.userId === userId,
      );
      const joinedLogs = sessionLogs.filter((log) => log.action === 'joined');
      const leftLogs = sessionLogs.filter((log) => log.action === 'left');

      return joinedLogs.map((joinedLog, index) => ({
        ...joinedLog,
        leftAt: leftLogs[index].createdAt,
      }));
    });

    return logs;
  }
}
