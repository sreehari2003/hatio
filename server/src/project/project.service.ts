import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
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
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException();
    }
  }

  async editProject(userId: string, projectId: string, name: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          projects: {
            update: {
              where: {
                id: projectId,
              },
              data: {
                title: name,
              },
            },
          },
        },
      });

      return {
        ok: true,
        message: 'name updated successfully',
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async deleteProject(id: string, projectId: string) {
    try {
      await this.prisma.project.delete({
        where: {
          id: projectId,
          userId: id,
        },
      });
      return {
        ok: true,
        message: 'project was deleted',
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
