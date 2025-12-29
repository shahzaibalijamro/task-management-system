import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  }),TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}