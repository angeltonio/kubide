import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @IsStrongPassword()
  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'SecurePassword123!',
  })
  password: string;
}
