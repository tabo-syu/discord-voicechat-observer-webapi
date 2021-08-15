import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SessionLogResponse } from 'src/types';

@Injectable()
export class SessionLogService {
  constructor(private prisma: PrismaService) {}

  async sessionLogs(): Promise<SessionLogResponse[]> {
    return await this.prisma.sessionLog.findMany();
  }

  async sessionLog(id: string): Promise<SessionLogResponse> {
    return await this.prisma.sessionLog.findUnique({
      where: {
        id,
      },
    });
  }
}
