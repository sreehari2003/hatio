import { Controller, Get, Post } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('/')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/project')
  async getAllProjects() {
    return await this.todoService.getAllProjects('');
  }

  @Post('/project')
  async createNewProject() {
    return await this.todoService.createNewProject('', '');
  }
}
