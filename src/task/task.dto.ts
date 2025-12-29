import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Status } from './task.entity';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  title: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @Transform(({ value }) => value.trim())
  description: string;
}

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}

export class FilterDto {
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  search?: string;
}