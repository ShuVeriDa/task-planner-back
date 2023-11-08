import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isVisible: boolean;

  @IsDateString()
  dateTime: Date;
}
