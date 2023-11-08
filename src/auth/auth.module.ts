import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as process from 'process';
import { TaskEntity } from '../task/Entity/taskEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
    JwtModule.register({
      secret: 'JWT_SECRET',
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
