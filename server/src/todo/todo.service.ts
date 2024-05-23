import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/new-todo-dto';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { NewProjectDto } from 'src/project/dto/new-project-dto';

@Injectable()
export class TodoService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllTodos(userId: string, projectId: string) {
    try {
      const todos = await this.prismaService.project.findUnique({
        where: {
          id: projectId,
          userId: userId,
        },
        select: {
          title: true,
          todos: true,
        },
      });

      if (!todos) {
        throw new NotFoundException();
      }

      return {
        ok: true,
        message: 'all todos successfully fetched',
        data: todos,
      };
    } catch {
      throw new NotFoundException();
    }
  }

  async createTodo(user: string, projectId: string, data: CreateTodoDto) {
    try {
      await this.prismaService.user.update({
        where: {
          id: user,
        },
        data: {
          projects: {
            update: {
              where: {
                id: projectId,
              },
              data: {
                todos: {
                  create: {
                    title: data.title,
                    description: data.description,
                  },
                },
              },
            },
          },
        },
      });

      return {
        ok: true,
        message: 'todo created successfully',
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async updateTodo(
    userId: string,
    projectId: string,
    todoId: string,
    data: UpdateTodoDto,
  ) {
    try {
      const project = await this.doesUserHaveProject(userId, projectId);

      if (!project) {
        throw new NotFoundException();
      }

      const todo = await this.prismaService.todo.findUnique({
        where: {
          id: todoId,
          projectId: projectId,
        },
      });
      if (!todo) {
        throw new NotFoundException();
      }

      await this.prismaService.todo.update({
        where: {
          id: todoId,
          projectId: projectId,
        },
        data: {
          title: data.title || todo.title,
          description: data.description || todo.description,
          isCompleted: data.hasOwnProperty('isCompleted')
            ? data.isCompleted
            : todo.isCompleted,
        },
      });
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteTodo(todoId: string, userId: string, projectId: string) {
    try {
      const project = await this.doesUserHaveProject(userId, projectId);
      if (!project) {
        throw new NotFoundException();
      }
      await this.prismaService.todo.delete({
        where: {
          id: todoId,
          projectId: projectId,
        },
      });

      return {
        ok: true,
        message: 'todo was deleted successfully',
      };
    } catch {
      throw new NotFoundException();
    }
  }

  async doesUserHaveProject(user: string, project: string) {
    return await this.prismaService.project.findUnique({
      where: {
        id: project,
        userId: user,
      },
    });
  }
}
