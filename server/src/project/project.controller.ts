import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  Delete,
  Param,
  Res,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { EditProjectDto } from './dto/edit-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from '../auth/decorator/user.decorator';
import { User } from '@prisma/client';
import { NewProjectDto } from './dto/new-project-dto';
import { Response } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('')
  async getAllProjects(@AuthUser() user: User) {
    return await this.projectService.getAllProjects(user.id);
  }

  @Post('')
  async createNewProject(@AuthUser() user: User, @Body() data: NewProjectDto) {
    return await this.projectService.createNewProject(user.id, data.name);
  }

  @Patch('')
  async editProjectName(@Body() data: EditProjectDto, @AuthUser() user: User) {
    return await this.projectService.editProject(
      user.id,
      data.projectId,
      data.name,
    );
  }

  @Post('/:projectId/generate')
  async generateStats(
    @AuthUser() user: User,
    @Param('projectId') projectId: string,
    @Res() res: Response,
  ) {
    try {
      const { filePath, fileName } = await this.projectService.exportStats(
        user.id,
        projectId,
      );

      if (!filePath) {
        return res.status(500).json({ message: 'File not generated' });
      }

      res.download(filePath, `${fileName}.md`, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error downloading file' });
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Delete('/:projectId')
  async deleteProject(
    @AuthUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    return await this.projectService.deleteProject(user.id, projectId);
  }
}
