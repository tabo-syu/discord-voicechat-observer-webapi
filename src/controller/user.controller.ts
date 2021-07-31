import { Controller, Get, Param } from '@nestjs/common';
import { UserResponse } from 'src/types';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserResponse[]> {
    return await this.userService.users();
  }

  @Get(':id')
  async findUser(@Param('id') id: string): Promise<UserResponse> {
    return await this.userService.user({ id });
  }
}
