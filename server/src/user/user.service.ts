import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, password: string) {
    try {
      const userInfo = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (userInfo) {
        throw new ConflictException();
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      user.password = undefined;
      return {
        ok: true,
        message: 'user was created successfully',
        user: userInfo.id,
      };
    } catch (e) {
      if (e instanceof ConflictException) {
        throw new ConflictException();
      } else {
        throw new InternalServerErrorException({
          error: e,
        });
      }
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    const doesPassWordMatch = await bcrypt.compare(password, user.password);
    if (user && doesPassWordMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async updateRefreshToken(uid: string, token: string) {
    try {
      const response = await this.prisma.user.update({
        where: {
          id: uid,
        },
        data: {
          refreshToken: token,
        },
      });
      if (!response) {
        throw new NotFoundException();
      }

      return {
        ok: true,
        message: 'Refresh token updated successfully',
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException({
        error: e,
      });
    }
  }

  async getUserInfo(id: string) {
    try {
      const data = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!data) {
        throw new NotFoundException();
      }

      data.password = undefined;
      data.refreshToken = undefined;

      return {
        ok: true,
        message: 'User found successfully',
        data,
      };
    } catch {
      throw new NotFoundException();
    }
  }
}
