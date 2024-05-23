import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { EditProjectDto } from './dto/edit-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/decorator/user.decorator';
import { User } from '@prisma/client';
import { NewProjectDto } from './dto/new-project-dto';

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
}
