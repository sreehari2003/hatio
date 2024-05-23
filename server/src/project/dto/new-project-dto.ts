import { IsNotEmpty, IsString } from 'class-validator';

export class NewProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
