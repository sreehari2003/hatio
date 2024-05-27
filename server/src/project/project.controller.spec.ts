import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectService } from './project.service';

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [PrismaService, ProjectService],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
