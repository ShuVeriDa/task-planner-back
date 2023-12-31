import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: false })
  dateTime: Date;

  @Column({ nullable: false, default: false })
  isVisible: boolean;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.availableTasks, {
    eager: true,
    nullable: false,
  })
  // @JoinTable()
  @JoinColumn({ name: 'userId' })
  grantedAccess: UserEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
