import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/new-todo-dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/decorator/user.decorator';
import { User } from '@prisma/client';
import { Patch } from '@nestjs/common/decorators';
import { UpdateTodoDto } from './dto/update-todo-dto';

@UseGuards(AuthGuard('jwt'))
@Controller('/todo/:projectId')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get('')
  async getAllTodo(@Param('projectId') id: string, @AuthUser() user: User) {
    return await this.todoService.getAllTodos(user.id, id);
  }

  @Post('')
  async createTodo(
    @Param('projectId') id: string,
    @Body() data: CreateTodoDto,
    @AuthUser() user: User,
  ) {
    return await this.todoService.createTodo(user.id, id, data);
  }

  @Delete('/:todoId')
  async deleteTodo(
    @Param('projectId') id: string,
    @Param('todoId') todoId: string,
    @AuthUser() user: User,
  ) {
    return await this.todoService.deleteTodo(todoId, user.id, id);
  }

  @Patch('/:todoId')
  async updateTodo(
    @AuthUser() user: User,
    @Param('projectId') id: string,
    @Param('todoId') todoId: string,
    @Body() data: UpdateTodoDto,
  ) {
    return await this.todoService.updateTodo(user.id, id, todoId, data);
  }
}
