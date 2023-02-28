import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsPositive()
  offset: number;

  @IsOptional()
  @IsPositive()
  limit: number;
}
