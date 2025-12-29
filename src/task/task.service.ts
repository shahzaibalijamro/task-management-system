import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly task: Repository<Task>
    ) {}

    async findAll(): Promise<Task[]> {
        const tasks = await this.task.find();
        if (tasks.length === 0) {
            throw new NotFoundException('Tasks not found!')
        }
        return tasks;
    }
}
