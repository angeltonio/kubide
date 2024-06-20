import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  from: string;
  @IsUUID()
  @IsString()
  @ApiProperty({
    description: 'UUID del usuario al que se envia el mensaje',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  to: string;
  @IsString()
  @ApiProperty({
    description: 'Contenido del mensaje',
    example: 'Hola, como estan?',
  })
  content: string;
}
