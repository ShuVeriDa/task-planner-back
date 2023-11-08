import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { use } from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll() {
    const users = await this.userRepository.find({
      relations: ['tasks'],
    });

    return users.map((user) => this.returnUser(user));
  }

  returnUser(user: UserEntity) {
    const tasks = user.tasks.filter((task) => task.isVisible);
    const task = tasks.map((task) => {
      delete task.user;
      return task;
    });
    delete user.password;
    return {
      ...user,
      tasks: task,
    };
  }
}
