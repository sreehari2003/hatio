import { IsNotEmpty, IsString } from 'class-validator';

export class EditProjectDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
