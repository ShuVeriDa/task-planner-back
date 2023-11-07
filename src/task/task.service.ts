import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entity/user.entity';
import { Repository } from 'typeorm';
import { TaskEntity } from './Entity/taskEntity';
import { CreateTaskDto } from './dto/create.dto';
import { UpdateTaskDto } from './dto/update.dto';
import moment from 'moment';

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

    const taskIsExist = user.tasks.some((t) => t.id === task.id);

    if (!taskIsExist) throw new NotFoundException('Task not found');

    return this.returnTask(task);
  }

  async createTask(dto: CreateTaskDto, userId: string) {
    const user = await this.useRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const dateTime = new Date(dto.dateTime);
    console.log(new Date());

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

  returnTask(task: TaskEntity) {
    delete task.user.password;

    return task;
  }
}
