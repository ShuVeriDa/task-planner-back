import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { CreateTaskDto } from './dto/create.dto';
import { UpdateTaskDto } from './dto/update.dto';
import { SortTaskDto } from './dto/sort.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Get()
  @Auth()
  getAll(@Query() dto: SortTaskDto, @User('id') userId: string) {
    return this.tasksService.getAll(dto, userId);
  }

  @Get(':id')
  @Auth()
  getOne(@Param('id') taskId: string, @User('id') userId: string) {
    return this.tasksService.getOne(taskId, userId);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth()
  createTask(@Body() dto: CreateTaskDto, @User('id') userId: string) {
    return this.tasksService.createTask(dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @Post('share/:id')
  @HttpCode(200)
  @Auth()
  shareTask(
    @Param('id') taskId: string,
    @Body('nickname') nickname: string,
    @User('id') userId: string,
  ) {
    return this.tasksService.shareTask(taskId, nickname, userId);
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  @HttpCode(200)
  @Auth()
  updateTask(
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
    @User('id') userId: string,
  ) {
    return this.tasksService.updateTask(dto, taskId, userId);
  }

  @Delete(':id')
  @Auth()
  deleteTask(@Param('id') taskId: string, @User('id') userId: string) {
    return this.tasksService.deleteTask(taskId, userId);
  }
}
