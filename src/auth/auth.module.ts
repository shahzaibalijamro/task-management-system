import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/task/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
