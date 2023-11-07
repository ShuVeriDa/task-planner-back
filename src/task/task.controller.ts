import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Get()
  @Auth()
  getAll(@User('id') userId: string) {
    return this.tasksService.getAll(userId);
  }
}
