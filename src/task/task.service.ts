import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entity/user.entity';
import { Repository } from 'typeorm';
import { TaskEntity } from './Entity/taskEntity';

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

    return tasks;
  }
}
