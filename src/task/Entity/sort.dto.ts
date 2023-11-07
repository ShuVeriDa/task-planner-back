import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SortTaskDto {
  @IsOptional()
  @IsString()
  order?: 'DESC' | 'ASC';

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  take?: number;
}
