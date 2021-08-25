import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { SessionResponse } from 'src/types';

type FindManyArgs = {
  skip?: number;
  take?: number;
  cursor?: Prisma.SessionWhereUniqueInput;
  where?: Prisma.SessionWhereInput;
  orderBy?: Prisma.SessionOrderByInput;
};

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async sessions(params: FindManyArgs): Promise<SessionResponse[]> {
    return await this.prisma.session.findMany(params);
  }

  async session(
    input: Prisma.SessionWhereUniqueInput,
  ): Promise<SessionResponse> {
    return await this.prisma.session.findUnique({
      where: input,
    });
  }
}
