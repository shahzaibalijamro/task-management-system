import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService){}

    @Get()
    getAllTasks():Promise<Task[]>{
        return this.taskService.findAll();
    }
}
