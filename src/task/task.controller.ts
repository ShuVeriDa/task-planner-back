import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { CreateTaskDto } from './dto/create.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Get()
  @Auth()
  getAll(@User('id') userId: string) {
    return this.tasksService.getAll(userId);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  createTask(@Body() dto: CreateTaskDto, @User('id') userId: string) {
    return this.tasksService.createTask(dto, userId);
  }
}
