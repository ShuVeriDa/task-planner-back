import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { TaskEntity } from './Entity/taskEntity';
import { CreateTaskDto } from './dto/create.dto';
import { UpdateTaskDto } from './dto/update.dto';
import * as moment from 'moment';
import { SortTaskDto } from './dto/sort.dto';

@Injectable()
export class TaskService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;
  @InjectRepository(TaskEntity)
  private readonly tasksRepository: Repository<TaskEntity>;

  async getAll(dto: SortTaskDto, userId: string) {
    const tasks = await this.tasksRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: dto.order },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['availableTasks'],
    });

    const availableTasks = user.availableTasks.map((t) => {
      const task = this.returnTask(t);
      const { id, nickname } = task.user;
      delete task.grantedAccess;
      return {
        ...task,
        user: { id, nickname },
      };
    });

    const myTasks = tasks.map((t) => {
      return this.returnTask(t);
    });

    return {
      myTasks: myTasks,
      availableTasks: availableTasks,
    };
  }

  async getOne(taskId: string, userId: string) {
    const user = await this.userRepository.findOne({
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
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const dateTime = moment.utc(dto.dateTime).toISOString();

    const task = await this.tasksRepository.save({
      title: dto.title,
      description: dto.description,
      dateTime: dateTime,
      completed: dto.isVisible ? dto.isVisible : false,
      isVisible: false,
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
        isVisible: dto.isVisible,
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

  async shareTask(taskId: string, friendId: string, userId: string) {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['grantedAccess'],
    });

    if (!task) throw new NotFoundException('Task not found');

    const friendUser = await this.userRepository.findOne({
      where: { id: friendId },
    });
    if (!friendUser) throw new NotFoundException('Friend not found');

    const isShared = task.grantedAccess.some(
      (friend) => friend.id === friendUser.id,
    );

    // console.log(task.grantedAccess);

    if (!isShared) {
      await this.tasksRepository.save({
        ...task,
        grantedAccess: [...task.grantedAccess, { id: friendUser.id }],
      });

      return await this.getOne(task.id, userId);
    }

    if (isShared) {
      task.grantedAccess = task.grantedAccess.filter(
        (friend) => friend.id !== friendUser.id,
      );

      await this.tasksRepository.save(task);

      return await this.getOne(task.id, userId);
    }
  }

  returnTask(task: TaskEntity) {
    delete task.user.password;

    const grantedAccess = task.grantedAccess.map((user) => {
      return {
        id: user.id,
        nickname: user.nickname,
      };
    });

    return {
      ...task,
      user: {
        id: task.user.id,
        nickname: task.user.nickname,
      },
      grantedAccess: grantedAccess,
    };
  }
}
