import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto, FilterDto, IdDto, UpdateTaskStatusDto } from './task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
    constructor(private taskService: TaskService){}

    @Get()
    getAllTasks(
        @Query() filters: FilterDto
    ):Promise<Task[]>{
        return this.taskService.findAll(filters);
    }

    @Get(':id')
    getTaskById(
        @Param() params: IdDto
    ): Promise<Task> {
        return this.taskService.findTaskById(params.id);
    }

    @Post()
    createTask(
        @Body() body: CreateTaskDto
    ): Promise<Task> {
        return this.taskService.createNewTask(body);
    }

    @Delete(':id')
    deleteTaskById(
        @Param() params: IdDto
    ): Promise<Task>{
        return this.taskService.removeTaskById(params.id)
    }

    @Patch(':id')
    updateTaskStatusById(
        @Body() body: UpdateTaskStatusDto,
        @Param() params: IdDto
    ): Promise<Task>{
        return this.taskService.updateTaskById(body, params.id)
    }
}
