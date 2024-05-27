import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('TodoService', () => {
  let service: TodoService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService, PrismaService],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTodos', () => {
    it('should return all todos', async () => {
      const result = {
        ok: true,
        message: 'all todos successfully fetched',
        data: {
          createdAt: new Date('2024-05-27T13:41:59.397Z'),
          id: 'projectId',
          title: 'Sample Project',
          todos: [
            {
              createdAt: new Date('2024-05-27T13:41:59.397Z'),
              description: 'Test Description 1',
              id: 'todo1',
              isCompleted: false,
              projectId: 'projectId',
              title: 'Test Todo 1',
              updatedAt: new Date('2024-05-27T13:41:59.397Z'),
            },
            {
              createdAt: new Date('2024-05-27T13:41:59.397Z'),
              description: 'Test Description 2',
              id: 'todo2',
              isCompleted: true,
              projectId: 'projectId',
              title: 'Test Todo 2',
              updatedAt: new Date('2024-05-27T13:41:59.397Z'),
            },
          ],
          userId: 'userId',
        },
      };
      jest.spyOn(prisma.project, 'findUnique').mockResolvedValue(result.data);

      expect(await service.getAllTodos('userId', 'projectId')).toEqual(result);
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(prisma.project, 'findUnique').mockResolvedValue(null);

      await expect(service.getAllTodos('userId', 'projectId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const result = { ok: true, message: 'todo created successfully' };
      jest.spyOn(prisma.user, 'update').mockResolvedValue(null);

      expect(
        await service.createTodo('userId', 'projectId', {
          title: 'Test',
          description: 'Test',
        }),
      ).toEqual(result);
    });

    it('should throw InternalServerErrorException', async () => {
      jest.spyOn(prisma.user, 'update').mockRejectedValue(new Error());

      await expect(
        service.createTodo('userId', 'projectId', {
          title: 'Test',
          description: 'Test',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
