import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SessionResponse } from 'src/types';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async sessions(): Promise<SessionResponse[]> {
    return await this.prisma.session.findMany();
  }

  async session(id: string): Promise<SessionResponse> {
    return await this.prisma.session.findUnique({
      where: {
        id,
      },
    });
  }
}
