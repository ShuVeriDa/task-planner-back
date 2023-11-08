import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean;

  @IsBoolean()
  @IsOptional()
  isVisible: boolean;

  @IsDateString()
  @IsOptional()
  dateTime: Date;
}
