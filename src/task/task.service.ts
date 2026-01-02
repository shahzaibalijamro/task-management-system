import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status, Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto, FilterDto, UpdateTaskStatusDto } from './task.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly task: Repository<Task>
    ) {}

    async findAll(filters: FilterDto, user: User): Promise<Task[]> {
        const { status, search } = filters;

        // Using QueryBuilder for more flexible search
        const query = this.task.createQueryBuilder('task');

        query.andWhere('task.userId = :id', {id: user.id})

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE :search)',
                { search: `%${search.toLowerCase()}%` }
            );
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async findTaskById(id: string, user: User): Promise<Task>{
        const task = await this.task.findOne({
            where: {
                id,
                user,
            }
        })

        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found!`)
        }

        return task;
    }

    async createNewTask(body: CreateTaskDto, user: User): Promise<Task>{
        const {title,description}= body;
        const task = await this.task.save({
            title,
            description,
            status: Status.OPEN,
            user
        })
        return task;
    }

    async removeTaskById(id: string, user: User): Promise<Task>{
        const task = await this.findTaskById(id,user);
        await this.task.remove(task);
        return task
    }

    async updateTaskById(body: UpdateTaskStatusDto, id: string, user: User): Promise<Task>{
        const task = await this.findTaskById(id,user);
        task.status = body.status;
        await this.task.save(task);
        return task;
    }
}
