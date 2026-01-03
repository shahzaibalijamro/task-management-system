import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto, FilterDto, IdDto, UpdateTaskStatusDto } from './task.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators';
import { User } from '../auth/user.entity';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
    constructor(private taskService: TaskService){}

    @Get()
    getAllTasks(
        @Query() filters: FilterDto,
        @GetUser() user: User
    ):Promise<Task[]>{
        return this.taskService.findAll(filters,user);
    }

    @Get(':id')
    getTaskById(
        @Param() params: IdDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.findTaskById(params.id,user);
    }

    @Post()
    createTask(
        @Body() body: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.taskService.createNewTask(body,user);
    }

    @Delete(':id')
    deleteTaskById(
        @Param() params: IdDto,
        @GetUser() user: User
    ): Promise<Task>{
        return this.taskService.removeTaskById(params.id,user)
    }

    @Patch(':id')
    updateTaskStatusById(
        @Body() body: UpdateTaskStatusDto,
        @Param() params: IdDto,
        @GetUser() user: User
    ): Promise<Task>{
        return this.taskService.updateTaskById(body, params.id,user)
    }
}
