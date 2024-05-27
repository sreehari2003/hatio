import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let prisma: PrismaService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService, PrismaService, UserService],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prisma = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should be able to', () => {
    it('create a project', async () => {
      const project = {
        id: 'userId123',
        title: 'hello',
        userId: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prisma.project, 'create').mockResolvedValue(project);
      await userService.createUser(project.userId, '123');
      expect(
        await service.createNewProject(project.userId, project.title),
      ).toBe({
        ...project,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });
});
