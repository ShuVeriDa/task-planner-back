import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { use } from 'passport';
import { SearchUserDto } from './dto/search.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(dto: SearchUserDto) {
    const qb = this.userRepository.createQueryBuilder('user');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 100);

    if (dto.nickname) {
      qb.andWhere('user.nickname ILIKE :nickname');
    }

    qb.setParameters({
      nickname: `%${dto.nickname}%`,
    });

    const [users, total] = await qb
      .leftJoinAndSelect('user.tasks', 'tasks')
      .getManyAndCount();

    return { users: users.map((user) => this.returnUser(user)), total };
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
