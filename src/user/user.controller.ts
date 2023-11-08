import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { SearchUserDto } from './dto/search.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth()
  getAll(@Query() dto: SearchUserDto) {
    return this.userService.getAll(dto);
  }

  @Get(':id')
  @Auth()
  getOne(@Param('id') userId: string) {
    return this.userService.getOne(userId);
  }
}
