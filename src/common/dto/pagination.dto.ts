import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
  @ApiPropertyOptional({
    description: 'Número de registros por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
