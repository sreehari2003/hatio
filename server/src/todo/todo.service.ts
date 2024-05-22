import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProjects(userId: string) {
    try {
      const allProjects = await this.prisma.project.findMany({
        where: {
          userId,
        },
      });
      if (!allProjects) {
        throw new NotFoundException();
      }

      return {
        ok: true,
        message: 'Projects found successfully',
        data: allProjects,
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

  async createNewProject(uid: string, projectName: string) {
    try {
      const data = await this.prisma.user.update({
        where: {
          id: uid,
        },
        data: {
          projects: {
            create: {
              title: projectName,
            },
          },
        },
      });

      if (!data) {
        throw new NotFoundException();
      }

      return {
        ok: true,
        message: 'project created successfully',
        data,
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException();
    }
  }
}
