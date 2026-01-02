import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    host: 'localhost',
    database: 'mydb',
    username: 'postgres',
    password: 'postgres',
    autoLoadEntities: true,
    type: 'postgres',
    port: 5432,
    synchronize: true
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  }),
  TaskModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}