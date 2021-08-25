import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { SessionLogResponse } from 'src/types';

type FindManyArgs = {
  skip?: number;
  take?: number;
  cursor?: Prisma.SessionLogWhereUniqueInput;
  where?: Prisma.SessionLogWhereInput;
  orderBy?: Prisma.SessionLogOrderByInput;
};

@Injectable()
export class SessionLogService {
  constructor(private prisma: PrismaService) {}

  async sessionLogs(params: FindManyArgs): Promise<SessionLogResponse[]> {
    return await this.prisma.sessionLog.findMany(params);
  }

  async sessionLog(
    input: Prisma.SessionLogWhereUniqueInput,
  ): Promise<SessionLogResponse> {
    return await this.prisma.sessionLog.findUnique({
      where: input,
    });
  }
}
