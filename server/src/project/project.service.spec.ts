import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService, PrismaService],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should be able to', () => {
    it('create a project', async () => {
      const project = {
        id: 'userId',
        title: 'hello',
        userId: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.project, 'create').mockResolvedValue(project);
      expect(await service.createNewProject(project.title, project.title)).toBe(
        {
          ...project,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );
    });
  });
});
