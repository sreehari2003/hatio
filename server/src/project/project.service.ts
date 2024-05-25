import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { Project, Todo } from '@prisma/client';

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

  private convertJsonToMarkdown(jsonData: ProjectWithTodo): string {
    const completedTodos = jsonData.todos.filter((el) => el.isCompleted);
    const pendingTodos = jsonData.todos.filter((el) => !el.isCompleted);

    let markdown = `# ${jsonData.title}\n\n`;

    markdown += `## Summary: ${completedTodos.length}/ ${
      completedTodos.length + pendingTodos.length
    } todos completed\n\n`;

    markdown += '## Pending\n';

    pendingTodos.forEach((section) => {
      markdown += `- [ ] ${section.title}\n`;
    });

    markdown += '\n## Completed\n';

    completedTodos.forEach((section) => {
      markdown += `- [x] ${section.title}\n`;
    });

    return markdown;
  }
  async exportStats(
    userId: string,
    projectId: string,
  ): Promise<Record<string, any>> {
    try {
      const project = await this.prisma.project.findUnique({
        where: {
          id: projectId,
          userId: userId,
        },
        select: {
          todos: true,
          title: true,
        },
      });

      const markDown = this.convertJsonToMarkdown(project as ProjectWithTodo);

      const filePath = path.join(
        __dirname,
        '..',
        'files',
        project.title.trim().replace(/ /g, ''),
      );
      // Ensure the directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, markDown);
      return {
        filePath,
        fileName: project.title.trim().replace(/ /g, ''),
      };
    } catch (e) {
      throw new InternalServerErrorException({
        message: e,
      });
    }
  }
}

interface ProjectWithTodo extends Project {
  todos: Todo[];
}
