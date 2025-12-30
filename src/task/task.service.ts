import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto, FilterDto, IdDto, UpdateTaskStatusDto } from './task.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly task: Repository<Task>
    ) {}

    async findAll(filters: FilterDto): Promise<Task[]> {
        const { status, search } = filters;

        // Using QueryBuilder for more flexible search
        const query = this.task.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                'LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search',
                { search: `%${search.toLowerCase()}%` }
            );
        }

        const tasks = await query.getMany();

        if (tasks.length === 0) {
            throw new NotFoundException('Tasks not found!');
        }

        return tasks;
    }

    async findTaskById(id: string): Promise<Task>{
        const task = await this.task.findOne({
            where: {
                id,
            }
        })

        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found!`)
        }

        return task;
    }

    async createNewTask(body: CreateTaskDto): Promise<Task>{
        const {title,description}= body;
        const task = await this.task.save({
            title,
            description,
            status: Status.OPEN
        })
        return task;
    }

    async removeTaskById(id: string): Promise<Task>{
        const task = await this.findTaskById(id);
        await this.task.remove(task);
        return task
    }

    async updateTaskById(body: UpdateTaskStatusDto, id: string): Promise<Task>{
        const task = await this.findTaskById(id);
        task.status = body.status;
        await this.task.save(task);
        return task;
    }
}
