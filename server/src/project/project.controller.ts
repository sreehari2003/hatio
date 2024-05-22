import { Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('')
  async getAllProjects() {
    return await this.projectService.getAllProjects('');
  }

  @Post('')
  async createNewProject() {
    return await this.projectService.createNewProject('', '');
  }
}
