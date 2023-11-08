import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SearchUserDto } from './dto/search.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(@Query() dto: SearchUserDto) {
    return this.userService.getAll(dto);
  }
}
