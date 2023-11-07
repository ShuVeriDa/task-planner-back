import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entity/user.entity';
import { Repository } from 'typeorm';
import { TaskEntity } from './Entity/taskEntity';
import { CreateTaskDto } from './dto/create.dto';
import { UpdateTaskDto } from './dto/update.dto';
import * as moment from 'moment';
import { SortTaskDto } from './Entity/sort.dto';

@Injectable()
export class TaskService {
  @InjectRepository(UserEntity)
  private readonly useRepository: Repository<UserEntity>;
  @InjectRepository(TaskEntity)
  private readonly tasksRepository: Repository<TaskEntity>;

  async getAll(dto: SortTaskDto, userId: string) {
    const tasks = await this.tasksRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: dto.order },
    });

    return tasks.map((task) => {
      return this.returnTask(task);
    });
  }

  async getOne(taskId: string, userId: string) {
    const user = await this.useRepository.findOne({
      where: { id: userId },
      relations: ['tasks'],
    });

    if (!user) throw new NotFoundException('User not found');

    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
    });

    if (!task) throw new NotFoundException('Task not found');

    const isAuthor = task.user.id === user.id;

    if (!isAuthor)
      throw new ForbiddenException('You do not have access to this task');

    return this.returnTask(task);
  }

  async createTask(dto: CreateTaskDto, userId: string) {
    const user = await this.useRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const dateTime = moment.utc(dto.dateTime).toISOString();

    const task = await this.tasksRepository.save({
      title: dto.title,
      description: dto.description,
      dateTime: dateTime,
      completed: false,
      user: { id: userId },
    });

    const createdTask = await this.tasksRepository.findOne({
      where: { id: task.id },
    });

    return this.returnTask(createdTask);
  }

  async updateTask(dto: UpdateTaskDto, taskId: string, userId: string) {
    const task = await this.getOne(taskId, userId);

    await this.tasksRepository.update(
      {
        id: task.id,
      },
      {
        title: dto.title,
        description: dto.description,
        dateTime: dto.dateTime,
        completed: dto.completed,
      },
    );

    const updatedTask = await this.tasksRepository.findOne({
      where: { id: task.id },
    });

    return this.returnTask(updatedTask);
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.getOne(taskId, userId);

    await this.tasksRepository.delete({ id: task.id });
  }

  returnTask(task: TaskEntity) {
    delete task.user.password;

    return task;
  }
}
