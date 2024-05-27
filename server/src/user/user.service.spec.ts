import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const user = {
        id: 'userId',
        email: 'jhondoe@gmail.com',
        password: 'encryptedPassWord',
        refreshToken: null,
        createdAt: new Date(),
      };
      jest.spyOn(prisma.user, 'create').mockResolvedValue(user);

      expect(
        await service.createUser('jhondoe@gmail.com', 'encryptedPassWord'),
      ).toStrictEqual({
        message: 'user was created successfully',
        ok: true,
        user: 'userId',
      });
    });
  });
});
