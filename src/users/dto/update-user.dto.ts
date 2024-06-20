import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'El nombre del usuario actualizado',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'El email del usuario actualizado',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'La contraseña del usuario actualizado',
    example: 'password',
  })
  @IsStrongPassword()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'El rol del usuario actualizado',
    example: ['admin', 'user'],
    isArray: true,
    type: String,
  })
  @IsArray()
  roles: string[];
}
