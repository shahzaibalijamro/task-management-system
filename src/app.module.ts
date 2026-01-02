import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'postgres',
      url: config.get<string>('DATABASE_URL'),
      autoLoadEntities: true,
      synchronize: true
    })
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