import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entity/user.entity';
import { Repository } from 'typeorm';
import { TaskEntity } from './Entity/taskEntity';
import { CreateTaskDto } from './dto/create.dto';

@Injectable()
export class TaskService {
  @InjectRepository(UserEntity)
  private readonly useRepository: Repository<UserEntity>;
  @InjectRepository(TaskEntity)
  private readonly tasksRepository: Repository<TaskEntity>;

  async getAll(userId: string) {
    const tasks = await this.tasksRepository.find({
      where: { user: { id: userId } },
    });

    return tasks.map((task) => {
      return this.returnTask(task);
    });
  }

  async createTask(dto: CreateTaskDto, userId: string) {
    const user = await this.useRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const task = await this.tasksRepository.save({
      title: dto.title,
      description: dto.description,
      dateTime: dto.dateTime,
      completed: false,
      user: { id: userId },
    });

    const createdTask = await this.tasksRepository.findOne({
      where: { id: task.id },
    });

    return this.returnTask(createdTask);
  }

  returnTask(task: TaskEntity) {
    delete task.user.password;

    return task;
  }
}
