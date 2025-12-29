import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto, FilterDto, IdDto } from './task.dto';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService){}

    @Get()
    getAllTasks(
        @Param() filters: FilterDto
    ):Promise<Task[]>{
        return this.taskService.findAll(filters);
    }

    @Get(':id')
    getTaskById(
        @Param('id') params: IdDto
    ): Promise<Task> {
        return this.taskService.findTaskById(params.id);
    }

    @Post()
    createTask(
        @Body() body: CreateTaskDto
    ): Promise<Task> {
        return this.taskService.createNewTask(body);
    }
}
