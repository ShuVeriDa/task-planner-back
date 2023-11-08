import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskEntity } from '../../task/Entity/taskEntity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @OneToMany(() => TaskEntity, (task) => task.user, {
    eager: false,
    nullable: true,
  })
  tasks: TaskEntity[];

  @ManyToMany(() => TaskEntity, (tasks) => tasks.grantedAccess)
  @JoinTable()
  availableTasks: TaskEntity[];
  // availableTasks: TaskEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
