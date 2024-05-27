import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

@Module({
  providers: [TodoService, PrismaService],
  controllers: [TodoController],
})
export class TodoModule {}
